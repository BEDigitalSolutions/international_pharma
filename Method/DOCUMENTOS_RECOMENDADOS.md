# Documentos Recomendados para Desarrollo con LLMs

## Objetivo

Documentos que maximizan la eficiencia cuando desarrollas con Cursor/LLMs, facilitando la migración del mockup a FullStack T3.

---

## 1. PR.md (Ya lo tienes) ✅

**Estado**: Muy útil, mantener y mejorar

**Mejoras sugeridas**:

- Agregar sección "Migration Notes" al final de cada módulo
- Incluir diagramas de flujo de datos (texto/markdown)
- Documentar decisiones de diseño (por qué se eligió X sobre Y)

**Ejemplo de mejora**:

```markdown
## Module: Sales Data

### Migration Notes
- Nextcell component → Reutilizar en Next.js, solo cambiar data source
- Calculated columns → Mover lógica a tRPC procedures
- Excel Load → Backend endpoint para procesar archivos reales
```

---

## 2. `SCHEMA_PRISMA.md` (NUEVO - Alta Prioridad)

**Propósito**: Definir el esquema de base de datos antes de implementarlo.

**Contenido sugerido**:

```markdown
# Prisma Schema Definition

## Modelos Principales

### Country
```prisma
model Country {
  id            String   @id @default(uuid())
  name          String   @unique
  continent     String
  currency      String
  priceTypes    PriceType[]
  exchangeRates ExchangeRate[]
  productAliases ProductAlias[]
  users         User[]
  salesData     SalesData[]
  patientsData  PatientsData[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Product

```prisma
model Product {
  id            String   @id @default(uuid())
  name          String   @unique
  groupId       String
  group         ProductGroup @relation(fields: [groupId], references: [id])
  aliases       ProductAlias[]
  salesData     SalesData[]
  patientsData  PatientsData[]
  marketInsights MarketInsight[]
}
```

[... más modelos ...]

## Relaciones Clave

- Country ↔ ProductAlias (1:N)
- Product ↔ SalesData (1:N)
- User ↔ Country (N:M)

```

**Beneficio**: Los LLMs pueden generar el schema.prisma completo automáticamente.

---

## 3. `MIGRATION_ROADMAP.md` (NUEVO - Alta Prioridad)

**Propósito**: Plan paso a paso para migrar del mockup a T3.

**Contenido sugerido**:

```markdown
# Migration Roadmap: Mockup → FullStack T3

## Fase 1: Setup T3 Stack
- [ ] Crear proyecto T3 con `create-t3-app`
- [ ] Configurar Azure SQL connection string
- [ ] Configurar EntraID (Azure AD) authentication
- [ ] Setup Prisma con schema inicial

## Fase 2: Migración de Componentes UI
- [ ] Migrar Nextcell component (reutilizar código)
- [ ] Migrar layout components (LeftPanel, CenterPanel)
- [ ] Migrar common components (ExchangeRateTable, etc.)
- [ ] Adaptar estilos Tailwind (verificar compatibilidad)

## Fase 3: Backend - Modelos de Datos
- [ ] Crear Prisma schema completo
- [ ] Generar migrations
- [ ] Seed database con datos de prueba
- [ ] Crear tRPC routers básicos (CRUD)

## Fase 4: Backend - Lógica de Negocio
- [ ] Migrar funciones de cálculo (business-logic.ts)
- [ ] Implementar validaciones con Zod
- [ ] Crear procedures para Excel import/export
- [ ] Implementar Power BI embed token generation

## Fase 5: Integración Frontend-Backend
- [ ] Conectar componentes a tRPC queries
- [ ] Implementar mutations para data entry
- [ ] Agregar loading states y error handling
- [ ] Implementar autosave (debounced mutations)

## Fase 6: Autenticación y Permisos
- [ ] Configurar EntraID middleware
- [ ] Implementar row-level security (RLS)
- [ ] Crear sistema de permisos por función
- [ ] Filtrar datos por país asignado al usuario

## Fase 7: Testing y Optimización
- [ ] Tests unitarios para lógica de negocio
- [ ] Tests de integración para tRPC routers
- [ ] Optimizar queries Prisma (N+1, índices)
- [ ] Performance testing con datos reales

## Fase 8: Deployment
- [ ] Setup Azure App Service / Vercel
- [ ] Configurar variables de entorno
- [ ] Setup CI/CD pipeline
- [ ] Monitoring y logging
```

**Beneficio**: Los LLMs pueden seguir este roadmap paso a paso, generando código incrementalmente.

---

## 4. `API_SPECIFICATIONS.md` (NUEVO - Media Prioridad)

**Propósito**: Especificaciones detalladas de cada endpoint tRPC.

**Contenido sugerido**:

```markdown
# API Specifications (tRPC)

## salesData Router

### getByCountryAndProduct
```typescript
input: z.object({
  countryId: z.string().uuid(),
  productId: z.string().uuid(),
  year: z.number().int().min(2020).max(2100),
})

output: z.array(SalesDataSchema)

description: |
  Obtiene todos los datos de ventas para un país, producto y año específicos.
  Retorna datos en formato compatible con Nextcell grid (hierarchical structure).
  
  Ejemplo de uso:
  - Frontend: Cargar datos al seleccionar país/producto
  - Backend: Validar que usuario tiene acceso al país
```

### bulkUpsert

```typescript
input: z.object({
  countryId: z.string().uuid(),
  productId: z.string().uuid(),
  year: z.number().int(),
  data: z.array(SalesDataInputSchema),
})

output: z.object({
  count: z.number(),
  updated: z.array(SalesDataSchema),
})

description: |
  Inserta o actualiza múltiples registros de ventas en una transacción.
  Valida que todos los datos pertenezcan al mismo país/producto/año.
  
  Ejemplo de uso:
  - Frontend: Guardar cambios después de editar grid completo
  - Backend: Calcular automáticamente campos calculados (turnover)
```

[... más endpoints ...]

```

**Beneficio**: Los LLMs pueden generar implementaciones completas de routers con validaciones.

---

## 5. `DATA_MODEL_MAPPING.md` (NUEVO - Media Prioridad)

**Propósito**: Mapeo explícito entre mockup y base de datos.

**Contenido sugerido**:

```markdown
# Data Model Mapping: Mockup → Database

## Sales Data Module

### Mockup Structure
```

Nextcell Grid:

- Rows: Product Groups → Products (hierarchical)
- Columns: Months → [Vol., Price, Turnover] (hierarchical)
- Cell values: Record<"row-col", string>

```

### Database Structure
```

SalesData table:

- countryId (FK → Country)
- productId (FK → Product)
- month (1-12)
- year
- volume (decimal)
- price (decimal)
- turnover (decimal, calculated)
- priceType (enum: ASP | Maquila | Ex-Factory)

```

### Transformation Logic
```typescript
// Mockup → Database
function mapGridToSalesData(
  gridData: Record<string, string>,
  countryId: string,
  productId: string,
  year: number
): SalesData[] {
  // 1. Iterar sobre hierarchicalRows (product groups → products)
  // 2. Para cada producto, iterar sobre hierarchicalColumns (months → subcolumns)
  // 3. Extraer Vol., Price de cada celda
  // 4. Calcular Turnover (o dejar null si falta Vol. o Price)
  // 5. Crear objeto SalesData para cada combinación producto/mes
}
```

### Edge Cases

- ¿Qué pasa si falta Vol. pero hay Price? → Guardar Price, Turnover = null
- ¿Qué pasa si se borra una celda? → Actualizar registro a null en DB
- ¿Qué pasa si se agrega un nuevo producto? → Crear registro nuevo

```

**Beneficio**: Los LLMs entienden exactamente cómo transformar datos entre capas.

---

## 6. `COMPONENT_MIGRATION_GUIDE.md` (NUEVO - Baja Prioridad)

**Propósito**: Guía específica para migrar cada componente.

**Contenido sugerido**:

```markdown
# Component Migration Guide

## Nextcell Component

### Estado Actual (Mockup)
- Ubicación: `Mockup_Folder/src/components/nextcell/Nextcell.tsx`
- Dependencias: React, Tailwind, Lucide
- Estado: Local (useState)
- Data source: Props (initialData)

### Estado Final (T3)
- Ubicación: `apps/web/components/nextcell/Nextcell.tsx`
- Dependencias: Mismas + tRPC client
- Estado: React Query (useQuery + useMutation)
- Data source: tRPC queries

### Pasos de Migración
1. Copiar componente a proyecto T3
2. Reemplazar `initialData` prop por `useQuery(api.salesData.getByCountryAndProduct)`
3. Reemplazar `onChange` por `useMutation(api.salesData.bulkUpsert)`
4. Agregar loading states y error handling
5. Implementar autosave (debounce mutations)

### Código de Ejemplo
```typescript
// Antes (Mockup)
<Nextcell
  initialData={mockData}
  onChange={(data) => console.log(data)}
/>

// Después (T3)
const { data, isLoading } = api.salesData.getByCountryAndProduct.useQuery({
  countryId: selectedCountry.id,
  productId: selectedProduct.id,
  year: 2024,
})

const mutation = api.salesData.bulkUpsert.useMutation()

<Nextcell
  initialData={data ? mapSalesDataToGrid(data) : undefined}
  onChange={(data) => {
    const salesData = mapGridToSalesData(data, ...)
    mutation.mutate({ data: salesData })
  }}
/>
```

```

**Beneficio**: Los LLMs pueden migrar componentes automáticamente siguiendo estos patrones.

---

## 7. `DECISIONS_LOG.md` (NUEVO - Baja Prioridad)

**Propósito**: Documentar decisiones técnicas importantes.

**Contenido sugerido**:

```markdown
# Technical Decisions Log

## 2024-XX-XX: Elección de T3 Stack
**Decisión**: Usar T3 Stack (Next.js + Prisma + tRPC + TypeScript)
**Alternativas consideradas**:
- Next.js + REST API + Prisma
- Remix + Prisma
**Razón**: Type-safety end-to-end, mejor DX con LLMs
**Consecuencias**: Necesitamos aprender tRPC, pero ganamos type-safety

## 2024-XX-XX: Estructura de datos jerárquica en Nextcell
**Decisión**: Usar estructura jerárquica (groups → products, months → subcolumns)
**Alternativas consideradas**:
- Estructura plana con metadatos
- Tablas separadas para grupos
**Razón**: Mejor UX, refleja modelo mental del usuario
**Consecuencias**: Mapeo más complejo a DB, pero aceptable

## 2024-XX-XX: Cálculos en frontend vs backend
**Decisión**: Cálculos (Turnover, MarketShare) en backend con validación
**Alternativas consideradas**:
- Solo en frontend (más rápido)
- Solo en backend (más seguro)
**Razón**: Validación de integridad, consistencia de datos
**Consecuencias**: Más latencia, pero datos más confiables
```

**Beneficio**: Los LLMs entienden el contexto de decisiones y pueden mantener consistencia.

---

## Priorización para Implementación

### Fase 1 (Hacer Ahora)

1. ✅ **PR.md** - Mejorar con secciones de migración
2. 🔴 **SCHEMA_PRISMA.md** - Definir modelo de datos
3. 🔴 **MIGRATION_ROADMAP.md** - Plan de migración

### Fase 2 (Durante Migración)

4. 🟡 **API_SPECIFICATIONS.md** - Especificar endpoints
5. 🟡 **DATA_MODEL_MAPPING.md** - Mapear transformaciones

### Fase 3 (Opcional)

6. 🟢 **COMPONENT_MIGRATION_GUIDE.md** - Guía detallada
7. 🟢 **DECISIONS_LOG.md** - Documentar decisiones

---

## Formato Recomendado para LLMs

Todos los documentos deben:

- Usar Markdown con estructura clara (H1, H2, H3)
- Incluir ejemplos de código cuando sea relevante
- Usar bloques de código con sintaxis highlighting
- Incluir comentarios `TODO: MIGRATION` donde corresponda
- Ser concisos pero completos (no más de 500 líneas por documento)
