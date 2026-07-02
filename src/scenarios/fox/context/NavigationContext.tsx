import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { TabId } from '../constants/tabs'
import type { ObservationFilters } from '../types'
import { useObservationsContext } from './ObservationsContext'

interface NavigationContextValue {
  activeTab: TabId
  setActiveTab: (tabId: TabId) => void
  navigateToObservations: (filters?: Partial<ObservationFilters>) => void
  navigateToLocation: (location: string) => void
  navigateToFox: (foxId: string) => void
  highlightedFoxId: string | null
  clearHighlightedFox: () => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [highlightedFoxId, setHighlightedFoxId] = useState<string | null>(null)
  const { updateFilters } = useObservationsContext()

  const navigateToObservations = useCallback(
    (filters?: Partial<ObservationFilters>) => {
      if (filters) {
        updateFilters(filters)
      }

      setActiveTab('observations')
    },
    [updateFilters],
  )

  const navigateToLocation = useCallback(
    (location: string) => {
      updateFilters({ location, foxId: null })
      setActiveTab('observations')
    },
    [updateFilters],
  )

  const navigateToFox = useCallback((foxId: string) => {
    setHighlightedFoxId(foxId)
    setActiveTab('foxes')
  }, [])

  const clearHighlightedFox = useCallback(() => {
    setHighlightedFoxId(null)
  }, [])

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      navigateToObservations,
      navigateToLocation,
      navigateToFox,
      highlightedFoxId,
      clearHighlightedFox,
    }),
    [
      activeTab,
      navigateToObservations,
      navigateToLocation,
      navigateToFox,
      highlightedFoxId,
      clearHighlightedFox,
    ],
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
