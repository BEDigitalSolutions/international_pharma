**Añadimos una nueva funcionalidad de Nextcell**

## Alcance
- Funcionalidad común integrada en el componente Nextcell
- Disponible en todos los módulos que usen Nextcell (Sales Data, Market Insights, Patients News/Dropouts)

## Botón "Excel Load"
- Ubicación: Extremo izquierdo superior sobre la tabla de entrada de datos
- Al pulsar, se desplaza un panel emergente desde el margen derecho

## Panel emergente "Import Excel"
- **Título:** "Import Excel"
- **Dimensiones:**
  - Alto: completo (100% altura pantalla)
  - Ancho: 1/4 de la pantalla
- **Overlay:** Blanco opaco bloqueando la interacción con el resto de la aplicación
- **Animación:** Deslizamiento suave desde la derecha (0.3s)
- **Botón Cancelar:** 
  - Ubicación: Parte superior del panel
  - Icono: X junto al texto "Cancelar"
  - Función: Cancela operación en curso o cierra el panel
  - Sin mensaje de confirmación (cierre directo)

## Sección "Download Template"
- **Botón:** "Download Template" (sin icono)
- **Función:** Genera archivo Excel con estructura del módulo actual
- **Contenido del template:**
  - Todas las columnas (editables + calculadas)
  - Sin filas de ejemplo (vacío)
- **Nombre archivo:** `template_[nombre_modulo].xlsx`
  - Ejemplo: "template_sales_data.xlsx", "template_market_insights.xlsx"

## Sección "Upload Excel"
- **Botón "Select Excel File":** Navegación para seleccionar archivo del ordenador (sin icono)
  - **Implementación actual:** Solo simulación (no validación real)
  - **Proceso de simulación:**
    1. Usuario selecciona archivo Excel
    2. Mostrar indicador de progreso/loading
    3. Duración simulación: 3 segundos
    4. Rellenar 20 filas con valores aleatorios
    5. Mostrar mensaje: "20 filas cargadas exitosamente"
- **Botón "Cargar datos demo":** 
  - Estilo: outline (mismo que "Download Template")
  - Función: Inicia directamente la carga de datos aleatorios sin necesidad de seleccionar archivo
  - Proceso idéntico al botón "Select Excel File" pero sin diálogo de selección

## Generación de valores aleatorios (demo)
- **Cantidad:** 20 filas
- **Alcance:** **75% de las celdas de datos (no calculadas)** - seleccionadas aleatoriamente
- **Campos:** Solo en columnas editables (excluye columnas calculadas)
- **Tipo de valores:**
  - **Fechas:** Válidas del año actual o siguiente en formato **DD/MM/YYYY**
    - Ejemplo: 15/03/2024
  - **Valores numéricos:** Fluctuación de **±150%** sobre un valor base según la columna:
    - Vol/Units: Base 1000 → Rango [0, 2500]
    - Price/ASP: Base 100 → Rango [0, 250]
    - Otros: Base 500 → Rango [0, 1250]
- **Comportamiento:** Reemplaza completamente los datos existentes en la grid

## Validación futura (no implementar ahora)
- Validar estructura del archivo coincida con template
- Manejar columnas calculadas en el Excel
- Gestionar filas con estructura incorrecta
- Vista previa antes de cargar datos

## Notas Técnicas

### Error corregido: Formato de claves de celdas
**Problema identificado:**
Durante la implementación inicial, se detectó que los datos aleatorios generados no aparecían en la tabla de entrada de datos.

**Causa raíz:**
En la función `startSimulatedUpload`, se estaba generando las claves de las celdas usando el formato `${cell.row},${cell.col}` (con coma), mientras que la función `getCellKey()` del componente Nextcell utiliza el formato `${row}-${col}` (con guion).

**Solución implementada:**
Se modificó la línea 951 de `Nextcell.tsx` para usar la función `getCellKey()` en lugar de generar manualmente la clave:

```typescript
// Antes (incorrecto):
const cellKey = `${cell.row},${cell.col}`

// Después (correcto):
const cellKey = getCellKey(cell.row, cell.col)
```

**Resultado:**
Los datos aleatorios ahora se cargan correctamente en la tabla, ya que las claves coinciden con el formato esperado por el sistema de almacenamiento y recuperación de datos del componente.

**Lección aprendida:**
Siempre usar las funciones auxiliares del componente (como `getCellKey()`) en lugar de duplicar la lógica de generación de claves, para mantener la consistencia y evitar errores de formato.