export type MainModuleKey = 'Reports' | 'DataEntry' | 'MasterData' | 'Supervisor'

export type SubmoduleKey =
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

interface MenuSubmodule {
  label: string
  hasCenter: boolean
  hasRight: boolean
  isFullScreen?: boolean
}

interface MenuModule {
  label: string
  submodules: Partial<Record<SubmoduleKey, MenuSubmodule>>
}

export type MenuStructure = Record<MainModuleKey, MenuModule>

export const menuStructure: MenuStructure = {
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
      ProcessVisibility: {
        label: 'Process Visibility',
        hasCenter: true,
        hasRight: true,
      },
    },
  },
  DataEntry: {
    label: 'Data Entry',
    submodules: {
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

