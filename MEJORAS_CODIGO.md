# Propuesta de Mejoras - Análisis de Código Base

**Fecha:** Diciembre 2025  
**Contexto:** Mockup para diseño de aplicación fullstack posterior (T3 sobre Azure SQL)  
**Estado:** No funcional, solo para análisis, diseño y compartir con usuario

---

## Prioridad 1: Eliminación de Código Innecesario (CRÍTICO)

### 1.1. Código de Debug en Producción
**Ubicación:** `Mockup_Folder/src/components/nextcell/Nextcell.tsx:273`

```typescript
// ELIMINAR - Código de debug innecesario
useEffect(() => {
  if (typeof window !== 'undefined') {
    ;(window as any).__nextcellData = data
  }
}, [data])
```

**Acción:** Eliminar completamente este `useEffect`. No tiene utilidad en un mockup y expone datos innecesariamente.

**Impacto:** Bajo riesgo, mejora limpieza del código.

---

### 1.2. Función No Utilizada
**Ubicación:** `Mockup_Folder/src/lib/powerbi.ts:30-52`

```typescript
// ELIMINAR - Función no utilizada en ningún lugar
export function getPowerBIEmbedUrl(config: PowerBIReportConfig): string {
  // ... 22 líneas de código no utilizado
}
```

**Acción:** Eliminar la función `getPowerBIEmbedUrl`. No se importa ni se usa en ningún componente.

**Impacto:** Bajo riesgo, reduce código muerto.

---

### 1.3. Console.logs de Debug
**Ubicaciones:**
- `Mockup_Folder/src/App.tsx:146` - Power BI configuration log
- `Mockup_Folder/src/components/nextcell/Nextcell.tsx:1008` - Demo data log
- `Mockup_Folder/src/components/PowerBIEmbed.tsx:78, 85, 97` - Report loading logs
- `Mockup_Folder/src/lib/powerbi.ts:139` - Embed token warning

**Acción:** Eliminar todos los `console.log`, `console.warn`, `console.error` de debug. En un mockup no son necesarios.

**Impacto:** Bajo riesgo, mejora limpieza. Los errores reales de Power BI pueden mantenerse si son críticos para el usuario.

**Excepción:** Mantener `console.error` en `PowerBIEmbed.tsx:97` si es necesario para debugging de integración, pero documentarlo.

---

## Prioridad 2: Refactor Crítico - Abstracciones Necesarias

### 2.1. División de App.tsx (ALTA PRIORIDAD)
**Problema:** `App.tsx` tiene ~830 líneas, mezcla múltiples responsabilidades.

**Estructura actual:**
- Lógica de navegación
- Gestión de estado (16+ useState)
- Renderizado de múltiples paneles
- Handlers de eventos
- Lógica de resize

**Propuesta de refactor:**

```
src/
├── components/
│   ├── layout/
│   │   ├── LeftPanel.tsx          # Menú izquierdo
│   │   ├── CenterPanel.tsx         # Panel central (selección)
│   │   ├── RightPanel.tsx          # Panel derecho (edición)
│   │   └── ResizablePanels.tsx     # Lógica de resize
│   ├── modules/
│   │   ├── SalesData.tsx
│   │   ├── MarketInsights.tsx
│   │   ├── PatientsNewsDropouts.tsx
│   │   ├── CountriesSetup.tsx
│   │   └── Users.tsx
│   └── ...
└── hooks/
    ├── usePanelResize.ts          # Hook para resize
    ├── useSelection.ts             # Hook para selecciones
    └── useNavigation.ts           # Hook para navegación
```

**Acción:** Extraer componentes y hooks de forma incremental.

**Impacto:** Alto - Mejora mantenibilidad y testabilidad.

**Riesgo:** Medio - Requiere cuidado con estado compartido.

---

### 2.2. Hook Personalizado para Resize de Paneles
**Ubicación:** `Mockup_Folder/src/App.tsx:45-48, 200-250` (aproximadamente)

**Problema:** Lógica de resize duplicada y mezclada con componente principal.

**Propuesta:**

```typescript
// hooks/usePanelResize.ts
export function usePanelResize(
  initialLeft: number,
  initialCenter: number,
  minLeft: number = 160,
  maxLeft: number = 400,
  minRight: number = 400
) {
  // Lógica de resize extraída
  // Retorna: { leftWidth, centerWidth, handlers, isResizing }
}
```

**Acción:** Crear hook reutilizable para gestión de resize.

**Impacto:** Medio - Reduce duplicación y mejora reutilización.

---

### 2.3. Context API para Estado Compartido
**Problema:** 16+ estados `useState` en `App.tsx`, muchos pasados como props.

**Propuesta:**

```typescript
// contexts/AppContext.tsx
interface AppContextType {
  currentModule: MainModuleKey
  currentSubmodule: SubmoduleKey
  selectedItem: SelectedItem
  // ... otros estados compartidos
  // ... handlers compartidos
}
```

**Acción:** Crear Context API para estado global de la aplicación.

**Impacto:** Alto - Reduce prop drilling y mejora organización.

**Riesgo:** Bajo - Context API es estándar en React.

---

## Prioridad 3: Mejoras TypeScript y React

### 3.1. Eliminación de `any` Types
**Ubicaciones:**
- `Mockup_Folder/src/components/nextcell/Nextcell.tsx:273` - `(window as any)`
- `Mockup_Folder/src/components/PowerBIEmbed.tsx:84` - `(event as any).detail`

**Acción:**
1. Eliminar `(window as any).__nextcellData` (ya identificado en 1.1)
2. Tipar correctamente el evento de Power BI:

```typescript
// En lugar de:
const errorDetail = (event as any).detail

// Usar:
interface PowerBIErrorEvent {
  detail?: {
    message?: string
    errorCode?: string
  }
}
const errorDetail = (event as PowerBIErrorEvent).detail
```

**Impacto:** Medio - Mejora type safety.

---

### 3.2. Optimización de Re-renders
**Problema:** `App.tsx` puede tener re-renders innecesarios.

**Acción:**
- Usar `useMemo` para cálculos costosos
- Usar `useCallback` para handlers pasados como props
- Revisar dependencias de `useEffect`

**Ejemplo:**

```typescript
// En lugar de calcular en cada render:
const selectedCountryName = selectedItem?.type === 'country' ? selectedItem.value : null

// Usar useMemo:
const selectedCountryName = useMemo(() => 
  selectedItem?.type === 'country' ? selectedItem.value : null,
  [selectedItem]
)
```

**Impacto:** Medio - Mejora rendimiento (aunque en mockup no es crítico).

---

### 3.3. Separación de Lógica de Negocio
**Problema:** Lógica de cálculo de fórmulas mezclada en componentes.

**Acción:** Extraer funciones de cálculo a módulos separados:

```typescript
// lib/calculations.ts
export function calculateTurnover(vol: number, price: number): string {
  // Lógica de cálculo
}

export function calculateMarketShare(
  marketSales: number,
  totalMarketSales: number
): string {
  // Lógica de cálculo
}
```

**Impacto:** Medio - Mejora testabilidad y reutilización.

---

## Prioridad 4: Mejoras Menores

### 4.1. Eliminación de Comentarios Obsoletos
**Acción:** Revisar y eliminar comentarios que ya no aplican o están desactualizados.

**Impacto:** Bajo - Mejora legibilidad.

---

### 4.2. Consistencia en Naming
**Revisar:**
- Nombres de variables consistentes (camelCase)
- Nombres de componentes (PascalCase)
- Nombres de archivos (PascalCase para componentes, camelCase para utilidades)

**Impacto:** Bajo - Mejora mantenibilidad.

---

### 4.3. Documentación JSDoc
**Acción:** Añadir JSDoc a funciones complejas y componentes principales.

**Impacto:** Bajo - Mejora documentación (ya hay algunos JSDoc, extender).

---

## Prioridad 5: Actualizaciones de Versiones (Solo si Crítico)

### 5.1. Revisión de Dependencias
**Estado actual:**
- React: ^19.2.0 (última versión)
- TypeScript: ~5.9.3 (última versión)
- Vite: ^7.2.2 (última versión)
- Tailwind: ^4.1.17 (última versión)

**Acción:** Las versiones están actualizadas. No requiere cambios a menos que haya vulnerabilidades de seguridad.

**Impacto:** N/A - Ya está actualizado.

---

## Resumen de Prioridades

### 🔴 CRÍTICO (Hacer primero):
1. Eliminar código de debug (`window.__nextcellData`)
2. Eliminar función no utilizada (`getPowerBIEmbedUrl`)
3. Eliminar console.logs innecesarios

### 🟡 ALTA (Hacer después):
4. Dividir `App.tsx` en componentes más pequeños
5. Crear hooks personalizados (resize, selección)
6. Implementar Context API para estado compartido

### 🟢 MEDIA (Mejoras opcionales):
7. Eliminar tipos `any`
8. Optimizar re-renders con `useMemo`/`useCallback`
9. Extraer lógica de cálculo a módulos separados

### ⚪ BAJA (Nice to have):
10. Limpieza de comentarios obsoletos
11. Consistencia en naming
12. Extender documentación JSDoc

---

## Notas de Implementación

- **Enfoque incremental:** Realizar cambios en orden de prioridad, verificando que la aplicación sigue funcionando.
- **Testing:** Después de cada cambio, verificar manualmente que el mockup se renderiza correctamente.
- **Commits:** Hacer commits pequeños y frecuentes para facilitar rollback si es necesario.
- **Mockup context:** Recordar que es un mockup, no una aplicación funcional. Priorizar claridad y mantenibilidad sobre optimizaciones de rendimiento.

---

## Consideración Especial

**Contexto del proyecto:** Esta aplicación es un **mockup para el diseño de una aplicación fullstack posterior** empleando T3 sobre Azure SQL. No dispone de backend y no es funcional. Es solo un medio para analizar, diseñar y compartir con el usuario.

Por lo tanto:
- No es necesario implementar optimizaciones de rendimiento complejas
- No es necesario implementar manejo de errores robusto
- No es necesario implementar validaciones de datos exhaustivas
- **SÍ es importante:** Mantener código limpio, bien estructurado y fácil de entender para facilitar el diseño de la aplicación final.

