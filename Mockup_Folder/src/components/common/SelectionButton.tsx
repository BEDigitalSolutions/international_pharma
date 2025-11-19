import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface SelectionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean
  children: ReactNode
}

export function SelectionButton({
  isSelected = false,
  className,
  type = 'button',
  children,
  ...props
}: SelectionButtonProps) {
  const baseClasses =
    'mb-1 w-full rounded border px-3 py-2 text-left transition-colors'
  const stateClasses = isSelected
    ? 'border-blue-500 bg-blue-50'
    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'

  const combinedClassName = [baseClasses, stateClasses, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={combinedClassName} {...props}>
      {children}
    </button>
  )
}

