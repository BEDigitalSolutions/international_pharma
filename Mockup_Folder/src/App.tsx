import { useMemo, useState } from 'react'
import { Button } from './components/ui/button'
import { Nextcell } from './components/nextcell/Nextcell'

type MainModuleKey = 'DataEntry' | 'MasterData' | 'Supervisor'
type SubmoduleKey =
  | 'ProcessVisibility'
  | 'PatientsNewsDropouts'
  | 'SalesData'
  | 'MarketInsights'
  | 'ExcelDemo'
  | 'CountriesSetup'
  | 'ProductsFamilies'
  | 'Pricing'
  | 'Users'
  | 'Scenarios'

type UsersTab = 'groups' | 'users'

const countries = [
  'Spain',
  'France',
  'Germany',
  'Italy',
  'United Kingdom',
  'Portugal',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Greece',
  'Romania',
  'Bulgaria',
  'United States',
  'Canada',
  'Mexico',
  'Brazil',
  'Argentina',
  'Chile',
]

const productGroups = [
  {
    name: 'Grup1',
    products: ['Prod 1.1', 'Prod 1.2'],
  },
  {
    name: 'Grup2',
    products: ['Prod 2.1', 'Prod 2.2', 'Prod 2.3'],
  },
  {
    name: 'Grup3',
    products: ['Prod 3.1', 'Prod 3.2'],
  },
]

const productsFlat = [
  'Albumin 20%',
  'Albumin 25%',
  'IVIG',
  'Factor VIII',
  'Factor IX',
  'Fibrinogen',
  'Prothrombin Complex',
  'Antithrombin III',
]

const companies = [
  'Grifols',
  'CSL Behring',
  'Octapharma',
  'Takeda',
  'Baxalta',
  'Kedrion',
  'LFB',
  'Bio Products Laboratory',
]

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@grifols.com',
    group: 'Data Entry Managers',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria.garcia@grifols.com',
    group: 'Data Entry Managers',
  },
  {
    id: 3,
    name: 'Pierre Dubois',
    email: 'pierre.dubois@grifols.com',
    group: 'Country Users',
  },
  {
    id: 4,
    name: 'Anna Müller',
    email: 'anna.muller@grifols.com',
    group: 'Country Users',
  },
  {
    id: 5,
    name: 'David Johnson',
    email: 'david.johnson@grifols.com',
    group: 'Supervisors',
  },
]

const groups = [
  'Data Entry Managers',
  'Country Users',
  'Supervisors',
  'Read-Only Users',
]

const currencies = [
  '€ (EUR)',
  '$ (USD)',
  '£ (GBP)',
  '¥ (JPY)',
  'Peso (MXN)',
  'Real (BRL)',
  'Yuan (CNY)',
]

const menuStructure: Record<
  MainModuleKey,
  {
    label: string
    submodules: Partial<
      Record<
        SubmoduleKey,
        {
          label: string
          hasCenter: boolean
          hasRight: boolean
        }
      >
    >
  }
> = {
  DataEntry: {
    label: 'Data Entry',
    submodules: {
      ProcessVisibility: {
        label: 'Process Visibility',
        hasCenter: true,
        hasRight: true,
      },
      PatientsNewsDropouts: {
        label: 'Patients News/Dropouts',
        hasCenter: true,
        hasRight: true,
      },
      SalesData: {
        label: 'Sales Data',
        hasCenter: false,
        hasRight: true,
      },
      ExcelDemo: {
        label: 'Excel Demo',
        hasCenter: false,
        hasRight: true,
      },
      MarketInsights: {
        label: 'Market Insights',
        hasCenter: true,
        hasRight: true,
      },
    },
  },
  MasterData: {
    label: 'Master Data',
    submodules: {
      CountriesSetup: {
        label: 'Countries setup',
        hasCenter: true,
        hasRight: true,
      },
      ProductsFamilies: {
        label: 'Products/Families',
        hasCenter: true,
        hasRight: true,
      },
      Pricing: {
        label: 'Pricing',
        hasCenter: true,
        hasRight: true,
      },
    },
  },
  Supervisor: {
    label: 'Supervisor',
    submodules: {
      Users: {
        label: 'Users',
        hasCenter: true,
        hasRight: true,
      },
      Scenarios: {
        label: 'Scenarios',
        hasCenter: true,
        hasRight: true,
      },
    },
  },
}

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

  const currentModuleConfig = menuStructure[currentModule]
  const currentSubmoduleConfig =
    currentModuleConfig.submodules[currentSubmodule]

  const hasCenter = currentSubmoduleConfig?.hasCenter ?? false
  const hasRight = currentSubmoduleConfig?.hasRight ?? false

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
  const isExcelDemo = currentSubmodule === 'ExcelDemo'

function PatientsMatrix() {
  const subCols = ['Patients', 'Dose', 'Vol.']

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-2 py-2 text-left align-bottom">
              Product groups / products
            </th>
            {months.map((month) => (
              <th
                key={month}
                className="border border-slate-300 px-2 py-1 text-center align-bottom"
                colSpan={subCols.length}
              >
                {month}
              </th>
            ))}
          </tr>
          <tr className="bg-slate-50">
            <th className="border border-slate-300 px-2 py-1 text-left" />
            {months.map((month) =>
              subCols.map((col) => (
                <th
                  key={`${month}-${col}`}
                  className="border border-slate-300 px-2 py-1 text-center text-[10px]"
                >
                  {col}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody>
          {productGroups.map((group) => (
            <GroupRows key={group.name} groupName={group.name}>
              {group.products.map((p) => (
                <ProductRow key={p} productName={p} subCols={subCols} />
              ))}
            </GroupRows>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GroupRows({
  groupName,
  children,
}: {
  groupName: string
  children: React.ReactNode
}) {
  return (
    <>
      <tr className="bg-slate-50">
        <td
          className="border border-slate-300 px-2 py-2 font-semibold"
          colSpan={1 + months.length * 3}
        >
          {groupName}
        </td>
      </tr>
      {children}
    </>
  )
}

function ProductRow({
  productName,
  subCols,
}: {
  productName: string
  subCols: string[]
}) {
  return (
    <tr>
      <td className="border border-slate-300 px-2 py-2">{productName}</td>
      {months.map((month) =>
        subCols.map((col) => (
          <td
            key={`${productName}-${month}-${col}`}
            className="border border-slate-300 px-1 py-1 text-center align-middle"
          >
            <input
              className="h-7 w-full rounded border border-slate-200 bg-white px-1 text-[10px] focus:border-blue-500 focus:outline-none"
              aria-label={`${productName} ${month} ${col}`}
            />
          </td>
        )),
      )}
    </tr>
  )
}

function SalesMatrix() {
  const subCols = ['Vol.', 'Price', 'Turnover']

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-2 py-2 text-left align-bottom">
              Product groups / products
            </th>
            {months.map((month) => (
              <th
                key={month}
                className="border border-slate-300 px-2 py-1 text-center align-bottom"
                colSpan={subCols.length}
              >
                {month}
              </th>
            ))}
          </tr>
          <tr className="bg-slate-50">
            <th className="border border-slate-300 px-2 py-1 text-left" />
            {months.map((month) =>
              subCols.map((col) => (
                <th
                  key={`${month}-${col}`}
                  className="border border-slate-300 px-2 py-1 text-center text-[10px]"
                >
                  {col}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody>
          {productGroups.map((group) => (
            <GroupRows key={group.name} groupName={group.name}>
              {group.products.map((p) => (
                <ProductRow key={p} productName={p} subCols={subCols} />
              ))}
            </GroupRows>
          ))}
        </tbody>
      </table>
    </div>
  )
}

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex">
      {/* LEFT PANEL */}
      <aside className="flex h-full min-w-[220px] max-w-xs flex-col bg-slate-900 text-slate-100">
        <div className="border-b border-slate-800 px-4 py-4">
          <h1 className="text-lg font-semibold text-white">
            Biopharma Intl
          </h1>
          <p className="mt-1 text-xs text-slate-400">Data Entry System</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3" aria-label="Main menu">
          {(Object.keys(menuStructure) as MainModuleKey[]).map((moduleKey) => {
            const module = menuStructure[moduleKey]
            return (
              <div key={moduleKey} className="mb-2">
                <div className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
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
                            ? 'border-l-2 border-blue-400 bg-slate-800'
                            : 'hover:bg-slate-800',
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

        <div className="border-t border-slate-800 px-4 py-3 text-[11px] text-slate-400">
          <p>Click to navigate.</p>
          <p className="mt-1">Layout: Light, 3-panel (responsive).</p>
        </div>
      </aside>

      {/* CENTER PANEL */}
      {showCenter && (
        <main className="flex h-full w-1/3 min-w-[260px] max-w-xl flex-col border-x border-slate-200 bg-white">
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
                {currentSubmodule === 'Pricing' && 'Pricing'}
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
                {countries.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={[
                      'mb-1 w-full rounded border px-3 py-2 text-left transition-colors',
                      selectedCountryName === c
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50',
                    ].join(' ')}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {currentSubmodule === 'MarketInsights' && (
              <div className="space-y-1">
                {productsFlat.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className={[
                      'mb-1 w-full rounded border px-3 py-2 text-left transition-colors',
                      selectedProductName === p
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50',
                    ].join(' ')}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {currentSubmodule === 'CountriesSetup' && (
              <div className="space-y-1">
                {countries.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={[
                      'mb-1 w-full rounded border px-3 py-2 text-left transition-colors',
                      selectedCountryName === c
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50',
                    ].join(' ')}
                  >
                    {c}
                  </button>
                ))}
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
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleSelectGroup(g)}
                          className={[
                            'mb-1 w-full rounded border px-3 py-2 text-left transition-colors',
                            selectedGroupName === g
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50',
                          ].join(' ')}
                        >
                          {g}
                        </button>
                      ))}
                    {usersTab === 'users' &&
                      users.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleSelectUser(u.id)}
                          className={[
                            'mb-1 w-full rounded border px-3 py-2 text-left transition-colors',
                            selectedUser?.id === u.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50',
                          ].join(' ')}
                        >
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {u.email}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {u.group}
                          </div>
                        </button>
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
              currentSubmodule === 'Pricing' ||
              currentSubmodule === 'Scenarios') && (
              <div className="flex h-full items-center justify-center text-slate-400">
                Not yet defined – placeholder
              </div>
            )}
          </div>
        </main>
      )}

      {/* RIGHT PANEL */}
      {hasRight && (
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
                {currentSubmodule === 'Pricing' && 'Pricing'}
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
                  <PatientsMatrix />
                )}
              </>
            )}

            {isSales && <SalesMatrix />}

            {isMarket && (
              <>
                {!selectedProductName ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Select a product first.
                  </div>
                ) : (
                  <MarketMatrix />
                )}
              </>
            )}

            {isExcelDemo && (
              <Nextcell
                rows={10}
                cols={5}
                colHeaders={['A', 'B', 'C', 'D', 'E']}
                rowHeaders={Array.from({ length: 10 }, (_, i) =>
                  String(i + 1),
                )}
              />
            )}

            {currentSubmodule === 'CountriesSetup' && (
              <>
                {!selectedCountryName ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Select a country in the center panel.
                  </div>
                ) : (
                  <div className="max-w-md space-y-4">
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
                      <select className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none">
                        <option>ASP</option>
                        <option>Maquila</option>
                        <option>Ex-Factory</option>
                      </select>
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
                        <select
                          multiple
                          className="h-48 w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                        >
                          {countries.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                          Cumulative Selected Functions
                        </label>
                        <select
                          multiple
                          className="h-48 w-full rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                        >
                          <option>DataEntry</option>
                          <option>MasterData</option>
                          <option>Supervisor</option>
                        </select>
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
              currentSubmodule === 'Pricing' ||
              currentSubmodule === 'Scenarios') &&
              !isPatients &&
              !isSales &&
              !isMarket &&
              currentSubmodule !== 'CountriesSetup' &&
              currentSubmodule !== 'Users' && (
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

function MarketMatrix() {
  const columns = [
    'Units',
    'Units (000)',
    'Sales Market $ (MM)',
    'ASP $/vial',
    "Change '23/20",
  ]

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-2 py-2 text-left">
              Company
            </th>
            {columns.map((c) => (
              <th
                key={c}
                className={[
                  'border border-slate-300 px-2 py-2 text-center',
                  c === "Change '23/20" ? 'bg-slate-100 text-slate-500' : '',
                ].join(' ')}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company}>
              <td className="border border-slate-300 bg-slate-50 px-2 py-2 font-semibold">
                {company}
              </td>
              {columns.map((c) => {
                const isCalc = c === "Change '23/20"
                return (
                  <td
                    key={c}
                    className={[
                      'border border-slate-300 px-1 py-1 text-center',
                      isCalc ? 'bg-slate-100 text-slate-500' : '',
                    ].join(' ')}
                  >
                    {isCalc ? '0.0%' : ''}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App

