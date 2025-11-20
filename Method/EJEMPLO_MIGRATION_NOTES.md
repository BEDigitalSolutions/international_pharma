# Ejemplo: Migration Notes en PR.md

## Cómo se vería agregado al final de cada módulo

---

## Ejemplo 1: Módulo "Sales Data"

### Estructura Actual (sin Migration Notes)

```markdown
#### ## Sales Data

**Layout**: Special layout - No center panel (1/8 - 0 - 7/8)

**Right Panel (H4)**:
- **Component**: Nextcell (Excel-like data grid)
- **Excel Load functionality**: Available via "Excel Load" button
- Data matrix structure with **grouped rows** and **nested columns**:
  - **Column structure**:
    - **Main columns**: Months (January, February, March, April, ...)
    - **Subcolumns** (within each month):
      - Vol. (Volume)
      - Price
      - Turnover
  - **Row structure**:
    - **Groups** (Grup1, Grup2, Grup3, ...) - expandable/collapsible
      - **Products** (nested under each group)

**Turnover columns**: Calculated automatically as `Vol. × Price`
- **Volume highlighting**: If Vol. for a month is 100% or more higher than the previous month, the cell background is highlighted in orange
- **Excel Load**: Import data from Excel templates or generate demo data

---
```

### Estructura Mejorada (con Migration Notes)

```markdown
#### ## Sales Data

**Layout**: Special layout - No center panel (1/8 - 0 - 7/8)

**Right Panel (H4)**:
- **Component**: Nextcell (Excel-like data grid)
- **Excel Load functionality**: Available via "Excel Load" button
- Data matrix structure with **grouped rows** and **nested columns**:
  - **Column structure**:
    - **Main columns**: Months (January, February, March, April, ...)
    - **Subcolumns** (within each month):
      - Vol. (Volume)
      - Price
      - Turnover
  - **Row structure**:
    - **Groups** (Grup1, Grup2, Grup3, ...) - expandable/collapsible
      - **Products** (nested under each group)

**Turnover columns**: Calculated automatically as `Vol. × Price`
- **Volume highlighting**: If Vol. for a month is 100% or more higher than the previous month, the cell background is highlighted in orange
- **Excel Load**: Import data from Excel templates or generate demo data

---

### Migration Notes (T3 FullStack)

**Componentes a Reutilizar** ✅:
- `Nextcell` component → Copiar directamente a `apps/web/components/nextcell/`
- Layout structure (1/8 - 0 - 7/8) → Mantener en Next.js
- Hierarchical columns/rows structure → Misma estructura en DB

**Cambios Necesarios** 🔄:
- **Data source**: 
  - Mockup: `initialData` prop con datos estáticos
  - T3: `useQuery(api.salesData.getByCountryAndProduct)` para cargar desde DB
- **Save functionality**:
  - Mockup: `onChange` solo actualiza estado local
  - T3: `useMutation(api.salesData.bulkUpsert)` para guardar en DB
- **Excel Load**:
  - Mockup: Simulación con datos random
  - T3: Backend endpoint `api.salesData.importExcel` que procesa archivos reales

**Lógica de Negocio a Mover** 📦:
- **Cálculo de Turnover** (`Vol. × Price`):
  - Mockup: En componente React (función inline en `calculatedColumns`)
  - T3: Mover a `lib/business-logic.ts` → Reutilizar en backend para validación
- **Highlighting de Volumen** (≥100% aumento):
  - Mockup: En componente React (conditional styling)
  - T3: Mantener en frontend (es solo visual), pero validar regla en backend si es crítica

**Modelo de Datos** 🗄️:
- **Tabla Prisma**: `SalesData`
  - Campos: `countryId`, `productId`, `month`, `year`, `volume`, `price`, `turnover`, `priceType`
  - `turnover` → Calculado en backend al guardar (no se almacena null si falta vol/price)
- **Mapeo Grid → DB**: 
  - Función `mapNextcellToSalesData()` necesaria
  - Transformar estructura jerárquica (groups → products, months → subcolumns) a registros planos

**Consideraciones Especiales** ⚠️:
- **Autosave**: Implementar debounce (guardar después de 2-3 segundos sin cambios)
- **Validación**: Backend debe validar que `volume` y `price` sean números positivos
- **Permisos**: Verificar que usuario tenga acceso al país antes de cargar/guardar datos

---
```

---

## Ejemplo 2: Módulo "Countries Setup"

### Migration Notes para este módulo

```markdown
#### ## Countries setup

[... especificaciones actuales del módulo ...]

---

### Migration Notes (T3 FullStack)

**Componentes a Reutilizar** ✅:
- `ExchangeRateTable` → Copiar directamente
- `ProductAliasTable` → Copiar directamente
- `PriceTypeSelector` → Copiar directamente
- Form structure → Mantener layout

**Cambios Necesarios** 🔄:
- **Data loading**:
  - Mockup: Datos hardcodeados en `constants.ts`
  - T3: `useQuery(api.countries.getById)` para cargar país seleccionado
- **Save button**:
  - Mockup: No hace nada (solo UI)
  - T3: `useMutation(api.countries.update)` para guardar cambios
- **Exchange Rates**:
  - Mockup: Estado local en React Context
  - T3: `useMutation(api.countries.updateExchangeRates)` para guardar tabla completa
- **Product Aliases**:
  - Mockup: Estado local, se inicializa con productos
  - T3: `useQuery(api.countries.getProductAliases)` + `useMutation(api.countries.updateProductAliases)`

**Lógica de Negocio a Mover** 📦:
- **Validación de fechas** (Exchange Rates):
  - Mockup: No hay validación
  - T3: Schema Zod que valida `fechaInicial < fechaFinal` y rangos no solapados
- **Validación de Price Types**:
  - Mockup: No hay validación
  - T3: Validar que al menos un tipo esté seleccionado (Zod schema)

**Modelo de Datos** 🗄️:
- **Tabla Prisma**: `Country`
  - Campos: `id`, `name`, `continent`, `currency`, `priceTypes` (array)
- **Tabla Prisma**: `ExchangeRate`
  - Relación: `countryId` → `Country`
  - Campos: `contravalor`, `fechaInicial`, `fechaFinal`
- **Tabla Prisma**: `ProductAlias`
  - Relación: `countryId` → `Country`, `productId` → `Product`
  - Campos: `alias`

**Consideraciones Especiales** ⚠️:
- **Product Aliases**: Auto-popular con todos los productos al seleccionar país
- **Exchange Rates**: Validar que no haya solapamiento de fechas
- **Currency**: Dropdown debe venir de lista maestra (no hardcodeado)

---
```

---

## Ejemplo 3: Módulo "Sales Trends" (Power BI)

### Migration Notes para este módulo

```markdown
#### ## Sales Trends

**Layout**: Full-screen iframe (1/8 - 0 - 7/8)

**Right Panel (H4)**:
- Full-screen Power BI iframe displaying Sales Trends report
- URL configured via environment variables

---

### Migration Notes (T3 FullStack)

**Componentes a Reutilizar** ✅:
- `PowerBIEmbed` component → Copiar directamente
- Layout full-screen → Mantener

**Cambios Necesarios** 🔄:
- **Embed Token**:
  - Mockup: Simulado, muestra mensaje informativo
  - T3: Backend endpoint `api.powerbi.getEmbedToken` que genera token real
- **Environment Variables**:
  - Mockup: `VITE_POWERBI_*` (frontend)
  - T3: Variables de servidor (no exponer en frontend), usar `NEXT_PUBLIC_*` solo para IDs públicos

**Lógica de Negocio a Mover** 📦:
- **Token Generation**:
  - Mockup: No implementado
  - T3: Backend con MSAL (Microsoft Authentication Library) + Power BI REST API
  - Ver `POWERBI_EMBEDDED_SETUP.md` para detalles

**Modelo de Datos** 🗄️:
- No requiere tabla Prisma (solo configuración)
- Configuración en variables de entorno o tabla `PowerBIConfig` si es dinámica

**Consideraciones Especiales** ⚠️:
- **Autenticación**: Usuario debe estar autenticado con EntraID
- **Permisos**: Verificar que usuario tenga acceso al workspace de Power BI
- **Licencias**: Requiere Power BI Premium o Embedded (ver `POWERBI_EMBEDDED_SETUP.md`)

---
```

---

## Formato Recomendado

### Estructura de Migration Notes

```markdown
### Migration Notes (T3 FullStack)

**Componentes a Reutilizar** ✅:
- Lista de componentes que se copian directamente sin cambios

**Cambios Necesarios** 🔄:
- Lista de cambios específicos (data source, mutations, etc.)

**Lógica de Negocio a Mover** 📦:
- Funciones que se mueven del frontend al backend

**Modelo de Datos** 🗄️:
- Tablas Prisma y relaciones necesarias

**Consideraciones Especiales** ⚠️:
- Validaciones, permisos, edge cases, etc.
```

### Iconos/Emojis (Opcional)

- ✅ = Mantener/Reutilizar
- 🔄 = Cambiar/Adaptar
- 📦 = Mover a backend
- 🗄️ = Base de datos
- ⚠️ = Advertencia/Consideración importante

---

## Beneficios

1. **Para ti**: Guía clara de qué hacer en cada módulo
2. **Para LLMs**: Instrucciones específicas de migración por módulo
3. **Documentación**: Registro de decisiones de diseño
4. **Eficiencia**: Evita tener que "descubrir" qué cambiar durante la migración

---

## ¿Dónde Agregar?

Al final de cada módulo, justo antes del separador `---` que indica el siguiente módulo.

Por ejemplo:

```markdown
#### ## Sales Data

[... especificaciones completas ...]
- **Excel Load**: Import data from Excel templates

---

### Migration Notes (T3 FullStack)
[... notas de migración ...]

---

#### ## Market Insights
[... siguiente módulo ...]
```
