export interface ExchangeRateRow {
  id: string
  contravalor: string
  fechaInicial: string
  fechaFinal: string
}

interface ExchangeRateTableProps {
  title?: string
  rows: ExchangeRateRow[]
  onChange: (index: number, field: keyof ExchangeRateRow, value: string) => void
  onRemove: (index: number) => void
  onAdd: () => void
  allowRemove?: boolean
}

export function ExchangeRateTable({
  title = 'Tipo de cambio €',
  rows,
  onChange,
  onRemove,
  onAdd,
  allowRemove = true,
}: ExchangeRateTableProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-800">{title}</h3>
      <div className="overflow-x-auto rounded border border-slate-300">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
                Contravalor
              </th>
              <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
                Fecha inicial
              </th>
              <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
                Fecha Final
              </th>
              <th className="border border-slate-300 px-3 py-2 text-center font-semibold text-slate-700 w-20">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border border-slate-300 p-0">
                  <input
                    type="text"
                    value={row.contravalor}
                    onChange={(e) => onChange(index, 'contravalor', e.target.value)}
                    className="h-8 w-full border-0 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Contravalor"
                  />
                </td>
                <td className="border border-slate-300 p-0">
                  <input
                    type="date"
                    value={row.fechaInicial}
                    onChange={(e) => onChange(index, 'fechaInicial', e.target.value)}
                    className="h-8 w-full border-0 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="DD/MM/YYYY"
                  />
                </td>
                <td className="border border-slate-300 p-0">
                  <input
                    type="date"
                    value={row.fechaFinal}
                    onChange={(e) => onChange(index, 'fechaFinal', e.target.value)}
                    className="h-8 w-full border-0 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="DD/MM/YYYY"
                  />
                </td>
                <td className="border border-slate-300 p-1 text-center">
                  {allowRemove && rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      title="Eliminar fila"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-300 bg-slate-50 px-3 py-2">
          <button
            type="button"
            onClick={onAdd}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            + Agregar fila
          </button>
        </div>
      </div>
    </div>
  )
}

