import { useAppContext } from '../../contexts/AppContext'
import { menuStructure } from '../../data/menu'
import type { MainModuleKey, SubmoduleKey } from '../../data/menu'

interface LeftPanelProps {
  width: number
}

export function LeftPanel({ width }: LeftPanelProps) {
  const {
    currentModule,
    setCurrentModule,
    currentSubmodule,
    setCurrentSubmodule,
    setSelectedItem,
  } = useAppContext()

  return (
    <aside
      className="flex h-full flex-col bg-slate-100 border-r border-slate-200 flex-shrink-0"
      style={{ width: `${width}px`, minWidth: '160px', maxWidth: '400px' }}
    >
      <div className="border-b border-slate-300 px-4 py-4">
        <h1 className="text-lg font-semibold text-slate-900">
          Biopharma Intl
        </h1>
        <p className="mt-1 text-xs text-slate-600">Data Entry System</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3" aria-label="Main menu">
        {(Object.keys(menuStructure) as MainModuleKey[]).map((moduleKey) => {
          const module = menuStructure[moduleKey]
          return (
            <div key={moduleKey} className="mb-2">
              <div className="mx-2 mb-1 px-2 py-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#3b82f6' }}>
                {module.label}
              </div>
              <div>
                {(Object.keys(module.submodules) as SubmoduleKey[]).map(
                  (subKey) => {
                    const sub = module.submodules[subKey]
                    if (!sub) return null
                    const active =
                      currentModule === moduleKey &&
                      currentSubmodule === subKey
                    return (
                      <button
                        key={subKey}
                        type="button"
                        onClick={() => {
                          setCurrentModule(moduleKey)
                          setCurrentSubmodule(subKey)
                          setSelectedItem(null)
                        }}
                        className={[
                          'flex w-full items-center gap-2 px-4 py-2 text-left text-xs transition-colors',
                          active
                            ? 'border-l-4 border-blue-500 bg-blue-100 text-slate-900 font-medium'
                            : 'hover:bg-slate-200 text-slate-700',
                        ].join(' ')}
                      >
                        <span>{sub.label}</span>
                      </button>
                    )
                  },
                )}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="border-t border-slate-300 px-4 py-3 text-[11px] text-slate-600">
        <p>Click to navigate.</p>
        <p className="mt-1">Layout: Light, 3-panel (responsive).</p>
      </div>
    </aside>
  )
}

