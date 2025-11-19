# PR: Nextcell – Excel-like Data Entry Component (extracted from `C_shadcn-Excel`)

**Creation date:** 18 November 2025  
**Source project:** `C_Mio/C_shadcn-Excel` (Excel Data Entry PoC) - **No longer required in workspace**  
**Target project:** `C_Grifols_Pharma_Int` (Biopharma Intl mockup)  
**Status:** ✅ **Integrated and operational** - Component fully extracted and functional

---

## 1. Scope and Goal

- **Goal**
  - Provide a reusable React + Tailwind + shadcn-style component (`Nextcell`) that emulates Excel-like data entry:
    - Keyboard navigation
    - Multi-cell selection
    - Copy/paste compatible with Excel
    - Fill handle (drag to replicate values)
    - CSV/Excel export
    - **Excel Load functionality**: Import data from Excel templates with demo data generation
    - **Calculated columns**: Support for read-only, auto-updating calculated fields
    - **Hierarchical structures**: Support for nested columns and grouped rows
    - **Conditional styling**: Visual highlighting based on data conditions

- **Context in `C_Grifols_Pharma_Int`**
  - Use this component as the base for:
    - Fast data-entry grids (e.g. PoCs, utilities, import/export helpers)
    - **Integrated into domain-specific matrices** (Sales Data, Market Insights, Patients News/Dropouts), providing:
      - Navigation model
      - Selection model
      - Clipboard behaviour
      - Export logic
      - Excel Load functionality
      - Calculated columns (Turnover, Market Sales, MarketShare, Vol.)

---

## 2. Extracted Functional Requirements

> **Note:** Originally extracted from `C_shadcn-Excel/PR.md`. The source project is no longer required in the workspace as the component has been fully integrated into `C_Grifols_Pharma_Int`.

- **Table structure (current PoC)**
  - 5 columns with headers: `A, B, C, D, E`
  - 10 rows with headers: `1, 2, ..., 10`
  - 50 editable cells (5 × 10)

- **Data entry**
  - Free text input in any cell
  - No formulas / calculations (pure manual input)
  - In-memory only (no DB persistence)

- **Keyboard navigation (Excel-like)**
  - Arrow keys: move focus between cells
  - Shift + arrows: extend selection (rectangular range)
  - Tab / Shift + Tab: move horizontally (right/left)
  - Enter / Shift + Enter:
    - Enter: edit current cell or move down
    - Shift + Enter: move up
  - Ctrl + A: select all cells
  - Delete / Backspace: clear selected cells

- **Mouse selection**
  - Single click: select one cell
  - Shift + click: rectangular range selection
  - Ctrl + click: non-contiguous multi-selection
  - Drag with mouse: continuous selection

- **Copy / Paste**
  - Ctrl + C:
    - Copies current selection as TSV (tab-separated) for Excel compatibility
  - Ctrl + V:
    - If multiple cells selected → all cells get the same pasted value (first cell of clipboard)
    - If single cell selected → paste as matrix (rows × columns) starting at focused cell
  - Interoperable with Excel / Google Sheets clipboard

- **Fill handle**
  - Visual: blue square in bottom-right corner of focused cell
  - Behaviour:
    - Mouse down on square + drag:
      - Captures source value
      - Writes it into all cells traversed while dragging
    - Mouse up: ends fill mode and clears internal fill state

- **Export CSV & clear**
  - Button: `"Export to Excel"` (renamed from "Export CSV & Clear")
    - Generates CSV file compatible with Excel
    - Format:
      - First row: empty cell + column headers (or hierarchical column structure)
      - Each subsequent row: row number + cell values (escaped if contain quotes/commas)
    - Does not clear data (export only)
  - Button: `"Clear Table"`
    - Clears data and selection without exporting

- **Excel Load functionality**
  - Button: `"Excel Load"` (top-left of data grid)
    - Opens sliding panel from right side
    - Panel dimensions: Full height, 1/4 screen width
    - Overlay: White opaque, blocks interaction with rest of application
    - Animation: Smooth slide-in from right (0.3s)
  - **Download Template**:
    - Generates CSV template file with all columns (editable + calculated)
    - File name: `template_[module_name].xlsx` (e.g., `template_sales_data.xlsx`)
    - Empty template (no example rows)
  - **Upload Excel** (simulated):
    - Button: `"Select Excel File"` - triggers file selection dialog (simulated)
    - Button: `"Cargar datos demo"` - directly generates random demo data
    - Process:
      1. Shows progress indicator
      2. Duration: 3 seconds
      3. Generates 20 rows with random values
      4. Fills **75% of non-calculated cells** (calculated columns automatically excluded)
      5. Shows success message: "20 filas cargadas exitosamente"
    - **Random data generation**:
      - **Dates**: Valid dates from current or next year in DD/MM/YYYY format
      - **Numbers**: Fluctuate ±150% around base value:
        - Vol/Units: Base 1000 → Range [0, 2500]
        - Price/ASP: Base 100 → Range [0, 250]
        - Others: Base 500 → Range [0, 1250]
      - **Behavior**: Replaces existing data in grid
      - **Exclusions**: Group header rows and calculated columns are automatically skipped
  - **Cancel button**:
    - Icon: X
    - Function: Cancels operation in progress or closes panel
    - No confirmation dialog (direct close)

- **Calculated columns**
  - Support for read-only, auto-updating calculated fields
  - Formula definition via `calculatedColumns` prop
  - Columns can be identified by index (number) or function `(colIndex: number) => boolean`
  - Formulas receive: `(rowData, allRowsData, rowIndex, colIndex) => string`
  - Auto-updates when source values change
  - Automatically excluded from Excel Load random data generation
  - Examples:
    - **Turnover** (Sales Data): `Vol. × Price`
    - **Market Sales** (Market Insights): `Units × ASP $/vial`
    - **MarketShare** (Market Insights): `Market Sales / Total Market Sales`
    - **Vol.** (Patients News/Dropouts): `Patients × Dose`

- **Read-only columns**
  - Support via `readOnlyColumns` prop
  - Can be array of column indices or function `(colIndex: number) => boolean`
  - Calculated columns are automatically read-only
  - Read-only cells: Gray background, non-editable

- **Hierarchical structures**
  - **Hierarchical columns**: Support for main columns with sub-columns
    - Example: Months (main) → Vol., Price, Turnover (sub)
  - **Hierarchical rows**: Support for grouped rows with nested items
    - Example: Product Groups (group headers) → Products (nested items)
  - Group headers are automatically read-only and left-aligned

- **Conditional styling**
  - Support for visual highlighting based on data conditions
  - Example: Orange background (bg-orange-200) when Vol. increases ≥100% compared to previous month

---

## 3. Extracted Technical Design

- **Stack (source PoC)**
  - React 18 + TypeScript + Vite
  - Tailwind CSS + shadcn/ui-style Button
  - Lucide React for icons

- **Core files**
  - `src/components/DataGrid.tsx`
    - Main grid component (keyboard/mouse logic, data state, export)
  - `src/components/ui/button.tsx`
    - shadcn-style `Button` component
  - `src/lib/utils.ts`
    - `cn` helper (className composition)
  - `src/index.css`
    - Tailwind layers + CSS variables (`--background`, `--primary`, etc.)
  - `src/App.tsx`
    - Thin wrapper: layout, title and `<DataGrid />`

- **State model (DataGrid)**
  - `data: { [cellKey: string]: string }` → cell values (`"row-col": value`)
  - `selectedCells: Set<string>` → selected cell keys
  - `focusedCell: { row: number; col: number }`
  - `editingCell: string | null` → which cell is in edit mode
  - `filledCells: Set<string>` → cells affected during fill-handle drag
  - Refs:
    - `gridRef` → root grid container
    - `inputRefs` → map of `cellKey` → input DOM node
    - `fillSourceValueRef` → value used during fill handle
    - `isFillingRef` → whether we are in fill mode

- **Key behaviours**
  - `handleKeyDown`:
    - Interprets navigation keys, copy/paste, selection shortcuts and edit start/end
  - `moveFocus`:
    - Moves focused cell within bounds [0..ROWS-1], [0..COLS-1]
    - Updates selection when extending with Shift
  - `selectCell` / `selectRange`:
    - Single-cell vs rectangular selection
  - `handleCopy` / `handlePaste`:
    - Implements TSV-based interoperability with Excel
  - `handleFillHandleMouseDown`:
    - Installs global `mousemove` & `mouseup` listeners
    - Applies fill value to cells under pointer while dragging
  - `exportToCSV`:
    - Serialises internal `data` to CSV and triggers browser download

---

## 4. Nextcell Component – Target API (for `C_Grifols_Pharma_Int`)

> This section defines the **proposed public API** for `Nextcell` when reused in the Biopharma project.  
> Implementation will adapt the existing `DataGrid` internals to this interface.

- **Component name**
  - `Nextcell` (wrapper around the existing `DataGrid` behaviour).

- **Props (v2 – as implemented in `Mockup_Folder/src/components/nextcell/Nextcell.tsx`)**
  - `rows?: number`
    - Number of data rows (default: `10`). Ignored if `hierarchicalRows` is provided.
  - `cols?: number`
    - Number of data columns (default: `5`). Ignored if `hierarchicalColumns` is provided.
  - `colHeaders?: string[]`
    - Optional column headers; if provided and its length matches `cols`, these labels are used, otherwise headers fall back to `['A', 'B', 'C', ...]`. Ignored if `hierarchicalColumns` is provided.
  - `rowHeaders?: string[]`
    - Optional row labels; if provided and the index exists, `rowHeaders[row]` is used, otherwise defaults to `['1', '2', '3', ...]`. Ignored if `hierarchicalRows` is provided.
  - `initialData?: Record<string, string>`
    - Initial cell values keyed by `"row-col"` (format: `"${row}-${col}"`).
  - `onChange?: (data: Record<string, string>) => void`
    - Called every time any cell value changes (for integration with domain models or autosave).
  - `onExportCsv?: (csvText: string) => void`
    - Override of the default browser download behaviour; if provided, `Nextcell` calls this instead of triggering a file download.
  - `readOnly?: boolean`
    - If `true`, disables editing, selection and fill handle (grid becomes read-only).
  - `hierarchicalColumns?: HierarchicalColumn[]`
    - Support for nested column structure (main columns with sub-columns).
    - Example: `[{ main: "January", sub: ["Vol.", "Price", "Turnover"] }, ...]`
  - `hierarchicalRows?: HierarchicalRow[]`
    - Support for grouped row structure (group headers with nested items).
    - Example: `[{ group: "Grup1", items: ["Prod 1.1", "Prod 1.2"] }, ...]`
  - `calculatedColumns?: CalculatedColumn[]`
    - Array of calculated column definitions.
    - Each definition includes:
      - `index`: Column index (number) or function `(colIndex: number) => boolean` to identify calculated columns
      - `formula`: Function `(rowData, allRowsData, rowIndex, colIndex) => string` that computes the calculated value
    - Calculated columns are automatically read-only and excluded from Excel Load random data generation.
  - `readOnlyColumns?: number[] | ((colIndex: number) => boolean)`
    - Array of column indices or function to identify read-only columns.
    - Calculated columns are automatically read-only (no need to specify them here).

- **Non-goals (v2)**
  - Dynamic add/remove rows and columns.
  - Real Excel file parsing (currently simulated for demo purposes).
  - Data validation rules (future enhancement).

---

## 5. Integration Status

✅ **COMPLETED** - Component successfully extracted, integrated, and enhanced

- **✅ Step 1 – Component extracted**
  - Component located at: `Mockup_Folder/src/components/nextcell/Nextcell.tsx`
  - Fully functional with all required features

- **✅ Step 2 – PoC logic ported**
  - `DataGrid.tsx` logic successfully ported into `Nextcell.tsx`
  - Props-based configuration implemented
  - Selection, navigation, clipboard and fill-handle behaviour preserved
  - `onChange` and `onExportCsv` hooks exposed

- **✅ Step 3 – Integration with Biopharma modules**
  - **Sales Data**: Fully integrated with hierarchical columns (months → Vol., Price, Turnover), hierarchical rows (product groups → products), calculated Turnover column, and conditional styling (orange highlight for ≥100% Vol. increase)
  - **Market Insights**: Fully integrated with calculated columns (Market Sales, MarketShare)
  - **Patients News/Dropouts**: Fully integrated with hierarchical columns (months → Patients, Dose, Vol.), hierarchical rows (product groups → products), and calculated Vol. column (Patients × Dose)

- **✅ Step 4 – Excel Load functionality**
  - Excel Load panel implemented with sliding animation
  - Download Template functionality (generates CSV with all columns)
  - Upload Excel simulation with random data generation
  - Demo data generation (20 rows, 75% of non-calculated cells)
  - Automatic exclusion of calculated columns and group header rows from random data generation
  - Progress indicator and success messaging

- **✅ Step 5 – Enhanced features**
  - Calculated columns support (with function-based column identification)
  - Read-only columns support (array or function-based)
  - Hierarchical columns and rows support
  - Conditional styling support
  - Export button renamed to "Export to Excel"
  - Explanatory legends below data grids

---

## 6. Excel Load Functionality - Technical Details

### Implementation Overview

The Excel Load functionality is integrated directly into the Nextcell component, making it available to all modules that use Nextcell (Sales Data, Market Insights, Patients News/Dropouts).

### Panel Structure

- **Location**: Sliding panel from right side
- **Dimensions**: Full height (100%), 1/4 screen width
- **Overlay**: White opaque background (`bg-white/95`) blocking interaction with rest of application
- **Animation**: CSS transition with `transform: translateX(0)` (slide-in from right, 0.3s duration)
- **Title**: "Import Excel" (no icon)

### Download Template

- **Button**: "Download Template" (outline variant, no icon)
- **Function**: Generates CSV file (compatible with Excel) containing:
  - All column headers (including calculated columns for reference)
  - No data rows (empty template)
- **File naming**: `template_[module_name].xlsx`
  - Module names: `sales_data`, `market_insights`, `patients_news_dropouts`
- **Implementation**: Uses `hierarchicalColumns` or `colHeaders` to generate header row

### Upload Excel (Simulated)

- **Button 1**: "Select Excel File" (outline variant, no icon)
  - Currently triggers `startSimulatedUpload()` directly (bypasses native file dialog for demo)
  - Future: Will open native file picker and validate file structure
- **Button 2**: "Cargar datos demo" (outline variant, no icon)
  - Directly triggers `startSimulatedUpload()` without file selection
  - Same process as "Select Excel File" but skips file dialog

### Random Data Generation Process

1. **Progress indicator**: Shows during 3-second simulation
2. **Cell collection**: 
   - Iterates through all rows (excluding group header rows)
   - For each row, iterates through all columns
   - Checks if column is calculated (using `calculatedColumns` prop)
   - If not calculated, adds to `nonCalculatedCells` array
3. **Random selection**: Selects 75% of `nonCalculatedCells` randomly
4. **Value generation**:
   - **Dates**: For columns with "date" or "fecha" in header name
     - Generates valid dates from current or next year
     - Format: DD/MM/YYYY
   - **Numbers**: For numeric columns
     - Base values: Vol/Units (1000), Price/ASP (100), Others (500)
     - Fluctuation: ±150% (range: [0, base * 2.5])
     - Format: 2 decimal places
5. **Data replacement**: Replaces existing data in grid using `setData()`
6. **Success message**: Displays "20 filas cargadas exitosamente" after completion

### Technical Notes

- **Cell key format**: Uses `getCellKey(row, col)` helper function to ensure consistent `"row-col"` format (with hyphen, not comma)
- **Group header detection**: Uses `rowMapping` to identify and skip group header rows during data generation
- **Calculated column detection**: Uses `calculatedColumns` prop with function-based identification for flexible column matching
- **State management**: Uses React state (`isImportPanelOpen`, `isUploading`, `uploadProgress`, `showSuccessMessage`) for UI feedback

### Future Enhancements (Not Implemented)

- Real Excel file parsing (XLSX library integration)
- File structure validation (column matching, data type checking)
- Preview before loading (show data preview in panel)
- Error handling for invalid files
- Support for partial data updates (append vs. replace)

---

## 7. Summary

- ✅ The **Nextcell** component in `C_Grifols_Pharma_Int` is now a **fully operational, reusable, Excel-like data-entry grid**, successfully extracted from the `DataGrid` implementation originally in `C_shadcn-Excel`.
- ✅ The functional behaviour (navigation, selection, clipboard, fill handle, CSV export) is **fully implemented and tested**.
- ✅ **Enhanced features** (hierarchical structures, calculated columns, read-only columns, conditional styling, Excel Load) are **fully implemented and integrated**.
- ✅ **Integration complete**: Component is actively used in Sales Data, Market Insights, and Patients News/Dropouts modules.
- ✅ The source project `C_shadcn-Excel` is **no longer required** in the workspace as the component has been completely extracted and integrated.
- This PR document serves as the **historical record and specification** of the component extraction, integration, and enhancement process.


