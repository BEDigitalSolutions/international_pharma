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
    - CSV export

- **Context in `C_Grifols_Pharma_Int`**
  - Use this component as the base for:
    - Fast data-entry grids (e.g. PoCs, utilities, import/export helpers)
    - Future integration into domain-specific matrices defined in `PR_3.md` (Patients, Sales, Market Insights), reusing:
      - Navigation model
      - Selection model
      - Clipboard behaviour
      - Export logic

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
  - Button: `"Export CSV & Clear"`
    - Generates `export.csv`
    - Format:
      - First row: empty cell + column headers (`A,B,C,D,E`)
      - Each subsequent row: row number + cell values (escaped if contain quotes/commas)
    - Clears:
      - All cell values
      - Selection
      - Focus → back to (row 0, col 0)
  - Button: `"Clear Table"`
    - Clears data and selection without exporting

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

- **Props (v1 – as implemented in `Mockup_Folder/src/components/nextcell/Nextcell.tsx`)**
  - `rows?: number`
    - Number of data rows (default: `10`).
  - `cols?: number`
    - Number of data columns (default: `5`).
  - `colHeaders?: string[]`
    - Optional column headers; if provided and its length matches `cols`, these labels are used, otherwise headers fall back to `['A', 'B', 'C', ...]`.
  - `rowHeaders?: string[]`
    - Optional row labels; if provided and the index exists, `rowHeaders[row]` is used, otherwise defaults to `['1', '2', '3', ...]`.
  - `initialData?: Record<string, string>`
    - Initial cell values keyed by `"row-col"`.
  - `onChange?: (data: Record<string, string>) => void`
    - Called every time any cell value changes (for integration with domain models or autosave).
  - `onExportCsv?: (csvText: string) => void`
    - Override of the default browser download behaviour; if provided, `Nextcell` calls this instead of triggering a file download.
  - `readOnly?: boolean`
    - If `true`, disables editing, selection and fill handle (grid becomes read-only).

- **Non-goals (v1)**
  - Dynamic add/remove rows and columns.
  - Domain-specific headers/structures from `PR_3.md` (Patients/Sales/Market Insights): these will sit **on top** of `Nextcell` via composition or adapters.

---

## 5. Integration Status

✅ **COMPLETED** - Component successfully extracted and integrated

- **✅ Step 1 – Component extracted**
  - Component located at: `Mockup_Folder/src/components/nextcell/Nextcell.tsx`
  - Fully functional with all required features

- **✅ Step 2 – PoC logic ported**
  - `DataGrid.tsx` logic successfully ported into `Nextcell.tsx`
  - Props-based configuration implemented
  - Selection, navigation, clipboard and fill-handle behaviour preserved
  - `onChange` and `onExportCsv` hooks exposed

- **🔄 Step 3 – Future integration with Biopharma modules**
  - Ready for integration into domain-specific modules
  - Can be used as the engine for:
    - Generic "Excel-like" editors (fast prototyping)
    - Patients / Sales / Market tables in `PR_3.md` (with additional row/column labelling and read-only/calculated fields on top)

---

## 6. Summary

- ✅ The **Nextcell** component in `C_Grifols_Pharma_Int` is now a **fully operational, reusable, Excel-like data-entry grid**, successfully extracted from the `DataGrid` implementation originally in `C_shadcn-Excel`.
- ✅ The functional behaviour (navigation, selection, clipboard, fill handle, CSV export) is **fully implemented and tested**.
- ✅ The source project `C_shadcn-Excel` is **no longer required** in the workspace as the component has been completely extracted and integrated.
- This PR document serves as the **historical record and specification** of the component extraction and integration process.


