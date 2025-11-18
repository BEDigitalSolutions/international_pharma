import React, { useEffect, useRef, useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

type CellKey = string // "row-col"

export interface NextcellProps {
  rows?: number
  cols?: number
  colHeaders?: string[]
  rowHeaders?: string[]
  initialData?: Record<CellKey, string>
  onChange?: (data: Record<CellKey, string>) => void
  onExportCsv?: (csvText: string) => void
  readOnly?: boolean
}

interface CellPosition {
  row: number
  col: number
}

export function Nextcell({
  rows = 10,
  cols = 5,
  colHeaders,
  rowHeaders,
  initialData,
  onChange,
  onExportCsv,
  readOnly = false,
}: NextcellProps) {
  const [data, setData] = useState<Record<CellKey, string>>(initialData ?? {})
  const [selectedCells, setSelectedCells] = useState<Set<CellKey>>(new Set())
  const [focusedCell, setFocusedCell] = useState<CellPosition>({
    row: 0,
    col: 0,
  })
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<CellPosition | null>(
    null,
  )
  const [editingCell, setEditingCell] = useState<CellKey | null>(null)
  const [filledCells, setFilledCells] = useState<Set<CellKey>>(new Set())

  const inputRefs = useRef<Record<CellKey, HTMLInputElement | null>>({})
  const fillSourceValueRef = useRef<string>('')
  const isFillingRef = useRef<boolean>(false)

  const getCellKey = (row: number, col: number): CellKey => `${row}-${col}`

  const getCellValue = (row: number, col: number) =>
    data[getCellKey(row, col)] ?? ''

  const setCellValue = (row: number, col: number, value: string) => {
    const key = getCellKey(row, col)
    setData((prev) => {
      const next = { ...prev, [key]: value }
      return next
    })
  }

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
        next.add(getCellKey(r, c))
      }
    }
    setSelectedCells(next)
  }

  const moveFocus = (rowDelta: number, colDelta: number, extend = false) => {
    const newRow = Math.max(0, Math.min(rows - 1, focusedCell.row + rowDelta))
    const newCol = Math.max(0, Math.min(cols - 1, focusedCell.col + colDelta))

    if (editingCell) setEditingCell(null)

    if (extend && selectionStart) {
      selectRange(selectionStart, { row: newRow, col: newCol })
      setFocusedCell({ row: newRow, col: newCol })
    } else {
      if (extend) {
        setSelectionStart(focusedCell)
        selectRange(focusedCell, { row: newRow, col: newCol })
      } else {
        selectCell(newRow, newCol)
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
          setEditingCell(key)
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
        if (e.key.length === 1 && !isCtrl) {
          setEditingCell(key)
        }
    }
  }

  const handleCopy = () => {
    const selectedArray = Array.from(selectedCells).map((key) => {
      const [row, col] = key.split('-').map(Number)
      return { row, col, value: getCellValue(row, col) }
    })
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
        rowValues.push(getCellValue(row, col))
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
            setCellValue(row, col, firstValue)
          })
        } else {
          const lines = text.split('\n').filter((line) => line.length > 0)
          const { row: startRow, col: startCol } = focusedCell

          lines.forEach((line, rowOffset) => {
            const values = line.split('\t')
            values.forEach((value, colOffset) => {
              const targetRow = startRow + rowOffset
              const targetCol = startCol + colOffset
              if (targetRow < rows && targetCol < cols) {
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
        allCells.add(getCellKey(row, col))
      }
    }
    setSelectedCells(allCells)
  }

  const clearSelectedCells = () => {
    setData((prev) => {
      const next = { ...prev }
      selectedCells.forEach((key) => {
        delete next[key]
      })
      return next
    })
  }

  const handleMouseDown = (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLTableCellElement>,
  ) => {
    if (readOnly) return

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
      const cellKey = getCellKey(row, col)
      setCellValue(row, col, fillSourceValueRef.current)
      setFilledCells((prev) => new Set([...prev, cellKey]))
      setFocusedCell({ row, col })
    } else if (isSelecting && selectionStart && !isFillingRef.current) {
      selectRange(selectionStart, { row, col })
      setFocusedCell({ row, col })
    }
  }

  const handleMouseMove = (
    row: number,
    col: number,
    e?: React.MouseEvent<HTMLTableCellElement>,
  ) => {
    if (isFillingRef.current && fillSourceValueRef.current && e?.buttons === 1) {
      const cellKey = getCellKey(row, col)
      setCellValue(row, col, fillSourceValueRef.current)
      setFilledCells((prev) => new Set([...prev, cellKey]))
      setFocusedCell({ row, col })
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
    if (readOnly) return
    if (e.button !== 0) return

    e.preventDefault()
    e.stopPropagation()

    const sourceValue = getCellValue(row, col)
    fillSourceValueRef.current = sourceValue
    isFillingRef.current = true

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
        colIndex < cols
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
    const headers =
      colHeaders && colHeaders.length === cols
        ? colHeaders
        : Array.from({ length: cols }, (_, i) =>
            String.fromCharCode('A'.charCodeAt(0) + i),
          )

    csv += `,${headers.join(',')}\n`

    for (let row = 0; row < rows; row += 1) {
      const rowLabel =
        rowHeaders && rowHeaders[row] ? rowHeaders[row] : (row + 1).toString()
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

  const effectiveColHeaders =
    colHeaders && colHeaders.length === cols
      ? colHeaders
      : Array.from({ length: cols }, (_, i) =>
          String.fromCharCode('A'.charCodeAt(0) + i),
        )

  const effectiveRowHeader = (row: number) =>
    rowHeaders && rowHeaders[row] ? rowHeaders[row] : (row + 1).toString()

  return (
    <div className="space-y-3 text-xs">
      <div className="flex gap-2">
        {!readOnly && (
          <>
            <Button
              type="button"
              size="sm"
              onClick={handleExportAndClear}
              className="gap-2"
            >
              <Download className="h-3 w-3" />
              Export CSV &amp; Clear
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleClearTable}
              className="gap-2"
            >
              <Trash2 className="h-3 w-3" />
              Clear table
            </Button>
          </>
        )}
      </div>

      <div className="inline-block overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
        <table className="border-collapse">
          <thead>
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
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, row) => (
              <tr key={row}>
                <td className="h-8 w-10 border border-slate-300 bg-slate-50 text-center text-[11px] font-medium text-slate-600">
                  {effectiveRowHeader(row)}
                </td>
                {Array.from({ length: cols }, (_, col) => {
                  const cellKey = getCellKey(row, col)
                  const isSelected = isCellSelected(row, col)
                  const isFocused =
                    focusedCell.row === row && focusedCell.col === col
                  const isEditing = editingCell === cellKey

                  return (
                    <td
                      key={col}
                      className={[
                        'relative h-8 w-28 border border-slate-300 p-0',
                        isSelected ? 'bg-blue-50' : 'bg-white',
                        isFocused ? 'ring-2 ring-blue-500 ring-inset' : '',
                      ].join(' ')}
                      onMouseDown={(e) => handleMouseDown(row, col, e)}
                      onMouseEnter={(e) => handleMouseEnter(row, col, e)}
                      onMouseMove={(e) => handleMouseMove(row, col, e)}
                      onMouseUp={handleMouseUp}
                    >
                      <input
                        ref={(el) => {
                          inputRefs.current[cellKey] = el
                        }}
                        type="text"
                        value={getCellValue(row, col)}
                        readOnly={readOnly || !isEditing}
                        onChange={(e) =>
                          setCellValue(row, col, e.target.value)
                        }
                        onFocus={() => {
                          setFocusedCell({ row, col })
                          if (!isSelected) selectCell(row, col)
                        }}
                        onDoubleClick={() =>
                          !readOnly && setEditingCell(cellKey)
                        }
                        onKeyDown={(e) => handleKeyDown(e, row, col)}
                        className="h-full w-full bg-transparent px-2 text-[11px] outline-none"
                        style={{
                          pointerEvents: isFillingRef.current ? 'none' : 'auto',
                        }}
                      />
                      {!readOnly && isFocused && (
                        <div
                          className="absolute bottom-0 right-0 h-3 w-3 cursor-crosshair bg-blue-500 hover:bg-blue-600"
                          style={{
                            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                            transform: 'translate(1px, 1px)',
                          }}
                          onMouseDown={(e) =>
                            handleFillHandleMouseDown(e, row, col)
                          }
                          title="Click and drag to fill cells with this value"
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


