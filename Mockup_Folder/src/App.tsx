import { useMemo, useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Nextcell } from './components/nextcell/Nextcell'
import { PriceTypeSelector } from './components/common/PriceTypeSelector'
import {
  ExchangeRateTable,
  type ExchangeRateRow,
} from './components/common/ExchangeRateTable'
import {
  ProductAliasTable,
  type ProductAliasRow,
} from './components/common/ProductAliasTable'
import { getPowerBIConfig } from './lib/powerbi'
import { PowerBIEmbed } from './components/PowerBIEmbed'
import {
  countries,
  productGroups,
  productsFlat,
  companies,
  months,
  currencies,
} from './data/constants'
import { groupFunctions } from './data/users'
import { menuStructure } from './data/menu'
import { useAppContext } from './contexts/AppContext'
import { usePanelResize } from './hooks/usePanelResize'
import { useSelection } from './hooks/useSelection'
import { LeftPanel } from './components/layout/LeftPanel'
import { CenterPanel } from './components/layout/CenterPanel'

function App() {
  const {
    currentModule,
    currentSubmodule,
    selectedCountryName,
    selectedProductName,
    selectedGroupName,
    selectedUser,
    exchangeRates,
    setExchangeRates,
    selectedPriceTypes,
    setSelectedPriceTypes,
  } = useAppContext()

  const { selection: selectedCountries, toggle: handleCountryToggle } =
    useSelection<string>(new Set())

  const {
    leftPanelWidth,
    centerPanelWidth,
    setIsResizingLeft,
    setIsResizingCenter,
  } = usePanelResize()

  const [productAliases, setProductAliases] = useState<ProductAliasRow[]>([])

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

  const handleProductAliasChange = (
    id: string,
    field: 'alias',
    value: string,
  ) => {
    setProductAliases((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    )
  }

  // Initialize product aliases with all products when country is selected
  useEffect(() => {
    if (currentSubmodule === 'CountriesSetup' && selectedCountryName) {
      const initialAliases: ProductAliasRow[] = productsFlat.map((product, index) => ({
        id: `product-${index}`,
        product: product,
        alias: '',
      }))
      setProductAliases(initialAliases)
    } else if (!selectedCountryName && currentSubmodule === 'CountriesSetup') {
      setProductAliases([])
    }
  }, [currentSubmodule, selectedCountryName])

  const currentModuleConfig = menuStructure[currentModule]
  const currentSubmoduleConfig =
    currentModuleConfig.submodules[currentSubmodule]

  const hasCenter = currentSubmoduleConfig?.hasCenter ?? false
  const hasRight = currentSubmoduleConfig?.hasRight ?? false
  const isFullScreen = currentSubmoduleConfig?.isFullScreen ?? false

  const showCenter = hasCenter && currentSubmodule !== 'SalesData'

  const isPatients = currentSubmodule === 'PatientsNewsDropouts'
  const isSales = currentSubmodule === 'SalesData'
  const isMarket = currentSubmodule === 'MarketInsights'
  const isSalesTrends = currentSubmodule === 'SalesTrends'
  const isSalesAnalysis = currentSubmodule === 'SalesAnalysis'

  // Get Power BI configuration
  const powerBIConfig = useMemo(() => {
    return getPowerBIConfig()
  }, [])



  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex">
      {/* LEFT PANEL */}
      <LeftPanel width={leftPanelWidth} />

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
        <CenterPanel
          width={centerPanelWidth}
          onResizeStart={() => setIsResizingCenter(true)}
          showResizeHandle={hasRight}
        />
      )}

      {/* RIGHT PANEL */}
      {hasRight && !isFullScreen && (
        <section className="flex h-full flex-1 flex-col bg-white relative">
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex-1">
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
              <p className="text-[11px]" style={{ color: (!selectedCountryName && (isPatients || currentSubmodule === 'CountriesSetup')) || (!selectedProductName && isMarket) ? '#fb923c' : undefined }}>
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
            {currentSubmodule === 'CountriesSetup' && (
              <Button size="sm">Save changes</Button>
            )}
          </header>

          <div className="flex-1 overflow-auto p-4 text-xs">
            {isPatients && (
              <>
                {!selectedCountryName ? (
                  <div className="flex h-full items-center justify-center" style={{ color: '#fb923c' }}>
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
                  <div className="flex h-full items-center justify-center" style={{ color: '#fb923c' }}>
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
                <div className="flex h-full items-center justify-center" style={{ color: '#fb923c' }}>
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
                      <ProductAliasTable
                        aliases={productAliases}
                        onChange={handleProductAliasChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {currentSubmodule === 'Users' && (
              <>
                {!selectedGroupName && !selectedUser ? (
                  <div className="flex h-full items-center justify-center" style={{ color: '#fb923c' }}>
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
                <div className="flex h-full items-center justify-center" style={{ color: '#fb923c' }}>
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

