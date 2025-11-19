import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { MainModuleKey, SubmoduleKey } from '../data/menu'
import type { ExchangeRateRow } from '../components/common/ExchangeRateTable'
import { users } from '../data/users'

type UsersTab = 'groups' | 'users'

type SelectedItem =
  | { type: 'country'; value: string }
  | { type: 'product'; value: string }
  | { type: 'group'; value: string }
  | { type: 'user'; value: number }
  | null

interface AppContextType {
  // Navigation
  currentModule: MainModuleKey
  setCurrentModule: (module: MainModuleKey) => void
  currentSubmodule: SubmoduleKey
  setCurrentSubmodule: (submodule: SubmoduleKey) => void

  // Selection
  selectedItem: SelectedItem
  setSelectedItem: (item: SelectedItem) => void
  usersTab: UsersTab
  setUsersTab: (tab: UsersTab) => void
  selectedContinent: string
  setSelectedContinent: (continent: string) => void

  // Derived values
  selectedCountryName: string | null
  selectedProductName: string | null
  selectedGroupName: string | null
  selectedUser: { id: number; name: string; email: string; group: string } | null

  // Countries Setup
  exchangeRates: ExchangeRateRow[]
  setExchangeRates: Dispatch<SetStateAction<ExchangeRateRow[]>>
  selectedPriceTypes: Set<string>
  setSelectedPriceTypes: Dispatch<SetStateAction<Set<string>>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentModule, setCurrentModule] = useState<MainModuleKey>('DataEntry')
  const [currentSubmodule, setCurrentSubmodule] =
    useState<SubmoduleKey>('PatientsNewsDropouts')
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null)
  const [usersTab, setUsersTab] = useState<UsersTab>('groups')
  const [selectedContinent, setSelectedContinent] = useState<string>('')
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateRow[]>([
    { id: '1', contravalor: '', fechaInicial: '', fechaFinal: '' },
  ])
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<Set<string>>(
    new Set(),
  )

  // Derived values
  const selectedCountryName = useMemo(
    () => (selectedItem?.type === 'country' ? selectedItem.value : null),
    [selectedItem],
  )

  const selectedProductName = useMemo(
    () => (selectedItem?.type === 'product' ? selectedItem.value : null),
    [selectedItem],
  )

  const selectedGroupName = useMemo(
    () => (selectedItem?.type === 'group' ? selectedItem.value : null),
    [selectedItem],
  )

  const selectedUser = useMemo(
    () =>
      selectedItem?.type === 'user'
        ? users.find((u) => u.id === selectedItem.value) ?? null
        : null,
    [selectedItem],
  )

  const value: AppContextType = useMemo(
    () => ({
      currentModule,
      setCurrentModule,
      currentSubmodule,
      setCurrentSubmodule,
      selectedItem,
      setSelectedItem,
      usersTab,
      setUsersTab,
      selectedContinent,
      setSelectedContinent,
      selectedCountryName,
      selectedProductName,
      selectedGroupName,
      selectedUser,
      exchangeRates,
      setExchangeRates,
      selectedPriceTypes,
      setSelectedPriceTypes,
    }),
    [
      currentModule,
      currentSubmodule,
      selectedItem,
      usersTab,
      selectedContinent,
      selectedCountryName,
      selectedProductName,
      selectedGroupName,
      selectedUser,
      exchangeRates,
      selectedPriceTypes,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

