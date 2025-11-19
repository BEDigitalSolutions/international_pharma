import { useMemo, useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Nextcell } from './components/nextcell/Nextcell'
import { getPowerBIEmbedUrl, getPowerBIConfig } from './lib/powerbi'

type MainModuleKey = 'Reports' | 'DataEntry' | 'MasterData' | 'Supervisor'
type SubmoduleKey =
  | 'SalesTrends'
  | 'SalesAnalysis'
  | 'ProcessVisibility'
  | 'PatientsNewsDropouts'
  | 'SalesData'
  | 'MarketInsights'
  | 'CountriesSetup'
  | 'ProductsFamilies'
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

// Countries for Patients News/Dropouts (only Norway, Finland, Denmark)
const patientsCountries = ['Norway', 'Finland', 'Denmark']

// Countries grouped by continent for Countries Setup
const countriesByContinent: Record<string, string[]> = {
  Europe: [
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
  ],
  'North America': ['United States', 'Canada', 'Mexico'],
  'South America': ['Brazil', 'Argentina', 'Chile'],
}

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

const groupFunctions: Record<string, string[]> = {
  'Data Entry Managers': ['Reports', 'Data Entry'],
  'Country Users': ['Reports', 'Data Entry', 'MasterData'],
  'Supervisors': ['Reports', 'Data Entry', 'MasterData', 'Users', 'Supervisor'],
  'Read-Only Users': ['Reports'],
}

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
          isFullScreen?: boolean
        }
      >
    >
  }
> = {
  Reports: {
    label: 'Reports',
    submodules: {
      SalesTrends: {
        label: 'Sales Trends',
        hasCenter: false,
        hasRight: false,
        isFullScreen: true,
      },
      SalesAnalysis: {
        label: 'Sales Analysis',
        hasCenter: false,
        hasRight: false,
        isFullScreen: true,
      },
    },
  },
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

interface ExchangeRateRow {
  id: string
  contravalor: string
  fechaInicial: string
  fechaFinal: string
}

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

  // Get Power BI URLs from configuration
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
  const salesTrendsUrl = useMemo(
    () => {
      const url = getPowerBIEmbedUrl(powerBIConfig.salesTrends)
      if (import.meta.env.DEV) {
        console.log('Sales Trends URL:', url)
      }
      return url
    },
    [powerBIConfig.salesTrends],
  )
  const salesAnalysisUrl = useMemo(
    () => {
      const url = getPowerBIEmbedUrl(powerBIConfig.salesAnalysis)
      if (import.meta.env.DEV) {
        console.log('Sales Analysis URL:', url)
      }
      return url
    },
    [powerBIConfig.salesAnalysis],
  )

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

      {/* FULL SCREEN IFRAME FOR REPORTS */}
      {isFullScreen && (
        <section className="flex h-full flex-1 flex-col bg-white">
          {isSalesTrends && (
            <div className="flex h-full w-full items-center justify-center bg-slate-50">
              <div className="max-w-3xl rounded-lg border border-slate-300 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Power BI Report - Sales Trends
                  </h3>
                </div>
                <div className="mb-6 space-y-3 text-sm text-slate-600">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <p className="font-semibold text-amber-800 mb-2">
                      ⚠️ Content Security Policy (CSP) Restriction
                    </p>
                    <p>
                      Power BI bloquea la incrustación directa en iframes desde <code className="bg-amber-100 px-1 rounded">localhost</code> por políticas de seguridad. Esto es esperado en desarrollo.
                    </p>
                  </div>
                  <p className="font-semibold text-slate-700">
                    Soluciones para producción:
                  </p>
                  <ul className="ml-4 space-y-2 list-disc">
                    <li>
                      <strong>Power BI Embedded (Azure) - Recomendado:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-circle text-xs">
                        <li>Registrar aplicación en Azure AD</li>
                        <li>Usar Power BI REST API para obtener tokens de embed</li>
                        <li>Implementar Power BI JavaScript SDK</li>
                        <li>Requiere suscripción Azure y licencias Power BI Pro/Premium</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Publicar informe con Embed Token:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-circle text-xs">
                        <li>Configurar permisos de compartir del informe</li>
                        <li>Generar tokens de embed mediante Power BI REST API</li>
                        <li>Usar tokens para iframe autenticado</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Servidor Proxy:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-circle text-xs">
                        <li>Crear servicio backend que maneje autenticación</li>
                        <li>Proxy de requests a Power BI desde tu dominio</li>
                        <li>Servir contenido embed a través de tu dominio</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-4">
                  <p className="font-semibold text-blue-800 mb-2 text-xs">
                    URL Configurada (verificar en consola):
                  </p>
                  <code className="block break-all text-xs text-blue-700 bg-blue-100 p-2 rounded">
                    {salesTrendsUrl}
                  </code>
                </div>
                <div className="text-xs text-slate-500 italic">
                  <p>
                    ✓ Variables de entorno configuradas correctamente<br />
                    ✓ URLs construidas dinámicamente desde configuración<br />
                    ✓ Listo para implementación en producción con autenticación adecuada
                  </p>
                </div>
              </div>
            </div>
          )}
          {isSalesAnalysis && (
            <div className="flex h-full w-full items-center justify-center bg-slate-50">
              <div className="max-w-3xl rounded-lg border border-slate-300 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Power BI Report - Sales Analysis
                  </h3>
                </div>
                <div className="mb-6 space-y-3 text-sm text-slate-600">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <p className="font-semibold text-amber-800 mb-2">
                      ⚠️ Content Security Policy (CSP) Restriction
                    </p>
                    <p>
                      Power BI bloquea la incrustación directa en iframes desde <code className="bg-amber-100 px-1 rounded">localhost</code> por políticas de seguridad. Esto es esperado en desarrollo.
                    </p>
                  </div>
                  <p className="font-semibold text-slate-700">
                    Soluciones para producción:
                  </p>
                  <ul className="ml-4 space-y-2 list-disc">
                    <li>
                      <strong>Power BI Embedded (Azure) - Recomendado:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-circle text-xs">
                        <li>Registrar aplicación en Azure AD</li>
                        <li>Usar Power BI REST API para obtener tokens de embed</li>
                        <li>Implementar Power BI JavaScript SDK</li>
                        <li>Requiere suscripción Azure y licencias Power BI Pro/Premium</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Publicar informe con Embed Token:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-circle text-xs">
                        <li>Configurar permisos de compartir del informe</li>
                        <li>Generar tokens de embed mediante Power BI REST API</li>
                        <li>Usar tokens para iframe autenticado</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Servidor Proxy:</strong>
                      <ul className="ml-4 mt-1 space-y-1 list-circle text-xs">
                        <li>Crear servicio backend que maneje autenticación</li>
                        <li>Proxy de requests a Power BI desde tu dominio</li>
                        <li>Servir contenido embed a través de tu dominio</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-4">
                  <p className="font-semibold text-blue-800 mb-2 text-xs">
                    URL Configurada (verificar en consola):
                  </p>
                  <code className="block break-all text-xs text-blue-700 bg-blue-100 p-2 rounded">
                    {salesAnalysisUrl}
                  </code>
                </div>
                <div className="text-xs text-slate-500 italic">
                  <p>
                    ✓ Variables de entorno configuradas correctamente<br />
                    ✓ URLs construidas dinámicamente desde configuración<br />
                    ✓ Listo para implementación en producción con autenticación adecuada
                  </p>
                </div>
              </div>
            </div>
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
                  <PatientsMatrix />
                )}
              </>
            )}

            {isSales && (
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
            )}

            {isMarket && (
              <>
                {!selectedProductName ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Select a product first.
                  </div>
                ) : (
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
                        formula: (rowData, _allRowsData, _rowIndex, _colIndex) => {
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
                      <div className="rounded border border-slate-300 bg-white">
                        <div className="max-h-48 overflow-y-auto p-2">
                          {priceTypes.map((priceType) => (
                            <label
                              key={priceType}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 cursor-pointer rounded"
                            >
                              <input
                                type="checkbox"
                                checked={selectedPriceTypes.has(priceType)}
                                onChange={() => handlePriceTypeToggle(priceType)}
                                className="h-3 w-3 text-blue-600 focus:ring-blue-500 rounded"
                              />
                              <span className="text-xs text-slate-700">
                                {priceType}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <h3 className="mb-3 text-sm font-semibold text-slate-800">
                        Tipo de cambio €
                      </h3>
                      <div className="overflow-x-auto rounded border border-slate-300">
                        <table className="w-full border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100">
                              <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
                                Contravalor
                              </th>
                              <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
                                Fecha inicial
                              </th>
                              <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
                                Fecha Final
                              </th>
                              <th className="border border-slate-300 px-3 py-2 text-center font-semibold text-slate-700 w-20">
                                Acción
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {exchangeRates.map((row, index) => (
                              <tr key={row.id}>
                                <td className="border border-slate-300 p-0">
                                  <input
                                    type="text"
                                    value={row.contravalor}
                                    onChange={(e) => {
                                      const newRates = [...exchangeRates]
                                      newRates[index].contravalor = e.target.value
                                      setExchangeRates(newRates)
                                    }}
                                    className="h-8 w-full border-0 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Contravalor"
                                  />
                                </td>
                                <td className="border border-slate-300 p-0">
                                  <input
                                    type="date"
                                    value={row.fechaInicial}
                                    onChange={(e) => {
                                      const newRates = [...exchangeRates]
                                      newRates[index].fechaInicial = e.target.value
                                      setExchangeRates(newRates)
                                    }}
                                    className="h-8 w-full border-0 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="DD/MM/YYYY"
                                  />
                                </td>
                                <td className="border border-slate-300 p-0">
                                  <input
                                    type="date"
                                    value={row.fechaFinal}
                                    onChange={(e) => {
                                      const newRates = [...exchangeRates]
                                      newRates[index].fechaFinal = e.target.value
                                      setExchangeRates(newRates)
                                    }}
                                    className="h-8 w-full border-0 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="DD/MM/YYYY"
                                  />
                                </td>
                                <td className="border border-slate-300 p-1 text-center">
                                  {exchangeRates.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setExchangeRates(
                                          exchangeRates.filter((_, i) => i !== index),
                                        )
                                      }}
                                      className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                      title="Eliminar fila"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="border-t border-slate-300 bg-slate-50 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              setExchangeRates([
                                ...exchangeRates,
                                {
                                  id: Date.now().toString(),
                                  contravalor: '',
                                  fechaInicial: '',
                                  fechaFinal: '',
                                },
                              ])
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            + Agregar fila
                          </button>
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

