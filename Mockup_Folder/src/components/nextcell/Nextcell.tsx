import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { Download, Trash2, Upload, X, FileSpreadsheet, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import type {
  CellKey,
  NextcellProps,
  CellPosition,
} from './types'

export function Nextcell({
  rows: propRows,
  cols: propCols,
  colHeaders,
  rowHeaders,
  initialData,
  onChange,
  onExportCsv,
  readOnly = false,
  hierarchicalColumns,
  hierarchicalRows,
  calculatedColumns,
  readOnlyColumns = [],
}: NextcellProps) {
  // Compute flat dimensions from hierarchical structures
  const flatRows = useMemo(() => {
    if (hierarchicalRows) {
      // Include group header rows + product rows
      return hierarchicalRows.reduce(
        (acc, group) => acc + 1 + group.items.length, // 1 for group header, N for items
        0,
      )
    }
    return propRows ?? 10
  }, [hierarchicalRows, propRows])

  const flatCols = useMemo(() => {
    if (hierarchicalColumns) {
      return hierarchicalColumns.reduce((acc, col) => acc + col.sub.length, 0)
    }
    return propCols ?? 5
  }, [hierarchicalColumns, propCols])

  const rows = flatRows
  const cols = flatCols

  // Build row mapping: flat index -> { group, item, isGroupHeader }
  const rowMapping = useMemo(() => {
    if (!hierarchicalRows) {
      return Array.from({ length: rows }, (_, i) => ({
        flatIndex: i,
        groupIndex: -1,
        itemIndex: -1,
        isGroupHeader: false,
        label: rowHeaders?.[i] ?? (i + 1).toString(),
        groupName: undefined as string | undefined,
      }))
    }

    const mapping: Array<{
      flatIndex: number
      groupIndex: number
      itemIndex: number
      isGroupHeader: boolean
      label: string
      groupName?: string
    }> = []

    let flatIdx = 0
    hierarchicalRows.forEach((group, groupIdx) => {
      // Group header row (all groups expanded, no collapse)
      mapping.push({
        flatIndex: flatIdx,
        groupIndex: groupIdx,
        itemIndex: -1,
        isGroupHeader: true,
        label: group.group,
        groupName: group.group,
      })
      flatIdx += 1

      // Product rows under this group
      group.items.forEach((item, itemIdx) => {
        mapping.push({
          flatIndex: flatIdx,
          groupIndex: groupIdx,
          itemIndex: itemIdx,
          isGroupHeader: false,
          label: item,
          groupName: group.group,
        })
        flatIdx += 1
      })
    })

    return mapping
  }, [hierarchicalRows, rows, rowHeaders])

  const [data, setData] = useState<Record<CellKey, string>>(initialData ?? {})
  const [selectedCells, setSelectedCells] = useState<Set<CellKey>>(new Set())
  const [focusedCell, setFocusedCell] = useState<CellPosition>({
    row: 0,
    col: 0,
  })
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<CellPosition | null>(null)
  const [editingCell, setEditingCell] = useState<CellKey | null>(null)
  const [isFilling, setIsFilling] = useState(false)
  const [, setFilledCells] = useState<Set<CellKey>>(new Set())
  
  // Excel Load panel states
  const [isImportPanelOpen, setIsImportPanelOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const inputRefs = useRef<Record<CellKey, HTMLInputElement | null>>({})
  const fillSourceValueRef = useRef<string>('')
  const isFillingRef = useRef<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const registerInputRef = useCallback(
    (cellKey: CellKey) => (el: HTMLInputElement | null) => {
      if (el) {
        inputRefs.current[cellKey] = el
      } else {
        delete inputRefs.current[cellKey]
      }
    },
    [],
  )

  const getCellKey = (row: number, col: number): CellKey => `${row}-${col}`

  // Check if a cell is read-only
  const isCellReadOnly = (row: number, col: number): boolean => {
    if (readOnly) return true
    // Group header rows are always read-only
    const rowMappingItem = rowMapping[row]
    if (rowMappingItem?.isGroupHeader) return true
    
    // Check readOnlyColumns (can be array or function)
    if (readOnlyColumns) {
      if (Array.isArray(readOnlyColumns)) {
        if (readOnlyColumns.includes(col)) return true
      } else if (typeof readOnlyColumns === 'function') {
        if (readOnlyColumns(col)) return true
      }
    }
    
    // Check calculatedColumns
    if (calculatedColumns) {
      const calcCol = calculatedColumns.find((cc) => {
        if (typeof cc.index === 'number') {
          return cc.index === col
        } else if (typeof cc.index === 'function') {
          return cc.index(col)
        }
        return false
      })
      if (calcCol) return true
    }
    return false
  }

  // Get raw cell value (without calculations) for use in formulas
  const getRawCellValue = (row: number, col: number): string => {
    const rowMappingItem = rowMapping[row]
    if (rowMappingItem?.isGroupHeader) return ''
    return data[getCellKey(row, col)] ?? ''
  }

  // Get all row data for calculations (excluding group header rows, using raw values)
  const getAllRowsData = (): string[][] => {
    const allData: string[][] = []
    for (let r = 0; r < rows; r += 1) {
      const rowMappingItem = rowMapping[r]
      // Skip group header rows in calculations
      if (rowMappingItem?.isGroupHeader) continue

      const rowData: string[] = []
      for (let c = 0; c < cols; c += 1) {
        rowData.push(getRawCellValue(r, c))
      }
      allData.push(rowData)
    }
    return allData
  }

  // Calculate value for calculated columns
  const getCalculatedValue = (row: number, col: number): string => {
    if (!calculatedColumns) return ''
    const calcCol = calculatedColumns.find((cc) => {
      if (typeof cc.index === 'number') {
        return cc.index === col
      } else if (typeof cc.index === 'function') {
        return cc.index(col)
      }
      return false
    })
    if (!calcCol) return ''

    // Use raw values (not calculated) for the current row
    const rowData = Array.from({ length: cols }, (_, c) => getRawCellValue(row, c))
    const allRowsData = getAllRowsData()
    return calcCol.formula(rowData, allRowsData, row, col)
  }

  const getCellValue = (row: number, col: number) => {
    // Group header rows have no cell values
    const rowMappingItem = rowMapping[row]
    if (rowMappingItem?.isGroupHeader) return ''

    // Check if this is a calculated column
    if (calculatedColumns) {
      const calcCol = calculatedColumns.find((cc) => {
        if (typeof cc.index === 'number') {
          return cc.index === col
        } else if (typeof cc.index === 'function') {
          return cc.index(col)
        }
        return false
      })
      if (calcCol) {
        return getCalculatedValue(row, col)
      }
    }

    // Return stored data value
    return data[getCellKey(row, col)] ?? ''
  }

  // Check if Vol. increased 100% compared to previous month
  const isVolIncrease100 = (row: number, col: number): boolean => {
    if (!hierarchicalColumns) return false
    
    // Check if this is a Vol. column (first sub-column of each month)
    const monthIndex = Math.floor(col / 3)
    const subIndex = col % 3
    if (subIndex !== 0) return false // Not a Vol. column
    
    // Get previous month's Vol. value
    if (monthIndex === 0) return false // No previous month
    
    const prevMonthVolCol = (monthIndex - 1) * 3 + 0
    const currentVol = parseFloat(getRawCellValue(row, col) || '0')
    const prevVol = parseFloat(getRawCellValue(row, prevMonthVolCol) || '0')
    
    if (prevVol === 0) return false
    const increase = ((currentVol - prevVol) / prevVol) * 100
    return increase >= 100
  }

  const setCellValue = (row: number, col: number, value: string) => {
    if (isCellReadOnly(row, col)) return

    const key = getCellKey(row, col)
    setData((prev) => {
      const next = { ...prev, [key]: value }
      return next
    })
  }

  // Recalculate when data changes
  useEffect(() => {
    if (calculatedColumns && calculatedColumns.length > 0) {
      // Trigger re-render by updating a dummy state or forcing recalculation
      // The calculated values are computed on-the-fly in getCellValue
    }
  }, [data, calculatedColumns])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).__nextcellData = data
    }
  }, [data])

  // Propagate changes upwards
  useEffect(() => {
    if (onChange) onChange(data)
  }, [data, onChange])

  const isCellSelected = (row: number, col: number) =>
    selectedCells.has(getCellKey(row, col))

  const selectCell = (
    row: number,
    col: number,
    multiSelect: boolean = false,
  ) => {
    const key = getCellKey(row, col)

    if (editingCell && editingCell !== key) {
      setEditingCell(null)
    }

    if (multiSelect) {
      setSelectedCells((prev) => {
        const next = new Set(prev)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
        return next
      })
    } else {
      setSelectedCells(new Set([key]))
    }

    setFocusedCell({ row, col })
  }

  const selectRange = (start: CellPosition, end: CellPosition) => {
    const minRow = Math.min(start.row, end.row)
    const maxRow = Math.max(start.row, end.row)
    const minCol = Math.min(start.col, end.col)
    const maxCol = Math.max(start.col, end.col)

    const next = new Set<CellKey>()
    for (let r = minRow; r <= maxRow; r += 1) {
      for (let c = minCol; c <= maxCol; c += 1) {
        if (!isCellReadOnly(r, c)) {
        next.add(getCellKey(r, c))
        }
      }
    }
    setSelectedCells(next)
  }

  // Find next editable cell in direction
  const findNextEditableCell = (
    startRow: number,
    startCol: number,
    rowDelta: number,
    colDelta: number,
  ): CellPosition | null => {
    let currentRow = startRow + rowDelta
    let currentCol = startCol + colDelta

    // Try up to rows+cols times to find editable cell
    for (let attempts = 0; attempts < rows + cols; attempts += 1) {
      if (currentRow < 0) currentRow = rows - 1
      if (currentRow >= rows) currentRow = 0
      if (currentCol < 0) currentCol = cols - 1
      if (currentCol >= cols) currentCol = 0

      if (!isCellReadOnly(currentRow, currentCol)) {
        return { row: currentRow, col: currentCol }
      }

      currentRow += rowDelta
      currentCol += colDelta
    }

    return null
  }

  const moveFocus = (rowDelta: number, colDelta: number, extend = false) => {
    if (editingCell) setEditingCell(null)

    const next = findNextEditableCell(
      focusedCell.row,
      focusedCell.col,
      rowDelta,
      colDelta,
    )

    if (!next) return

    if (extend && selectionStart) {
      selectRange(selectionStart, next)
      setFocusedCell(next)
    } else {
      if (extend) {
        setSelectionStart(focusedCell)
        selectRange(focusedCell, next)
      } else {
        selectCell(next.row, next.col)
        setSelectionStart(null)
      }
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    if (readOnly) return

    const key = getCellKey(row, col)
    const isShift = e.shiftKey
    const isCtrl = e.ctrlKey || e.metaKey

    if (editingCell === key) {
      if (e.key === 'Enter') {
        e.preventDefault()
        setEditingCell(null)
        moveFocus(1, 0)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setEditingCell(null)
      }
      return
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        moveFocus(-1, 0, isShift)
        break
      case 'ArrowDown':
        e.preventDefault()
        moveFocus(1, 0, isShift)
        break
      case 'ArrowLeft':
        e.preventDefault()
        moveFocus(0, -1, isShift)
        break
      case 'ArrowRight':
        e.preventDefault()
        moveFocus(0, 1, isShift)
        break
      case 'Tab':
        e.preventDefault()
        moveFocus(0, isShift ? -1 : 1)
        break
      case 'Enter':
        e.preventDefault()
        if (isShift) {
          moveFocus(-1, 0)
        } else {
          if (!isCellReadOnly(row, col)) {
          setEditingCell(key)
          }
        }
        break
      case 'c':
        if (isCtrl) {
          e.preventDefault()
          handleCopy()
        }
        break
      case 'v':
        if (isCtrl) {
          e.preventDefault()
          handlePaste()
        }
        break
      case 'a':
        if (isCtrl) {
          e.preventDefault()
          selectAll()
        }
        break
      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        clearSelectedCells()
        break
      default:
        if (e.key.length === 1 && !isCtrl && !isCellReadOnly(row, col)) {
          setEditingCell(key)
        }
    }
  }

  const handleCopy = () => {
    const selectedArray = Array.from(selectedCells)
      .map((key) => {
      const [row, col] = key.split('-').map(Number)
      return { row, col, value: getCellValue(row, col) }
    })
      .filter((c) => !isCellReadOnly(c.row, c.col))

    if (!selectedArray.length) return

    selectedArray.sort((a, b) => a.row - b.row || a.col - b.col)

    const minRow = Math.min(...selectedArray.map((c) => c.row))
    const maxRow = Math.max(...selectedArray.map((c) => c.row))
    const minCol = Math.min(...selectedArray.map((c) => c.col))
    const maxCol = Math.max(...selectedArray.map((c) => c.col))

    let tsvText = ''
    for (let row = minRow; row <= maxRow; row += 1) {
      const rowValues: string[] = []
      for (let col = minCol; col <= maxCol; col += 1) {
        if (!isCellReadOnly(row, col)) {
        rowValues.push(getCellValue(row, col))
        } else {
          rowValues.push('')
        }
      }
      tsvText += `${rowValues.join('\t')}\n`
    }

    navigator.clipboard.writeText(tsvText).catch(() => {
      // ignore clipboard errors
    })
  }

  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (!text) return

        if (selectedCells.size > 1) {
          const firstLine = text.split('\n')[0]?.trim() ?? ''
          const firstValue = firstLine.split('\t')[0]?.trim() ?? firstLine
          selectedCells.forEach((cellKey) => {
            const [row, col] = cellKey.split('-').map(Number)
            if (!isCellReadOnly(row, col)) {
            setCellValue(row, col, firstValue)
            }
          })
        } else {
          const lines = text.split('\n').filter((line) => line.length > 0)
          const { row: startRow, col: startCol } = focusedCell

          lines.forEach((line, rowOffset) => {
            const values = line.split('\t')
            values.forEach((value, colOffset) => {
              const targetRow = startRow + rowOffset
              const targetCol = startCol + colOffset
              if (
                targetRow < rows &&
                targetCol < cols &&
                !isCellReadOnly(targetRow, targetCol)
              ) {
                setCellValue(targetRow, targetCol, value)
              }
            })
          })
        }
      })
      .catch(() => {
        // ignore clipboard errors
      })
  }

  const selectAll = () => {
    const allCells = new Set<CellKey>()
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        if (!isCellReadOnly(row, col)) {
        allCells.add(getCellKey(row, col))
        }
      }
    }
    setSelectedCells(allCells)
  }

  const clearSelectedCells = () => {
    setData((prev) => {
      const next = { ...prev }
      selectedCells.forEach((key) => {
        const [row, col] = key.split('-').map(Number)
        if (!isCellReadOnly(row, col)) {
        delete next[key]
        }
      })
      return next
    })
  }

  const handleMouseDown = (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLTableCellElement>,
  ) => {
    if (readOnly || isCellReadOnly(row, col)) return

    if (e.shiftKey && selectionStart) {
      selectRange(selectionStart, { row, col })
    } else if (e.ctrlKey || e.metaKey) {
      selectCell(row, col, true)
      setSelectionStart({ row, col })
    } else {
      selectCell(row, col)
      setSelectionStart({ row, col })
      setIsSelecting(true)
    }
  }

  const handleMouseEnter = (
    row: number,
    col: number,
    e?: React.MouseEvent<HTMLTableCellElement>,
  ) => {
    if (isFillingRef.current && fillSourceValueRef.current && e?.buttons === 1) {
      if (!isCellReadOnly(row, col)) {
      const cellKey = getCellKey(row, col)
      setCellValue(row, col, fillSourceValueRef.current)
      setFilledCells((prev) => new Set([...prev, cellKey]))
      setFocusedCell({ row, col })
      }
    } else if (isSelecting && selectionStart && !isFillingRef.current) {
      if (!isCellReadOnly(row, col)) {
      selectRange(selectionStart, { row, col })
      setFocusedCell({ row, col })
      }
    }
  }

  const handleMouseMove = (
    row: number,
    col: number,
    e?: React.MouseEvent<HTMLTableCellElement>,
  ) => {
    if (isFillingRef.current && fillSourceValueRef.current && e?.buttons === 1) {
      if (!isCellReadOnly(row, col)) {
      const cellKey = getCellKey(row, col)
      setCellValue(row, col, fillSourceValueRef.current)
      setFilledCells((prev) => new Set([...prev, cellKey]))
      setFocusedCell({ row, col })
      }
    }
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  const handleFillHandleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    row: number,
    col: number,
  ) => {
    if (readOnly || isCellReadOnly(row, col)) return
    if (e.button !== 0) return

    e.preventDefault()
    e.stopPropagation()

    const sourceValue = getCellValue(row, col)
    fillSourceValueRef.current = sourceValue
    isFillingRef.current = true
    setIsFilling(true)

    const sourceCellKey = getCellKey(row, col)
    setFilledCells(new Set([sourceCellKey]))
    selectCell(row, col)

    const handleGlobalMouseMove = (ev: MouseEvent) => {
      if (!isFillingRef.current || !fillSourceValueRef.current || ev.buttons !== 1) {
        return
      }

      const target = ev.target as HTMLElement
      const td = target.closest('td')
      if (!td?.parentElement) return

      const tr = td.parentElement as HTMLTableRowElement
      if (!tr?.parentElement) return

      const tbody = tr.parentElement
      if (!(tbody instanceof HTMLTableSectionElement) || tbody.tagName !== 'TBODY') {
        return
      }

      const rowIndex = Array.from(tbody.children).indexOf(tr)
      const colIndex = Array.from(tr.children).indexOf(td) - 1 // first col is row header

      if (
        rowIndex >= 0 &&
        rowIndex < rows &&
        colIndex >= 0 &&
        colIndex < cols &&
        !isCellReadOnly(rowIndex, colIndex)
      ) {
        const cellKey = getCellKey(rowIndex, colIndex)
        setData((prev) => ({
          ...prev,
          [cellKey]: fillSourceValueRef.current,
        }))
        setFilledCells((prev) => new Set([...prev, cellKey]))
        setFocusedCell({ row: rowIndex, col: colIndex })
      }
    }

    const cleanup = () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove, true)
      document.removeEventListener('mouseup', cleanup, true)
      isFillingRef.current = false
      setIsFilling(false)
      fillSourceValueRef.current = ''
      setFilledCells(new Set())
    }

    document.addEventListener('mousemove', handleGlobalMouseMove, {
      capture: true,
    })
    document.addEventListener('mouseup', cleanup, { capture: true })
  }

  useEffect(() => {
    const onMouseUp = () => handleMouseUp()
    document.addEventListener('mouseup', onMouseUp)
    return () => document.removeEventListener('mouseup', onMouseUp)
  }, [])

  useEffect(() => {
    const key = getCellKey(focusedCell.row, focusedCell.col)
    const input = inputRefs.current[key]
    if (input && editingCell !== key) {
      setTimeout(() => input.focus(), 0)
    }
  }, [focusedCell, editingCell])

  const doExportCsv = () => {
    let csv = ''

    // Export headers
    if (hierarchicalColumns) {
      // Main header row
      const mainHeaders: string[] = ['']
      hierarchicalColumns.forEach((col) => {
        mainHeaders.push(col.main)
        for (let i = 1; i < col.sub.length; i += 1) {
          mainHeaders.push('')
        }
      })
      csv += `${mainHeaders.join(',')}\n`

      // Sub header row
      const subHeaders: string[] = ['']
      hierarchicalColumns.forEach((col) => {
        col.sub.forEach((sub) => {
          subHeaders.push(sub)
        })
      })
      csv += `${subHeaders.join(',')}\n`
    } else {
    const headers =
      colHeaders && colHeaders.length === cols
        ? colHeaders
        : Array.from({ length: cols }, (_, i) =>
            String.fromCharCode('A'.charCodeAt(0) + i),
          )
    csv += `,${headers.join(',')}\n`
    }

    // Export data rows
    for (let row = 0; row < rows; row += 1) {
      const rowMappingItem = rowMapping[row]
      const rowLabel = rowMappingItem?.label ?? (row + 1).toString()

      const rowData: string[] = [rowLabel]
      for (let col = 0; col < cols; col += 1) {
        const raw = getCellValue(row, col)
        const escaped =
          raw.includes(',') || raw.includes('"')
            ? `"${raw.replace(/"/g, '""')}"`
            : raw
        rowData.push(escaped)
      }
      csv += `${rowData.join(',')}\n`
    }

    if (onExportCsv) {
      onExportCsv(csv)
      return
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'export.csv'
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportAndClear = () => {
    doExportCsv()
    setData({})
    setSelectedCells(new Set())
    setFocusedCell({ row: 0, col: 0 })
  }

  const handleClearTable = () => {
    setData({})
    setSelectedCells(new Set())
    setFocusedCell({ row: 0, col: 0 })
  }

  // Excel Load functions
  /**
   * Opens the Excel Import panel from the right side of the screen.
   * Resets any previous success messages.
   */
  const handleOpenImportPanel = () => {
    setIsImportPanelOpen(true)
    setShowSuccessMessage(false)
  }

  /**
   * Closes the Excel Import panel and resets all related state.
   * Cancels any ongoing upload operation.
   */
  const handleCloseImportPanel = () => {
    setIsImportPanelOpen(false)
    setIsUploading(false)
    setUploadProgress(0)
    setShowSuccessMessage(false)
  }

  /**
   * Generates and downloads an Excel template file with the current grid structure.
   * 
   * The template includes:
   * - All column headers (hierarchical or flat)
   * - All columns including calculated ones (for reference)
   * - Empty rows (no sample data)
   * 
   * The file is downloaded as CSV format (compatible with Excel).
   * In a real implementation, the filename should be based on the module name.
   * 
   * @todo Add module name prop to generate proper filename (e.g., template_sales_data.xlsx)
   */
  const handleDownloadTemplate = () => {
    // Generate Excel template with current structure
    const headers: string[] = []
    
    if (hierarchicalColumns) {
      hierarchicalColumns.forEach((col) => {
        col.sub.forEach((subCol) => {
          headers.push(`${col.main} - ${subCol}`)
        })
      })
    } else if (colHeaders) {
      headers.push(...colHeaders)
    } else {
      for (let i = 0; i < cols; i++) {
        headers.push(`Column ${i + 1}`)
      }
    }

    // Create CSV template
    const csvContent = headers.join(',') + '\n'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    // Generate filename based on current context (would need to be passed as prop in real implementation)
    const filename = 'template_data.xlsx'
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Generates a random value based on the column header type.
   * Used for demo data generation in Excel Load functionality.
   * 
   * @param colHeader - The column header name (case-insensitive)
   * @returns A string representation of the generated value
   * 
   * Value generation rules:
   * - Dates: Valid dates in DD/MM/YYYY format (current or next year)
   * - Vol/Units: Base 1000 with ±150% variation (range: 0-2500)
   * - Price/ASP: Base 100 with ±150% variation (range: 0-250)
   * - Other numeric: Base 500 with ±150% variation (range: 0-1250)
   */
  const generateRandomValue = (colHeader: string): string => {
    const lowerHeader = colHeader.toLowerCase()
    
    // Date columns - Format DD/MM/YYYY
    if (lowerHeader.includes('date') || lowerHeader.includes('month')) {
      const currentYear = new Date().getFullYear()
      const year = currentYear + Math.floor(Math.random() * 2) // Current or next year
      const month = Math.floor(Math.random() * 12) + 1
      const day = Math.floor(Math.random() * 28) + 1 // 1-28 to avoid invalid dates
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
    }
    
    // Volume/Units columns
    if (lowerHeader.includes('vol') || lowerHeader.includes('units')) {
      const baseValue = 1000
      const variation = (Math.random() * 3 - 1.5) // ±150%
      const value = Math.max(0, baseValue * (1 + variation))
      return Math.round(value).toString()
    }
    
    // Price columns
    if (lowerHeader.includes('price') || lowerHeader.includes('asp')) {
      const baseValue = 100
      const variation = (Math.random() * 3 - 1.5) // ±150%
      const value = Math.max(0, baseValue * (1 + variation))
      return value.toFixed(2)
    }
    
    // Generic numeric columns
    const baseValue = 500
    const variation = (Math.random() * 3 - 1.5) // ±150%
    const value = Math.max(0, baseValue * (1 + variation))
    return Math.round(value).toString()
  }

  /**
   * Simulates an Excel file upload by generating random demo data.
   * 
   * This function:
   * 1. Shows a progress indicator for 3 seconds
   * 2. Generates random data for 75% of non-calculated cells (excluding group headers)
   * 3. Fills up to 20 rows with valid random values based on column types
   * 4. Replaces all existing data in the grid
   * 5. Shows a success message and closes the panel after 3 seconds
   * 
   * Note: Uses getCellKey() to ensure correct cell key format (row-col with hyphen).
   * This was critical to fix a bug where data wasn't appearing due to incorrect key format.
   * 
   * @see generateRandomValue - For value generation logic
   * @see getCellKey - For cell key format (must use this function, not manual string concatenation)
   */
  const startSimulatedUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    setShowSuccessMessage(false)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 33.33 // 3 steps to reach 100%
      })
    }, 1000)

    setTimeout(() => {
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Generate 20 rows of random data
      const newData: Record<CellKey, string> = {}
      const rowsToFill = Math.min(20, rows)
      
      // Get column headers for value generation
      const headers: string[] = []
      if (hierarchicalColumns) {
        hierarchicalColumns.forEach((col) => {
          col.sub.forEach((subCol) => {
            headers.push(`${col.main} - ${subCol}`)
          })
        })
      } else if (colHeaders) {
        headers.push(...colHeaders)
      } else {
        for (let i = 0; i < cols; i++) {
          headers.push(`Column ${i + 1}`)
        }
      }

      // Collect all non-calculated cells (excluding group header rows)
      const nonCalculatedCells: Array<{ row: number; col: number; header: string }> = []
      for (let row = 0; row < rowsToFill; row++) {
        // Skip group header rows
        const rowMappingItem = rowMapping[row]
        if (rowMappingItem?.isGroupHeader) continue
        
        for (let col = 0; col < cols; col++) {
          // Check if column is calculated
          const isCalculated = calculatedColumns?.some(
            (calcCol) => {
              if (typeof calcCol.index === 'number') {
                return calcCol.index === col
              }
              if (typeof calcCol.index === 'function') {
                return calcCol.index(col)
              }
              return false
            }
          )
          
          if (!isCalculated) {
            nonCalculatedCells.push({
              row,
              col,
              header: headers[col] || `Column ${col + 1}`
            })
          }
        }
      }

      // Fill only 75% of non-calculated cells randomly
      const cellsToFill = Math.floor(nonCalculatedCells.length * 0.75)
      const shuffledCells = nonCalculatedCells.sort(() => Math.random() - 0.5)
      
      for (let i = 0; i < cellsToFill; i++) {
        const cell = shuffledCells[i]
        // IMPORTANT: Use getCellKey() to ensure correct format (row-col with hyphen)
        // Previous bug: Using `${cell.row},${cell.col}` (comma) caused data not to appear
        const cellKey = getCellKey(cell.row, cell.col)
        newData[cellKey] = generateRandomValue(cell.header)
      }

      if (import.meta.env.DEV) {
        console.log('Nextcell demo data', {
          cellsGenerated: Object.keys(newData).length,
          rowsToFill,
          totalRows: rows,
          totalCols: cols,
        })
      }
      setData(newData)
      
      // Show success message
      setShowSuccessMessage(true)
      setIsUploading(false)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
        handleCloseImportPanel()
      }, 3000)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, 3000)
  }

  /**
   * Handles file selection from the file input and triggers simulated upload.
   * 
   * Currently only simulates the upload process (no actual file parsing).
   * In a real implementation, this would:
   * 1. Parse the Excel/CSV file
   * 2. Validate structure matches template
   * 3. Extract data and populate the grid
   * 
   * For now, it delegates to startSimulatedUpload() to generate demo data.
   * 
   * @param event - File input change event
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    startSimulatedUpload()
  }

  // Render hierarchical or flat headers
  const renderHeaders = () => {
    if (hierarchicalColumns) {
      return (
        <>
          {/* Main header row */}
          <tr>
            <th className="h-8 border border-slate-300 bg-slate-50" />
            {hierarchicalColumns.map((col, mainIdx) => (
              <th
                key={`main-${mainIdx}`}
                className="h-8 border border-slate-300 bg-slate-100 px-2 text-center text-[11px] font-medium text-slate-600"
                colSpan={col.sub.length}
              >
                {col.main}
              </th>
            ))}
          </tr>
          {/* Sub header row */}
          <tr>
            <th className="h-8 border border-slate-300 bg-slate-50" />
            {hierarchicalColumns.map((col) =>
              col.sub.map((sub, subIdx) => (
                <th
                  key={`sub-${col.main}-${subIdx}`}
                  className="h-8 border border-slate-300 bg-slate-50 px-2 text-center text-[10px] font-medium text-slate-600"
                >
                  {sub}
                </th>
              )),
            )}
          </tr>
        </>
      )
    }

    // Flat headers
  const effectiveColHeaders =
    colHeaders && colHeaders.length === cols
      ? colHeaders
      : Array.from({ length: cols }, (_, i) =>
          String.fromCharCode('A'.charCodeAt(0) + i),
        )

  return (
            <tr>
              <th className="h-8 w-10 border border-slate-300 bg-slate-50" />
              {effectiveColHeaders.map((header) => (
                <th
                  key={header}
                  className="h-8 w-28 border border-slate-300 bg-slate-50 px-2 text-center text-[11px] font-medium text-slate-600"
                >
                  {header}
                </th>
              ))}
            </tr>
    )
  }

  // Render rows with hierarchical support
  const renderRows = () => {
    const rowsToRender: React.ReactNode[] = []
    let currentGroupName: string | undefined

    for (let row = 0; row < rows; row += 1) {
      const rowMappingItem = rowMapping[row]
      const isNewGroup =
        rowMappingItem?.groupName &&
        rowMappingItem.groupName !== currentGroupName

      if (isNewGroup && rowMappingItem.groupName) {
        currentGroupName = rowMappingItem.groupName
        // Render group header row (if we want to show it)
        // For now, we'll just use indentation in the row label
      }

      const rowLabel = rowMappingItem?.label ?? (row + 1).toString()
      const isGroupHeader = rowMappingItem?.isGroupHeader ?? false
      const indentLevel = rowMappingItem?.groupName && !isGroupHeader ? 1 : 0

      rowsToRender.push(
              <tr key={row}>
          <td
            className={[
              'h-8 border border-slate-300 bg-slate-50 text-[11px] font-medium text-slate-600',
              isGroupHeader ? 'bg-slate-100 font-semibold text-left' : 'text-center',
            ].join(' ')}
            style={{ paddingLeft: `${indentLevel * 16}px` }}
            colSpan={isGroupHeader ? cols + 1 : 1}
          >
            {rowLabel}
                </td>
          {!isGroupHeader &&
            Array.from({ length: cols }, (_, col) => {
                  const cellKey = getCellKey(row, col)
                  const isSelected = isCellSelected(row, col)
                  const isFocused =
                    focusedCell.row === row && focusedCell.col === col
                  const isEditing = editingCell === cellKey
            const isReadOnly = isCellReadOnly(row, col)
            const cellValue = getCellValue(row, col)

            const isVolHighlight = isVolIncrease100(row, col)

                  return (
                    <td
                      key={col}
                      className={[
                  'relative h-8 border border-slate-300 p-0',
                  isReadOnly ? 'bg-slate-100 text-slate-500' : 'bg-white',
                  isSelected && !isReadOnly ? 'bg-blue-50' : '',
                  isFocused && !isReadOnly ? 'ring-2 ring-blue-500 ring-inset' : '',
                  isVolHighlight ? 'bg-orange-200' : '',
                      ].join(' ')}
                      onMouseDown={(e) => handleMouseDown(row, col, e)}
                      onMouseEnter={(e) => handleMouseEnter(row, col, e)}
                      onMouseMove={(e) => handleMouseMove(row, col, e)}
                      onMouseUp={handleMouseUp}
                    >
                      <input
                  ref={registerInputRef(cellKey)}
                        type="text"
                  value={cellValue}
                  readOnly={isReadOnly || !isEditing}
                  onChange={(e) => setCellValue(row, col, e.target.value)}
                        onFocus={() => {
                    if (!isReadOnly) {
                          setFocusedCell({ row, col })
                          if (!isSelected) selectCell(row, col)
                    }
                        }}
                        onDoubleClick={() =>
                    !readOnly && !isReadOnly && setEditingCell(cellKey)
                        }
                        onKeyDown={(e) => handleKeyDown(e, row, col)}
                  className={[
                    'h-full w-full bg-transparent px-2 text-[11px] text-right outline-none',
                    isReadOnly ? 'cursor-not-allowed' : '',
                  ].join(' ')}
                        style={{
                    pointerEvents: isFilling ? 'none' : 'auto',
                        }}
                      />
                {!readOnly && !isReadOnly && isFocused && (
                        <div
                          className="absolute bottom-0 right-0 h-3 w-3 cursor-crosshair bg-blue-500 hover:bg-blue-600"
                          style={{
                            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                            transform: 'translate(1px, 1px)',
                          }}
                    onMouseDown={(e) => handleFillHandleMouseDown(e, row, col)}
                          title="Click and drag to fill cells with this value"
                        />
                      )}
                    </td>
                  )
                })}
        </tr>,
      )
    }

    return rowsToRender
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="flex flex-wrap gap-2 mb-3">
        {!readOnly && (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleOpenImportPanel}
              className="gap-2 flex-shrink-0 !opacity-100 !visible"
              style={{ opacity: 1, visibility: 'visible' }}
            >
              <Upload className="h-3 w-3" />
              Excel Load
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleExportAndClear}
              className="gap-2 flex-shrink-0 !opacity-100 !visible"
              style={{ opacity: 1, visibility: 'visible' }}
            >
              <Download className="h-3 w-3" />
              Export to Excel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleClearTable}
              className="gap-2 flex-shrink-0 !opacity-100 !visible"
              style={{ opacity: 1, visibility: 'visible' }}
            >
              <Trash2 className="h-3 w-3" />
              Clear table
            </Button>
          </>
        )}
      </div>

      <div className="inline-block overflow-auto rounded border border-slate-300 bg-white shadow-sm">
        <table className="border-collapse">
          <thead>{renderHeaders()}</thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>

      {/* Import Excel Panel */}
      {isImportPanelOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-white/80 z-40 transition-opacity duration-300"
            onClick={handleCloseImportPanel}
          />
          
          {/* Sliding Panel */}
          <div
            className="fixed right-0 top-0 h-full w-1/4 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out border-l border-slate-300"
            style={{
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-300">
              <h3 className="text-sm font-semibold text-slate-900">Import Excel</h3>
              <button
                onClick={handleCloseImportPanel}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-6 space-y-6">
              {/* Download Template Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Download Template
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadTemplate}
                  className="w-full gap-2 text-xs"
                  disabled={isUploading}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Download Template
                </Button>
              </div>

              {/* Upload Excel Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Upload Excel
                </h4>
                
                {/* File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload-input"
                  disabled={isUploading}
                />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-2 text-xs"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Select Excel File'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={startSimulatedUpload}
                  className="w-full gap-2 text-xs"
                  disabled={isUploading}
                >
                  <Sparkles className="h-4 w-4" />
                  Cargar datos demo
                </Button>

                {/* Progress Indicator */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Processing...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {showSuccessMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                    ✓ 20 filas cargadas exitosamente
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
