import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none'

  const variants: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline:
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  }

  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}



