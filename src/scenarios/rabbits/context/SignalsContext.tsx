import { createContext, useContext, type ReactNode } from 'react'
import { useSignals, type UseSignalsResult } from '../hooks/useSignals'

const SignalsContext = createContext<UseSignalsResult | null>(null)

export function SignalsProvider({ children }: { children: ReactNode }) {
  const value = useSignals()

  return (
    <SignalsContext.Provider value={value}>{children}</SignalsContext.Provider>
  )
}

export function useSignalsContext(): UseSignalsResult {
  const context = useContext(SignalsContext)

  if (!context) {
    throw new Error('useSignalsContext must be used within SignalsProvider')
  }

  return context
}
