# Mejoras al Mockup para Facilitar Migración a T3

## Objetivo

Optimizar el mockup actual para que la migración a FullStack T3 (Next.js/Prisma/tRPC) sea más eficiente cuando se desarrolle con LLMs.

---

## 1. Tipos TypeScript que Mapeen al Modelo de Datos Final

### Problema Actual

Los tipos están orientados a UI, no reflejan el modelo de datos que tendrás en Prisma.

### Mejora: Crear `types/database.ts`

```typescript
// Mockup_Folder/src/types/database.ts
// Estos tipos reflejan el esquema Prisma que tendrás en producción

// ============================================
// ENTIDADES PRINCIPALES
// ============================================

export interface Country {
  id: string
  name: string
  continent: string
  currency: string
  priceTypes: PriceType[]
  exchangeRates: ExchangeRate[]
  productAliases: ProductAlias[]
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  groupId: string
  group: ProductGroup
  aliases: ProductAlias[]
}

export interface ProductGroup {
  id: string
  name: string
  products: Product[]
}

export interface Company {
  id: string
  name: string
}

// ============================================
// ENTIDADES DE DATOS
// ============================================

export interface SalesData {
  id: string
  countryId: string
  productId: string
  month: number // 1-12
  year: number
  volume: number | null
  price: number | null
  turnover: number | null // Calculado: volume * price
  priceType: PriceType
  createdAt: Date
  updatedAt: Date
}

export interface PatientsData {
  id: string
  countryId: string
  productId: string
  month: number
  year: number
  patients: number | null
  dose: number | null
  volume: number | null // Calculado: patients * dose
  createdAt: Date
  updatedAt: Date
}

export interface MarketInsight {
  id: string
  productId: string
  companyId: string
  year: number
  units: number | null
  aspPerVial: number | null
  marketSales: number | null // Calculado: units * aspPerVial
  marketShare: number | null // Calculado: marketSales / totalMarketSales
  createdAt: Date
  updatedAt: Date
}

// ============================================
// ENTIDADES DE CONFIGURACIÓN
// ============================================

export interface ExchangeRate {
  id: string
  countryId: string
  contravalor: string
  fechaInicial: Date
  fechaFinal: Date
}

export interface ProductAlias {
  id: string
  countryId: string
  productId: string
  alias: string
}

export type PriceType = 'ASP' | 'Maquila' | 'Ex-Factory'

// ============================================
// ENTIDADES DE USUARIOS Y PERMISOS
// ============================================

export interface User {
  id: string
  email: string
  name: string
  groupId: string
  group: UserGroup
  assignedCountries: Country[]
  functions: Function[]
}

export interface UserGroup {
  id: string
  name: string
  functions: Function[]
  users: User[]
}

export type Function = 'Reports' | 'DataEntry' | 'MasterData' | 'Users' | 'Supervisor'

// ============================================
// TIPOS DE UTILIDAD
// ============================================

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface DateRange {
  start: Date
  end: Date
}
```

**Beneficio**: Los LLMs entenderán directamente la estructura de datos final y podrán generar el schema Prisma automáticamente.

---

## 2. Separar Lógica de Negocio de UI

### Problema Actual

La lógica de cálculo (Turnover, MarketShare) está mezclada en componentes React.

### Mejora: Crear `lib/business-logic.ts`

```typescript
// Mockup_Folder/src/lib/business-logic.ts
// Lógica de negocio que será reutilizable en backend (tRPC)

/**
 * Calcula el turnover (volumen × precio)
 * Esta función será reutilizada en el backend para validaciones y cálculos
 */
export function calculateTurnover(volume: number | null, price: number | null): number | null {
  if (volume === null || price === null) return null
  if (isNaN(volume) || isNaN(price)) return null
  if (volume === 0 || price === 0) return null
  return volume * price
}

/**
 * Calcula el volumen (pacientes × dosis)
 */
export function calculateVolume(patients: number | null, dose: number | null): number | null {
  if (patients === null || dose === null) return null
  if (isNaN(patients) || isNaN(dose)) return null
  if (patients === 0 || dose === 0) return null
  return patients * dose
}

/**
 * Calcula las ventas de mercado (unidades × ASP por vial)
 */
export function calculateMarketSales(units: number | null, aspPerVial: number | null): number | null {
  if (units === null || aspPerVial === null) return null
  if (isNaN(units) || isNaN(aspPerVial)) return null
  if (units === 0 || aspPerVial === 0) return null
  return units * aspPerVial
}

/**
 * Calcula el market share (ventas de la empresa / total de ventas del mercado)
 */
export function calculateMarketShare(
  companyMarketSales: number | null,
  totalMarketSales: number
): number | null {
  if (companyMarketSales === null) return null
  if (totalMarketSales === 0) return 0
  return (companyMarketSales / totalMarketSales) * 100
}

/**
 * Valida si un volumen aumentó ≥100% comparado con el mes anterior
 */
export function isVolumeIncreaseSignificant(currentVolume: number, previousVolume: number): boolean {
  if (previousVolume === 0) return false
  const increase = ((currentVolume - previousVolume) / previousVolume) * 100
  return increase >= 100
}
```

**Beneficio**: Lógica reutilizable que los LLMs pueden copiar directamente al backend.

---

## 3. Documentar Contratos de API (tRPC Routers)

### Problema Actual

No hay documentación de qué endpoints/operaciones necesitarás.

### Mejora: Crear `docs/api-contracts.md`

```markdown
# API Contracts (tRPC Routers)

## Estructura de Routers

### `salesDataRouter`
- `getByCountryAndProduct(countryId, productId, year) => SalesData[]`
- `upsert(data: SalesDataInput) => SalesData`
- `bulkUpsert(data: SalesDataInput[]) => { count: number }`
- `exportToExcel(countryId, productId, year) => File`

### `patientsDataRouter`
- `getByCountryAndProduct(countryId, productId, year) => PatientsData[]`
- `upsert(data: PatientsDataInput) => PatientsData`
- `bulkUpsert(data: PatientsDataInput[]) => { count: number }`

### `marketInsightsRouter`
- `getByProduct(productId, year) => MarketInsight[]`
- `upsert(data: MarketInsightInput) => MarketInsight`

### `countriesRouter`
- `getAll() => Country[]`
- `getById(id) => Country`
- `update(id, data: CountryUpdateInput) => Country`
- `getExchangeRates(countryId) => ExchangeRate[]`
- `updateExchangeRates(countryId, rates: ExchangeRateInput[]) => ExchangeRate[]`
- `getProductAliases(countryId) => ProductAlias[]`
- `updateProductAliases(countryId, aliases: ProductAliasInput[]) => ProductAlias[]`

### `productsRouter`
- `getAll() => Product[]`
- `getGroups() => ProductGroup[]`
- `getById(id) => Product`

### `usersRouter`
- `getAll() => User[]`
- `getGroups() => UserGroup[]`
- `getById(id) => User`
- `update(id, data: UserUpdateInput) => User`
- `assignCountries(userId, countryIds: string[]) => User`
```

**Beneficio**: Los LLMs sabrán exactamente qué routers crear y con qué estructura.

---

## 4. Agregar Comentarios de Migración en Componentes

### Mejora: Comentarios `// TODO: MIGRATION` en componentes clave

```typescript
// Mockup_Folder/src/components/nextcell/Nextcell.tsx

/**
 * TODO: MIGRATION TO T3
 * 
 * Este componente será reutilizado en Next.js, pero:
 * - onChange → llamará a tRPC mutation (salesData.upsert)
 * - initialData → vendrá de tRPC query (salesData.getByCountryAndProduct)
 * - onExportCsv → llamará a tRPC procedure (salesData.exportToExcel)
 * 
 * Mantener la misma API de props para facilitar migración.
 */
export function Nextcell({ onChange, initialData, ... }: NextcellProps) {
  // ...
}
```

**Beneficio**: Los LLMs entenderán qué cambiar y qué mantener.

---

## 5. Crear Mappers Mockup → Database

### Mejora: Crear `lib/mappers.ts`

```typescript
// Mockup_Folder/src/lib/mappers.ts
// Funciones que transforman datos del mockup al formato de base de datos

import type { SalesData, PatientsData, MarketInsight } from '../types/database'

/**
 * Convierte datos del grid Nextcell (Record<CellKey, string>) a SalesData[]
 * 
 * TODO: MIGRATION - Esta función será reutilizada en el backend para procesar
 * datos importados desde Excel.
 */
export function mapNextcellToSalesData(
  gridData: Record<string, string>,
  countryId: string,
  productId: string,
  year: number,
  hierarchicalColumns: HierarchicalColumn[],
  hierarchicalRows: HierarchicalRow[]
): SalesData[] {
  // Lógica de mapeo...
}

/**
 * Convierte SalesData[] a formato Nextcell (Record<CellKey, string>)
 * 
 * TODO: MIGRATION - Esta función será reutilizada en el frontend para
 * poblar el grid desde datos de la base de datos.
 */
export function mapSalesDataToNextcell(
  salesData: SalesData[],
  hierarchicalColumns: HierarchicalColumn[],
  hierarchicalRows: HierarchicalRow[]
): Record<string, string> {
  // Lógica de mapeo...
}
```

**Beneficio**: Los LLMs tendrán ejemplos claros de cómo transformar datos entre capas.

---

## 6. Estructura de Datos Más Cercana al Modelo Final

### Mejora: Actualizar `data/constants.ts` con IDs y relaciones

```typescript
// Mockup_Folder/src/data/constants.ts

// Agregar IDs para simular estructura de base de datos
export const countries = [
  { id: 'country-1', name: 'Spain', continent: 'Europe', currency: '€ (EUR)' },
  { id: 'country-2', name: 'France', continent: 'Europe', currency: '€ (EUR)' },
  // ...
] as const

export const productGroups = [
  {
    id: 'group-1',
    name: 'Grup1',
    products: [
      { id: 'product-1', name: 'Prod 1.1' },
      { id: 'product-2', name: 'Prod 1.2' },
    ],
  },
  // ...
] as const
```

**Beneficio**: La migración será más directa, solo cambiarás de objetos mock a queries Prisma.

---

## 7. Documentar Validaciones de Negocio

### Mejora: Crear `lib/validations.ts`

```typescript
// Mockup_Folder/src/lib/validations.ts
// Validaciones que se reutilizarán en tRPC con Zod

/**
 * Valida que un país tenga al menos un tipo de precio seleccionado
 * 
 * TODO: MIGRATION - Convertir a Zod schema para tRPC:
 * z.object({ priceTypes: z.array(z.enum(['ASP', 'Maquila', 'Ex-Factory'])).min(1) })
 */
export function validateCountryPriceTypes(priceTypes: Set<string>): boolean {
  return priceTypes.size > 0
}

/**
 * Valida que las fechas de tipo de cambio sean consistentes
 */
export function validateExchangeRateDates(
  fechaInicial: string,
  fechaFinal: string
): { valid: boolean; error?: string } {
  // Lógica de validación...
}
```

**Beneficio**: Los LLMs podrán generar schemas Zod automáticamente desde estas funciones.

---

## Resumen de Prioridades

1. **Alta**: Tipos TypeScript que mapeen a Prisma (`types/database.ts`)
2. **Alta**: Documentar contratos de API (`docs/api-contracts.md`)
3. **Media**: Separar lógica de negocio (`lib/business-logic.ts`)
4. **Media**: Agregar comentarios de migración en componentes
5. **Baja**: Mappers y validaciones (pueden hacerse durante la migración)
