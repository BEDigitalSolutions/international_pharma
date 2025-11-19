# Análisis de Refactorización - Mockup_Folder

**Fecha:** 19 de noviembre de 2025  
**Estado:** Análisis inicial

## 1. Estado Actual del Código

### Archivo Principal: `App.tsx`
- **Líneas de código:** ~1417 líneas
- **Complejidad:** Muy alta
- **Problemas identificados:**
  - Monolito: Todo el código en un solo archivo
  - Mezcla de responsabilidades: datos, lógica y UI
  - Difícil mantenimiento y testing
  - Múltiples componentes no abstraídos

### Estructura Actual:
```
src/
├── App.tsx (1417 líneas) ❌ MONOLITO
├── components/
│   ├── nextcell/
│   │   ├── Nextcell.tsx ✅
│   │   └── types.ts ✅
│   └── ui/
│       └── button.tsx ✅
└── lib/
    ├── powerbi.ts ✅
    └── utils.ts ✅
```

## 2. Problemas Identificados

### A. Datos Hardcodeados en App.tsx (líneas 21-190)
- `countries` (28 líneas)
- `patientsCountries`
- `countriesByContinent`
- `productGroups`
- `productsFlat`
- `companies`
- `months`
- `users`
- `groups`
- `groupFunctions`
- `currencies`
- `menuStructure` (70+ líneas)

**Riesgo:** Bajo - Datos estáticos fáciles de extraer  
**Impacto:** Alto - Mejora significativa en legibilidad

### B. Componentes No Abstraídos
1. **Panel de Menú Izquierdo** (~200 líneas)
   - Renderizado de módulos H1
   - Renderizado de submódulos H2
   - Manejo de navegación
   
2. **Panel Central** (~300 líneas)
   - Lista de países
   - Lista de productos
   - Tabs de usuarios
   - Selector de continentes

3. **Panel Derecho** (~600 líneas)
   - Matrices de datos (Patients, Sales, Market)
   - Formulario de Countries Setup
   - Gestión de usuarios
   - Reportes Power BI

4. **Componentes Repetidos:**
   - Botones de selección (países, productos)
   - Checkboxes (price types, countries)
   - Tablas de entrada de datos

**Riesgo:** Medio-Alto - Lógica de estado compartida  
**Impacto:** Muy Alto - Mejora dramática en mantenibilidad

### C. Lógica de Estado (líneas 298-340)
- 10+ estados useState
- Lógica de resize de paneles
- Gestión de selección
- Estados de Exchange Rates

**Riesgo:** Alto - Estado compartido entre componentes  
**Impacto:** Alto - Mejor organización con Context API o zustand

### D. Handlers y Funciones Auxiliares
- `handleSelectCountry`
- `handleSelectProduct`
- `handleSelectGroup`
- `handleSelectUser`
- `handleCountryToggle`
- `handlePriceTypeToggle`
- `handleAddExchangeRate`
- `handleDeleteExchangeRate`
- Funciones de resize

**Riesgo:** Medio - Dependencias con estado  
**Impacto:** Alto - Reutilización y testing

## 3. Componentes Shadcn Disponibles

Actualmente solo se usa:
- `Button` ✅

**Componentes Shadcn que deberíamos agregar:**
- `Select` - Para dropdowns (Currency, Continent, etc.)
- `Tabs` - Para Users/Groups tabs
- `Card` - Para user cards y secciones
- `Label` - Para labels de formularios
- `Input` - Para inputs de texto
- `Checkbox` - Para multi-selección
- `Table` - Para Exchange Rates table
- `ScrollArea` - Para listas largas
- `Separator` - Para separadores visuales
- `Sheet` o `Dialog` - Para futuras acciones modales

**Riesgo:** Bajo - Componentes estables y bien documentados  
**Impacto:** Alto - UI consistente y accesible

## 4. Plan de Refactorización (Incremental)

### Fase 1: Extracción de Datos (BAJO RIESGO)
**Objetivo:** Mover datos estáticos a archivos separados

1. Crear `src/data/constants.ts`
   - countries, patientsCountries, countriesByContinent
   - productGroups, productsFlat, companies
   - months, currencies
   
2. Crear `src/data/users.ts`
   - users, groups, groupFunctions
   
3. Crear `src/data/menuStructure.ts`
   - menuStructure con tipos

**Test:** Verificar que la app se renderiza igual  
**Esfuerzo:** 30 minutos  
**Riesgo:** ⭐ Muy Bajo

### Fase 2: Instalación de Componentes Shadcn (BAJO RIESGO)
**Objetivo:** Agregar componentes shadcn necesarios

1. Instalar shadcn-ui CLI
2. Agregar componentes: Select, Tabs, Card, Label, Input, Checkbox, Table, ScrollArea, Separator

**Test:** Verificar build sin errores  
**Esfuerzo:** 20 minutos  
**Riesgo:** ⭐ Muy Bajo

### Fase 3: Extracción de Componentes UI Simples (BAJO-MEDIO RIESGO)
**Objetivo:** Extraer componentes sin lógica compleja

1. `CountryButton.tsx` - Botón de selección de país
2. `ProductButton.tsx` - Botón de selección de producto
3. `UserCard.tsx` - Tarjeta de usuario
4. `ExchangeRateTable.tsx` - Tabla de tipos de cambio
5. `PriceTypesSelector.tsx` - Checkboxes de price types

**Test:** Verificar que cada componente se renderiza igual  
**Esfuerzo:** 2 horas  
**Riesgo:** ⭐⭐ Bajo

### Fase 4: Extracción de Paneles Principales (MEDIO RIESGO)
**Objetivo:** Extraer los 3 paneles principales

1. `LeftMenuPanel.tsx` - Panel de menú izquierdo
   - Props: currentModule, currentSubmodule, menuStructure, handlers
   
2. `CenterSelectionPanel.tsx` - Panel central con switch por módulo
   - Props: currentSubmodule, selectedItem, handlers, data
   
3. `RightContentPanel.tsx` - Panel derecho con switch por módulo
   - Props: currentSubmodule, selectedItem, data, handlers

**Test:** Verificar navegación y selección funcionan  
**Esfuerzo:** 4 horas  
**Riesgo:** ⭐⭐⭐ Medio

### Fase 5: Gestión de Estado con Context (ALTO RIESGO)
**Objetivo:** Centralizar estado en Context API

1. `AppContext.tsx` - Context para estado global
2. `useAppState.ts` - Hook personalizado
3. Migrar useState a Context

**Test:** Verificar que todo el flujo de datos funciona  
**Esfuerzo:** 3 horas  
**Riesgo:** ⭐⭐⭐⭐ Alto - NO IMPLEMENTAR si tests fallan

### Fase 6: Optimizaciones Adicionales (BAJO-MEDIO RIESGO)
**Objetivo:** Mejoras finales

1. Memoización con `useMemo` y `useCallback` donde aplique
2. Lazy loading de componentes pesados
3. Eliminar código duplicado
4. Mejorar tipos TypeScript

**Test:** Verificar performance y funcionalidad  
**Esfuerzo:** 2 horas  
**Riesgo:** ⭐⭐ Bajo

## 5. Estrategia de Testing

### Tests Iniciales (Antes de cambios)
1. **Test Manual:**
   - [ ] App se renderiza sin errores
   - [ ] Navegación entre módulos funciona
   - [ ] Selección de países/productos funciona
   - [ ] Paneles son redimensionables
   - [ ] Formularios aceptan entrada
   - [ ] Nextcell component funciona en Sales Data y Market Insights

2. **Test Automatizado Básico:**
   ```bash
   npm run build
   npm run lint
   ```

### Tests Después de Cada Fase
1. Repetir tests iniciales
2. Verificar que no hay errores en consola
3. Verificar que no hay warnings de linting
4. Verificar que el build funciona

### Criterio de Éxito
- ✅ App funciona igual que antes
- ✅ Build exitoso sin errores
- ✅ Linting sin errores
- ✅ Código más modular y mantenible

### Criterio de Fallo (Rollback)
- ❌ App no renderiza
- ❌ Funcionalidad perdida
- ❌ Errores en consola
- ❌ Build falla

## 6. Estimación de Esfuerzo Total

| Fase | Esfuerzo | Riesgo | Prioridad |
|------|----------|--------|-----------|
| Fase 1: Datos | 30 min | ⭐ | ALTA |
| Fase 2: Shadcn | 20 min | ⭐ | ALTA |
| Fase 3: UI Simple | 2 hrs | ⭐⭐ | ALTA |
| Fase 4: Paneles | 4 hrs | ⭐⭐⭐ | MEDIA |
| Fase 5: Context | 3 hrs | ⭐⭐⭐⭐ | BAJA (Opcional) |
| Fase 6: Optimización | 2 hrs | ⭐⭐ | MEDIA |
| **Total** | **~12 hrs** | Variable | - |

## 7. Recomendación

**Implementar Fases 1-3 en esta sesión:**
- Bajo riesgo
- Alto impacto en legibilidad
- Tests fáciles de verificar
- Tiempo razonable (~3 horas)

**Evaluar Fases 4-6 después:**
- Riesgo más alto
- Requieren más tiempo
- Pueden necesitar Context API (complejo)

## 8. Próximos Pasos

1. ✅ Crear tests iniciales
2. ⏳ Ejecutar Fase 1: Extracción de datos
3. ⏳ Ejecutar tests post-Fase 1
4. ⏳ Ejecutar Fase 2: Shadcn components
5. ⏳ Ejecutar tests post-Fase 2
6. ⏳ Ejecutar Fase 3: UI Simple components
7. ⏳ Ejecutar tests post-Fase 3
8. ⏳ Decidir si continuar con Fases 4-6

---

**Nota:** Si cualquier fase falla los tests después de 2 intentos, se documentará en `REFACTOR_INCOMPLETE.md` y NO se implementará.

