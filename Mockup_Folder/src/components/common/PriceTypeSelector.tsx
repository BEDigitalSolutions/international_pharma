interface PriceTypeSelectorProps {
  options: string[]
  selected: Set<string>
  onToggle: (option: string) => void
}

export function PriceTypeSelector({
  options,
  selected,
  onToggle,
}: PriceTypeSelectorProps) {
  return (
    <div className="rounded border border-slate-300 bg-white">
      <div className="max-h-48 overflow-y-auto p-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-slate-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.has(option)}
              onChange={() => onToggle(option)}
              className="h-3 w-3 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span className="text-xs text-slate-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

