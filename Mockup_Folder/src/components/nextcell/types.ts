export type CellKey = string // "row-col"

export interface HierarchicalColumn {
  main: string
  sub: string[]
}

export interface HierarchicalRow {
  group: string
  items: string[]
}

export interface CalculatedColumn {
  index: number | ((colIndex: number) => boolean)
  formula: (
    rowData: string[],
    allRowsData: string[][],
    rowIndex?: number,
    colIndex?: number,
  ) => string
}

export interface NextcellProps {
  rows?: number
  cols?: number
  colHeaders?: string[]
  rowHeaders?: string[]
  initialData?: Record<CellKey, string>
  onChange?: (data: Record<CellKey, string>) => void
  onExportCsv?: (csvText: string) => void
  readOnly?: boolean
  // Hierarchical structure support
  hierarchicalColumns?: HierarchicalColumn[]
  hierarchicalRows?: HierarchicalRow[]
  calculatedColumns?: CalculatedColumn[]
  readOnlyColumns?: number[] | ((colIndex: number) => boolean)
}

// Re-export for convenience
export type { HierarchicalColumn, HierarchicalRow, CalculatedColumn }

export interface CellPosition {
  row: number
  col: number
}

