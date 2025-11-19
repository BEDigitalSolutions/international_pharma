import { Button } from '../ui/button'
import { SelectionButton } from '../common/SelectionButton'
import { useAppContext } from '../../contexts/AppContext'
import { patientsCountries, countriesByContinent, productsFlat } from '../../data/constants'
import { groups, users } from '../../data/users'

interface CenterPanelProps {
  width: number
  onResizeStart: () => void
  showResizeHandle?: boolean
}

export function CenterPanel({ width, onResizeStart, showResizeHandle = true }: CenterPanelProps) {
  const {
    currentSubmodule,
    selectedCountryName,
    selectedProductName,
    selectedGroupName,
    selectedContinent,
    setSelectedContinent,
    setSelectedItem,
    usersTab,
    setUsersTab,
    selectedUser,
  } = useAppContext()

  const handleSelectCountry = (country: string) =>
    setSelectedItem({ type: 'country', value: country })

  const handleSelectProduct = (product: string) =>
    setSelectedItem({ type: 'product', value: product })

  const handleSelectGroup = (group: string) =>
    setSelectedItem({ type: 'group', value: group })

  const handleSelectUser = (userId: number) =>
    setSelectedItem({ type: 'user', value: userId })

  return (
    <>
      <main
        className="flex h-full flex-col border-x border-slate-200 bg-white"
        style={{ width: `${width}px`, minWidth: '260px', maxWidth: '800px' }}
      >
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <h2 className="text-xs font-semibold text-slate-800">
              {currentSubmodule === 'PatientsNewsDropouts' && 'Countries'}
              {currentSubmodule === 'MarketInsights' && 'Products'}
              {currentSubmodule === 'CountriesSetup' && 'Countries'}
              {currentSubmodule === 'Users' && 'Users & Groups'}
              {currentSubmodule === 'ProcessVisibility' && 'Process Visibility'}
              {currentSubmodule === 'ProductsFamilies' && 'Products/Families'}
              {currentSubmodule === 'Scenarios' && 'Scenarios'}
            </h2>
            <p className="text-[11px]" style={{ color: currentSubmodule === 'ProcessVisibility' ? '#fb923c' : undefined }}>
              {currentSubmodule === 'PatientsNewsDropouts' &&
                'Select a country to edit patient data.'}
              {currentSubmodule === 'MarketInsights' &&
                'Select a product to view market insights.'}
              {currentSubmodule === 'CountriesSetup' &&
                'Select a country to configure.'}
              {currentSubmodule === 'Users' &&
                'Manage users, groups and assignments.'}
              {currentSubmodule === 'ProcessVisibility' &&
                'Not yet defined - placeholder.'}
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-3 text-xs">
          {currentSubmodule === 'PatientsNewsDropouts' && (
            <div className="space-y-1">
              {patientsCountries.map((c) => (
                <SelectionButton
                  key={c}
                  isSelected={selectedCountryName === c}
                  onClick={() => handleSelectCountry(c)}
                >
                  {c}
                </SelectionButton>
              ))}
            </div>
          )}

          {currentSubmodule === 'MarketInsights' && (
            <div className="space-y-1">
              {productsFlat.map((p) => (
                <SelectionButton
                  key={p}
                  isSelected={selectedProductName === p}
                  onClick={() => handleSelectProduct(p)}
                >
                  {p}
                </SelectionButton>
              ))}
            </div>
          )}

          {currentSubmodule === 'CountriesSetup' && (
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Select Continent
                </label>
                <select
                  value={selectedContinent}
                  onChange={(e) => {
                    setSelectedContinent(e.target.value)
                    setSelectedItem(null)
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Select Continent --</option>
                  {Object.keys(countriesByContinent).map((continent) => (
                    <option key={continent} value={continent}>
                      {continent}
                    </option>
                  ))}
                </select>
              </div>
              {selectedContinent && (
                <div className="space-y-1">
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Countries in {selectedContinent}
                  </label>
                  {countriesByContinent[selectedContinent]?.map((c) => (
                    <SelectionButton
                      key={c}
                      isSelected={selectedCountryName === c}
                      onClick={() => handleSelectCountry(c)}
                    >
                      {c}
                    </SelectionButton>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentSubmodule === 'Users' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button size="sm">New ADGroup or User</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  Delete
                </Button>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="mb-2 flex border-b border-slate-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUsersTab('groups')}
                    className={[
                      'px-3 py-1',
                      usersTab === 'groups'
                        ? 'border-b-2 border-blue-500 font-semibold text-slate-800'
                        : 'text-slate-500',
                    ].join(' ')}
                  >
                    Groups
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsersTab('users')}
                    className={[
                      'px-3 py-1',
                      usersTab === 'users'
                        ? 'border-b-2 border-blue-500 font-semibold text-slate-800'
                        : 'text-slate-500',
                    ].join(' ')}
                  >
                    Users
                  </button>
                </div>
                <div className="space-y-1">
                  {usersTab === 'groups' &&
                    groups.map((g) => (
                      <SelectionButton
                        key={g}
                        isSelected={selectedGroupName === g}
                        onClick={() => handleSelectGroup(g)}
                      >
                        {g}
                      </SelectionButton>
                    ))}
                  {usersTab === 'users' &&
                    users.map((u) => (
                      <SelectionButton
                        key={u.id}
                        isSelected={selectedUser?.id === u.id}
                        onClick={() => handleSelectUser(u.id)}
                      >
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {u.email}
                        </div>
                      </SelectionButton>
                    ))}
                </div>
              </div>
            </div>
          )}

          {currentSubmodule === 'ProcessVisibility' && (
            <div className="flex h-full items-center justify-center" style={{ color: '#fb923c' }}>
              Not yet defined – placeholder
            </div>
          )}

          {(currentSubmodule === 'ProductsFamilies' ||
            currentSubmodule === 'Scenarios') && (
            <div className="flex h-full items-center justify-center" style={{ color: '#fb923c' }}>
              Not yet defined – placeholder
            </div>
          )}
        </div>
      </main>

      {showResizeHandle && (
        <div
          className="w-1 cursor-col-resize bg-slate-300 hover:bg-blue-500 transition-colors"
          onMouseDown={onResizeStart}
          style={{ cursor: 'col-resize' }}
        />
      )}
    </>
  )
}

