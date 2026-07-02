import { createContext, useContext, type ReactNode } from 'react'
import {
  useObservations,
  type UseObservationsResult,
} from '../hooks/useObservations'

const ObservationsContext = createContext<UseObservationsResult | null>(null)

export function ObservationsProvider({ children }: { children: ReactNode }) {
  const value = useObservations()

  return (
    <ObservationsContext.Provider value={value}>
      {children}
    </ObservationsContext.Provider>
  )
}

export function useObservationsContext(): UseObservationsResult {
  const context = useContext(ObservationsContext)

  if (!context) {
    throw new Error(
      'useObservationsContext must be used within ObservationsProvider',
    )
  }

  return context
}
