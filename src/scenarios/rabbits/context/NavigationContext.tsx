import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { TabId } from '../constants/tabs'
import type { SignalEventType, SignalFilters } from '../types'
import { useSignalsContext } from './SignalsContext'

interface NavigationContextValue {
  activeTab: TabId
  setActiveTab: (tabId: TabId) => void
  navigateToSignals: (filters?: Partial<SignalFilters>) => void
  navigateToLocation: (location: string) => void
  navigateToSignalType: (event: SignalEventType) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const { updateFilters } = useSignalsContext()

  const navigateToSignals = useCallback(
    (filters?: Partial<SignalFilters>) => {
      if (filters) {
        updateFilters(filters)
      }

      setActiveTab('signals')
    },
    [updateFilters],
  )

  const navigateToLocation = useCallback(
    (location: string) => {
      updateFilters({ location, event: null })
      setActiveTab('signals')
    },
    [updateFilters],
  )

  const navigateToSignalType = useCallback(
    (event: SignalEventType) => {
      updateFilters({ event, location: null })
      setActiveTab('signals')
    },
    [updateFilters],
  )

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      navigateToSignals,
      navigateToLocation,
      navigateToSignalType,
    }),
    [activeTab, navigateToSignals, navigateToLocation, navigateToSignalType],
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext)

  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }

  return context
}
