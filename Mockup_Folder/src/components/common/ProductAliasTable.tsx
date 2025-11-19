export interface ProductAliasRow {
  id: string
  product: string
  alias: string
}

interface ProductAliasTableProps {
  aliases: ProductAliasRow[]
  onChange: (id: string, field: 'alias', value: string) => void
}

export function ProductAliasTable({
  aliases,
  onChange,
}: ProductAliasTableProps) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-slate-700">
        Product Aliases
      </label>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 text-[11px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 px-2 py-1 text-left font-semibold text-slate-700">
                Prod1
              </th>
              <th className="border border-slate-300 px-2 py-1 text-left font-semibold text-slate-700">
                AliasProd1
              </th>
            </tr>
          </thead>
          <tbody>
            {aliases.map((row) => (
              <tr key={row.id}>
                <td className="border border-slate-300 px-2 py-1 bg-slate-50 text-slate-700">
                  {row.product}
                </td>
                <td className="border border-slate-300 px-2 py-1">
                  <input
                    type="text"
                    value={row.alias}
                    onChange={(e) => onChange(row.id, 'alias', e.target.value)}
                    placeholder="AliasProd1"
                    className="w-full border-0 bg-transparent text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

