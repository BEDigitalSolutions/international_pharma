import { useState, useCallback } from 'react'

export function useSelection<T>(initialSelection: Set<T> = new Set()) {
  const [selection, setSelection] = useState<Set<T>>(initialSelection)

  const toggle = useCallback((item: T) => {
    setSelection((prev) => {
      const next = new Set(prev)
      if (next.has(item)) {
        next.delete(item)
      } else {
        next.add(item)
      }
      return next
    })
  }, [])

  const add = useCallback((item: T) => {
    setSelection((prev) => new Set(prev).add(item))
  }, [])

  const remove = useCallback((item: T) => {
    setSelection((prev) => {
      const next = new Set(prev)
      next.delete(item)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setSelection(new Set())
  }, [])

  const has = useCallback(
    (item: T) => {
      return selection.has(item)
    },
    [selection],
  )

  return {
    selection,
    toggle,
    add,
    remove,
    clear,
    has,
    setSelection,
  }
}

