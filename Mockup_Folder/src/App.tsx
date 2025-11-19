import { useMemo, useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Nextcell } from './components/nextcell/Nextcell'
import { SelectionButton } from './components/common/SelectionButton'
import { PriceTypeSelector } from './components/common/PriceTypeSelector'
import {
  ExchangeRateTable,
  type ExchangeRateRow,
} from './components/common/ExchangeRateTable'
import { getPowerBIConfig } from './lib/powerbi'
import { PowerBIEmbed } from './components/PowerBIEmbed'
import {
  countries,
  patientsCountries,
  countriesByContinent,
  productGroups,
  productsFlat,
  companies,
  months,
  currencies,
} from './data/constants'
import { groups, groupFunctions, users } from './data/users'
import { menuStructure } from './data/menu'
import type { MainModuleKey, SubmoduleKey } from './data/menu'

type UsersTab = 'groups' | 'users'

type SelectedItem =
  | { type: 'country'; value: string }
  | { type: 'product'; value: string }
  | { type: 'group'; value: string }
  | { type: 'user'; value: number }
  | null

function App() {
  const [currentModule, setCurrentModule] = useState<MainModuleKey>('DataEntry')
  const [currentSubmodule, setCurrentSubmodule] =
    useState<SubmoduleKey>('PatientsNewsDropouts')
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null)
  const [usersTab, setUsersTab] = useState<UsersTab>('groups')
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  )
  const [selectedContinent, setSelectedContinent] = useState<string>('')
  const [leftPanelWidth, setLeftPanelWidth] = useState(200)
  const [centerPanelWidth, setCenterPanelWidth] = useState(400)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingCenter, setIsResizingCenter] = useState(false)
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateRow[]>([
    { id: '1', contravalor: '', fechaInicial: '', fechaFinal: '' },
  ])
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<Set<string>>(
    new Set(),
  )

  const priceTypes = ['ASP', 'Maquila', 'Ex-Factory']

  const handlePriceTypeToggle = (priceType: string) => {
    setSelectedPriceTypes((prev) => {
      const next = new Set(prev)
      if (next.has(priceType)) {
        next.delete(priceType)
      } else {
        next.add(priceType)
      }
      return next
    })
  }

  const handleExchangeRateChange = (
    index: number,
    field: keyof ExchangeRateRow,
    value: string,
  ) => {
    setExchangeRates((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleExchangeRateRemove = (index: number) => {
    setExchangeRates((prev) => prev.filter((_, i) => i !== index))
  }

  const handleExchangeRateAdd = () => {
    setExchangeRates((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        contravalor: '',
        fechaInicial: '',
        fechaFinal: '',
      },
    ])
  }

  const currentModuleConfig = menuStructure[currentModule]
  const currentSubmoduleConfig =
    currentModuleConfig.submodules[currentSubmodule]

  const hasCenter = currentSubmoduleConfig?.hasCenter ?? false
  const hasRight = currentSubmoduleConfig?.hasRight ?? false
  const isFullScreen = currentSubmoduleConfig?.isFullScreen ?? false

  const showCenter = hasCenter && currentSubmodule !== 'SalesData'

  const handleSelectCountry = (country: string) =>
    setSelectedItem({ type: 'country', value: country })

  const handleSelectProduct = (product: string) =>
    setSelectedItem({ type: 'product', value: product })

  const handleSelectGroup = (group: string) =>
    setSelectedItem({ type: 'group', value: group })

  const handleSelectUser = (userId: number) =>
    setSelectedItem({ type: 'user', value: userId })

  const selectedCountryName =
    selectedItem?.type === 'country' ? selectedItem.value : null
  const selectedProductName =
    selectedItem?.type === 'product' ? selectedItem.value : null

  const selectedGroupName =
    selectedItem?.type === 'group' ? selectedItem.value : null
  const selectedUser = useMemo(
    () =>
      selectedItem?.type === 'user'
        ? users.find((u) => u.id === selectedItem.value) ?? null
        : null,
    [selectedItem],
  )

  const isPatients = currentSubmodule === 'PatientsNewsDropouts'
  const isSales = currentSubmodule === 'SalesData'
  const isMarket = currentSubmodule === 'MarketInsights'
  const isSalesTrends = currentSubmodule === 'SalesTrends'
  const isSalesAnalysis = currentSubmodule === 'SalesAnalysis'

  // Get Power BI configuration
  const powerBIConfig = useMemo(() => {
    const config = getPowerBIConfig()
    // Log configuration for debugging (remove in production)
    if (import.meta.env.DEV) {
      console.log('Power BI Configuration:', {
        workspace: config.workspace,
        salesTrends: config.salesTrends,
        salesAnalysis: config.salesAnalysis,
      })
    }
    return config
  }, [])

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) => {
      const next = new Set(prev)
      if (next.has(country)) {
        next.delete(country)
      } else {
        next.add(country)
      }
      return next
    })
  }

  // Panel resizing handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(160, Math.min(400, e.clientX))
        setLeftPanelWidth(newWidth)
      }
      if (isResizingCenter) {
        const newWidth = Math.max(260, Math.min(800, e.clientX - leftPanelWidth))
        setCenterPanelWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
      setIsResizingCenter(false)
    }

    if (isResizingLeft || isResizingCenter) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizingLeft, isResizingCenter, leftPanelWidth])



  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex">
      {/* LEFT PANEL */}
      <aside
        className="flex h-full flex-col bg-slate-100 border-r border-slate-200"
        style={{ width: `${leftPanelWidth}px`, minWidth: '160px', maxWidth: '400px' }}
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
                <div className="mx-2 mb-1 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-800">
                  {module.label}
                </div>
                <div>
                  {(Object.keys(
                    module.submodules,
                  ) as SubmoduleKey[]).map((subKey) => {
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
                  })}
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

      {/* LEFT PANEL RESIZE HANDLE */}
      {!isFullScreen && (
        <div
          className="w-1 cursor-col-resize bg-slate-300 hover:bg-blue-500 transition-colors"
          onMouseDown={() => setIsResizingLeft(true)}
          style={{ cursor: 'col-resize' }}
        />
      )}

      {/* FULL SCREEN POWER BI EMBEDDED FOR REPORTS */}
      {isFullScreen && (
        <section className="flex h-full flex-1 flex-col bg-white">
          {isSalesTrends && (
            <PowerBIEmbed
              reportConfig={powerBIConfig.salesTrends}
              title="Sales Trends Report"
            />
          )}
          {isSalesAnalysis && (
            <PowerBIEmbed
              reportConfig={powerBIConfig.salesAnalysis}
              title="Sales Analysis Report"
            />
          )}
        </section>
      )}

      {/* CENTER PANEL */}
      {showCenter && !isFullScreen && (
        <>
          <main
            className="flex h-full flex-col border-x border-slate-200 bg-white"
            style={{ width: `${centerPanelWidth}px`, minWidth: '260px', maxWidth: '800px' }}
          >
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <h2 className="text-xs font-semibold text-slate-800">
                {currentSubmodule === 'PatientsNewsDropouts' && 'Countries'}
                {currentSubmodule === 'MarketInsights' && 'Products'}
                {currentSubmodule === 'CountriesSetup' && 'Countries'}
                {currentSubmodule === 'Users' && 'Users & Groups'}
                {currentSubmodule === 'ProcessVisibility' &&
                  'Process Visibility'}
                {currentSubmodule === 'ProductsFamilies' &&
                  'Products/Families'}
                {currentSubmodule === 'Scenarios' && 'Scenarios'}
              </h2>
              <p className="text-[11px] text-slate-500">
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
                      setSelectedItem(null) // Clear country selection when continent changes
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
              <div className="flex h-full items-center justify-center text-slate-400">
                Not yet defined – placeholder
              </div>
            )}

            {(currentSubmodule === 'ProductsFamilies' ||
              currentSubmodule === 'Scenarios') && (
              <div className="flex h-full items-center justify-center text-slate-400">
                Not yet defined – placeholder
              </div>
            )}
          </div>
        </main>

        {/* CENTER PANEL RESIZE HANDLE */}
        {hasRight && (
          <div
            className="w-1 cursor-col-resize bg-slate-300 hover:bg-blue-500 transition-colors"
            onMouseDown={() => setIsResizingCenter(true)}
            style={{ cursor: 'col-resize' }}
          />
        )}
        </>
      )}

      {/* RIGHT PANEL */}
      {hasRight && !isFullScreen && (
        <section className="flex h-full flex-1 flex-col bg-white">
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <h2 className="text-xs font-semibold text-slate-800">
                {isPatients && 'Patients News/Dropouts'}
                {isSales && 'Sales Data'}
                {isMarket && 'Market Insights'}
                {currentSubmodule === 'CountriesSetup' &&
                  'Countries setup - Country configuration'}
                {currentSubmodule === 'Users' && 'Users / Groups assignment'}
                {currentSubmodule === 'ProcessVisibility' &&
                  'Process Visibility'}
                {currentSubmodule === 'ProductsFamilies' &&
                  'Products/Families'}
                {currentSubmodule === 'Scenarios' && 'Scenarios'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isPatients &&
                  (selectedCountryName
                    ? `Edit patient data for ${selectedCountryName} by product and month.`
                    : 'Select a country in the center panel.')}
                {isSales &&
                  'Edit sales data by product group, product and month.'}
                {isMarket &&
                  (selectedProductName
                    ? `Edit market data for ${selectedProductName} by company.`
                    : 'Select a product in the center panel.')}
                {currentSubmodule === 'CountriesSetup' &&
                  (selectedCountryName
                    ? `Configure settings for ${selectedCountryName}.`
                    : 'Select a country in the center panel.')}
                {currentSubmodule === 'Users' &&
                  (selectedGroupName || selectedUser
                    ? 'Assign countries and functions.'
                    : 'Select a group or user in the center panel.')}
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 text-xs">
            {isPatients && (
              <>
                {!selectedCountryName ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Select a country first.
                  </div>
                ) : (
                  <>
                    <Nextcell
                      hierarchicalColumns={months.map((month) => ({
                        main: month,
                        sub: ['Patients', 'Dose', 'Vol.'],
                      }))}
                      hierarchicalRows={productGroups.map((group) => ({
                        group: group.name,
                        items: group.products,
                      }))}
                      calculatedColumns={[
                        {
                          index: (colIndex: number) => {
                            // Vol. columns are every 3rd column starting from index 2 (0-indexed: 2, 5, 8, ...)
                            // In hierarchical structure: Patients=0, Dose=1, Vol.=2 for each month
                            const subIndex = colIndex % 3
                            return subIndex === 2 // Vol. is the 3rd sub-column (index 2)
                          },
                          formula: (rowData, _allRowsData, _rowIndex, colIndex) => {
                            // Get Patients and Dose for this month
                            const monthIndex = Math.floor((colIndex ?? 0) / 3)
                            const patientsIndex = monthIndex * 3 + 0
                            const doseIndex = monthIndex * 3 + 1
                            const patients = parseFloat(rowData[patientsIndex] || '0')
                            const dose = parseFloat(rowData[doseIndex] || '0')
                            
                            if (patients === 0 || dose === 0 || isNaN(patients) || isNaN(dose)) {
                              return ''
                            }
                            
                            return (patients * dose).toFixed(2)
                          },
                        },
                      ]}
                      readOnlyColumns={(colIndex: number) => {
                        // Vol. columns are read-only (calculated)
                        const subIndex = colIndex % 3
                        return subIndex === 2
                      }}
                    />
                    <div className="mt-3 text-[10px] text-slate-500 space-y-1">
                      <p><strong>Keyboard navigation:</strong> Arrow keys, Tab, Enter | <strong>Selection:</strong> Click + Shift/Ctrl for multi-select</p>
                      <p><strong>Copy/Paste:</strong> Ctrl+C / Ctrl+V (Excel compatible) | <strong>Fill handle:</strong> Drag blue corner to replicate values</p>
                    </div>
                  </>
                )}
              </>
            )}

            {isSales && (
              <>
                <Nextcell
                  hierarchicalColumns={months.map((month) => ({
                    main: month,
                    sub: ['Vol.', 'Price', 'Turnover'],
                  }))}
                  hierarchicalRows={productGroups.map((group) => ({
                    group: group.name,
                    items: group.products,
                  }))}
                  calculatedColumns={[
                    {
                      index: (colIndex: number) => {
                        // Turnover columns are every 3rd column starting from index 2 (0-indexed: 2, 5, 8, ...)
                        // In hierarchical structure: Vol.=0, Price=1, Turnover=2 for each month
                        const subIndex = colIndex % 3
                        return subIndex === 2 // Turnover is the 3rd sub-column (index 2)
                      },
                      formula: (rowData, _allRowsData, _rowIndex, colIndex) => {
                        // Get Vol. and Price for this month
                        const monthIndex = Math.floor((colIndex ?? 0) / 3)
                        const volIndex = monthIndex * 3 + 0
                        const priceIndex = monthIndex * 3 + 1
                        const vol = parseFloat(rowData[volIndex] || '0')
                        const price = parseFloat(rowData[priceIndex] || '0')
                        
                        if (vol === 0 || price === 0 || isNaN(vol) || isNaN(price)) {
                          return ''
                        }
                        
                        return (vol * price).toFixed(2)
                      },
                    },
                  ]}
                  readOnlyColumns={(colIndex: number) => {
                    // Turnover columns are read-only
                    const subIndex = colIndex % 3
                    return subIndex === 2
                  }}
                />
                <div className="mt-3 text-[10px] text-slate-500 space-y-1">
                  <p><strong>Keyboard navigation:</strong> Arrow keys, Tab, Enter | <strong>Selection:</strong> Click + Shift/Ctrl for multi-select</p>
                  <p><strong>Copy/Paste:</strong> Ctrl+C / Ctrl+V (Excel compatible) | <strong>Fill handle:</strong> Drag blue corner to replicate values</p>
                </div>
              </>
            )}

            {isMarket && (
              <>
                {!selectedProductName ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Select a product first.
                  </div>
                ) : (
                  <>
                    <Nextcell
                      rows={companies.length}
                      cols={4}
                      colHeaders={[
                        'Units',
                        'ASP $/vial',
                        'Market Sales',
                        'MarketShare',
                      ]}
                      rowHeaders={companies}
                      readOnlyColumns={[2, 3]}
                      calculatedColumns={[
                        {
                          index: 2,
                          formula: (rowData) => {
                            // Calculate: Market Sales = Units * ASP $/vial
                            const unitsCol = 0 // Units is column index 0
                            const aspCol = 1 // ASP $/vial is column index 1
                            const units = parseFloat(rowData[unitsCol] || '0')
                            const asp = parseFloat(rowData[aspCol] || '0')
                            
                            if (units === 0 || asp === 0 || isNaN(units) || isNaN(asp)) {
                              return ''
                            }
                            
                            // Market Sales = Units * ASP $/vial
                            const result = units * asp
                            return result.toFixed(2)
                          },
                        },
                        {
                          index: 3,
                          formula: (rowData, allRowsData) => {
                            // Calculate: Market Share = Market Sales / Total Market Sales
                            // First, calculate Market Sales for current row: Units * ASP $/vial
                            const unitsCol = 0 // Units is column index 0
                            const aspCol = 1 // ASP $/vial is column index 1
                            const units = parseFloat(rowData[unitsCol] || '0')
                            const asp = parseFloat(rowData[aspCol] || '0')
                            
                            let currentMarketSales = 0
                            if (units !== 0 && asp !== 0 && !isNaN(units) && !isNaN(asp)) {
                              currentMarketSales = units * asp
                            }
                            
                            // Calculate Market Sales for all rows and sum them
                            const totalMarketSales = allRowsData.reduce((sum, r) => {
                              const rUnits = parseFloat(r[unitsCol] || '0')
                              const rAsp = parseFloat(r[aspCol] || '0')
                              if (rUnits !== 0 && rAsp !== 0 && !isNaN(rUnits) && !isNaN(rAsp)) {
                                return sum + (rUnits * rAsp)
                              }
                              return sum
                            }, 0)
                            
                            if (totalMarketSales === 0) return '0.0%'
                            
                            const percentage = (currentMarketSales / totalMarketSales) * 100
                            return `${percentage.toFixed(1)}%`
                          },
                        },
                      ]}
                    />
                    <div className="mt-3 text-[10px] text-slate-500 space-y-1">
                      <p><strong>Keyboard navigation:</strong> Arrow keys, Tab, Enter | <strong>Selection:</strong> Click + Shift/Ctrl for multi-select</p>
                      <p><strong>Copy/Paste:</strong> Ctrl+C / Ctrl+V (Excel compatible) | <strong>Fill handle:</strong> Drag blue corner to replicate values</p>
                    </div>
                  </>
                )}
              </>
            )}

            {currentSubmodule === 'CountriesSetup' && (
              <>
                {!selectedCountryName ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Select a country in the center panel.
                  </div>
                ) : (
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                        Currency
                      </label>
                      <select className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none">
                        {currencies.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                        Prices Types
                      </label>
                      <PriceTypeSelector
                        options={priceTypes}
                        selected={selectedPriceTypes}
                        onToggle={handlePriceTypeToggle}
                      />
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <ExchangeRateTable
                        rows={exchangeRates}
                        onChange={handleExchangeRateChange}
                        onRemove={handleExchangeRateRemove}
                        onAdd={handleExchangeRateAdd}
                      />
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <Button size="md">Save changes</Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {currentSubmodule === 'Users' && (
              <>
                {!selectedGroupName && !selectedUser ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Select a group or user in the center panel.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                          Cumulative Selected countries
                        </label>
                        <div className="h-48 w-full overflow-y-auto rounded border border-slate-300 bg-white p-2">
                          {countries.map((c) => (
                            <label
                              key={c}
                              className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedCountries.has(c)}
                                onChange={() => handleCountryToggle(c)}
                                className="h-3 w-3 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-xs text-slate-700">{c}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                          Cumulative Selected Functions
                        </label>
                        <div className="h-48 w-full overflow-y-auto rounded border border-slate-300 bg-white p-2">
                          {(selectedGroupName
                            ? groupFunctions[selectedGroupName] || []
                            : selectedUser
                              ? groupFunctions[selectedUser.group] || []
                              : []
                          ).map((func) => (
                            <div
                              key={func}
                              className="px-2 py-1 text-xs text-slate-700"
                            >
                              {func}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <Button size="md">Save changes</Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {(currentSubmodule === 'ProcessVisibility' ||
              currentSubmodule === 'ProductsFamilies' ||
              currentSubmodule === 'Scenarios') && (
                <div className="flex h-full items-center justify-center text-slate-400">
                  Not yet defined – placeholder
                </div>
              )}
          </div>
        </section>
      )}
    </div>
  )
}


export default App

