# Tests de Refactorización

## Estado Inicial (Baseline)

### Tests Automatizados

#### 1. Build Test
```bash
cd Mockup_Folder
npm run build
```
**Fecha:** 19/11/2025  
**Estado:** ⏳ Pendiente  
**Resultado Esperado:** Build exitoso sin errores

#### 2. Lint Test
```bash
cd Mockup_Folder
npm run lint
```
**Fecha:** 19/11/2025  
**Estado:** ⏳ Pendiente  
**Resultado Esperado:** Sin errores de linting

### Tests Manuales (Checklist)

#### Navegación
- [ ] La aplicación se carga en `localhost:5173`
- [ ] Menu lateral izquierdo visible
- [ ] Módulos H1 visibles: Reports, Data Entry, Master Data, Supervisor
- [ ] Click en "Reports" → "Sales Trends" muestra placeholder Power BI
- [ ] Click en "Reports" → "Sales Analysis" muestra placeholder Power BI
- [ ] Click en "Data Entry" → "Process Visibility" muestra placeholder
- [ ] Click en "Data Entry" → "Patients News/Dropouts" muestra panel central con 3 países
- [ ] Click en "Data Entry" → "Sales Data" muestra matriz Nextcell
- [ ] Click en "Data Entry" → "Market Insights" muestra panel central con productos
- [ ] Click en "Master Data" → "Countries Setup" muestra selector de continentes
- [ ] Click en "Master Data" → "Products/Families" muestra placeholder
- [ ] Click en "Supervisor" → "Users" muestra tabs Groups/Users
- [ ] Click en "Supervisor" → "Scenarios" muestra placeholder

#### Patients News/Dropouts
- [ ] Panel central muestra solo: Norway, Finland, Denmark
- [ ] Click en "Norway" lo selecciona (fondo azul)
- [ ] Panel derecho muestra matriz Nextcell con estructura jerárquica
- [ ] Columnas: Meses con subcolumnas (Patients, Dose, Vol.)
- [ ] Filas: Grupos con productos anidados

#### Sales Data
- [ ] No hay panel central (diseño 1/8 - 0 - 7/8)
- [ ] Panel derecho muestra matriz Nextcell
- [ ] Columnas: Meses con subcolumnas (Vol., Price, Turnover)
- [ ] Turnover se calcula automáticamente (Vol. × Price)
- [ ] Turnover es read-only (gris)
- [ ] Headers de grupo (Grup1, Grup2) alineados a la izquierda

#### Market Insights
- [ ] Panel central muestra lista de productos
- [ ] Click en producto lo selecciona
- [ ] Panel derecho muestra matriz con Companies
- [ ] Columnas: Units, ASP $/vial, Market Sales, MarketShare
- [ ] Market Sales = Units × ASP $/vial (calculado, read-only)
- [ ] MarketShare = Market Sales / Total Market Sales (calculado, read-only)

#### Countries Setup
- [ ] Panel central muestra dropdown "Select Continent"
- [ ] Dropdown tiene opciones: Europe, North America, South America
- [ ] Seleccionar "Europe" muestra lista de países europeos
- [ ] Click en país lo selecciona
- [ ] Panel derecho muestra formulario con:
  - [ ] Dropdown "Currency"
  - [ ] Checkboxes "Prices Types" (ASP, Maquila, Ex-Factory)
  - [ ] Tabla "Tipo de cambio €" con columnas: Contravalor, Fecha inicial, Fecha Final
  - [ ] Botón "+ Agregar fila" funciona
  - [ ] Botón delete (✕) funciona cuando hay >1 fila

#### Users
- [ ] Panel central muestra tabs: Groups, Users
- [ ] Tab "Groups" muestra lista de grupos
- [ ] Tab "Users" muestra tarjetas de usuarios (nombre + email)
- [ ] Click en usuario muestra panel derecho
- [ ] Panel derecho tiene dos columnas:
  - [ ] Izquierda: Checkboxes de países
  - [ ] Derecha: Funciones asignadas (read-only según grupo)

#### Resize de Paneles
- [ ] Borde entre panel izquierdo y central es arrastrable
- [ ] Borde entre panel central y derecho es arrastrable
- [ ] Paneles mantienen ancho mínimo

#### Console & Errores
- [ ] No hay errores en consola del navegador
- [ ] No hay warnings críticos en consola

---

## Tests Post-Fase 1: Extracción de Datos

### Tests Automatizados
- [ ] `npm run build` exitoso
- [ ] `npm run lint` sin errores

### Tests Manuales
- [ ] Repetir TODOS los tests de navegación
- [ ] Repetir TODOS los tests funcionales
- [ ] Verificar que datos se cargan igual
- [ ] No hay errores en consola

**Resultado:** ⏳ Pendiente  
**Intentos:** 0/2

---

## Tests Post-Fase 2: Shadcn Components

### Tests Automatizados
- [ ] `npm run build` exitoso
- [ ] `npm run lint` sin errores
- [ ] Nuevos componentes shadcn instalados sin conflictos

### Tests Manuales
- [ ] App se renderiza sin cambios visuales
- [ ] No hay errores en consola

**Resultado:** ⏳ Pendiente  
**Intentos:** 0/2

---

## Tests Post-Fase 3: Componentes UI Simples

### Tests Automatizados
- [ ] `npm run build` exitoso
- [ ] `npm run lint` sin errores

### Tests Manuales
- [ ] Repetir tests de navegación
- [ ] Botones de países funcionan igual
- [ ] Botones de productos funcionan igual
- [ ] Tarjetas de usuarios se ven igual
- [ ] Tabla de Exchange Rates funciona igual
- [ ] Checkboxes de Price Types funcionan igual
- [ ] No hay errores en consola

**Resultado:** ⏳ Pendiente  
**Intentos:** 0/2

---

## Registro de Tests

### Baseline (Pre-refactor)
- **Fecha:** 19/11/2025
- **Build:** ⏳
- **Lint:** ⏳
- **Funcional:** ⏳
- **Notas:** Estado inicial antes de cualquier cambio

### Fase 1 (Post-extracción datos)
- **Fecha:** ___
- **Build:** ___
- **Lint:** ___
- **Funcional:** ___
- **Intentos:** ___/2
- **Notas:** ___

### Fase 2 (Post-shadcn)
- **Fecha:** ___
- **Build:** ___
- **Lint:** ___
- **Funcional:** ___
- **Intentos:** ___/2
- **Notas:** ___

### Fase 3 (Post-UI components)
- **Fecha:** ___
- **Build:** ___
- **Lint:** ___
- **Funcional:** ___
- **Intentos:** ___/2
- **Notas:** ___

