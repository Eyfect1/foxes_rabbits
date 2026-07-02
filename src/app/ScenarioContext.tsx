import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getScenarioThemeClass,
  isScenarioId,
  SCENARIO_STORAGE_KEY,
  type ScenarioId,
} from './scenarios'

interface ScenarioContextValue {
  activeScenario: ScenarioId
  setActiveScenario: (scenarioId: ScenarioId) => void
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null)

function loadActiveScenario(): ScenarioId {
  if (typeof window === 'undefined') {
    return 'fox'
  }

  try {
    const stored = window.localStorage.getItem(SCENARIO_STORAGE_KEY)

    if (stored && isScenarioId(stored)) {
      return stored
    }
  } catch {
    // ignore storage errors
  }

  return 'fox'
}

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [activeScenario, setActiveScenarioState] = useState<ScenarioId>(loadActiveScenario)

  const setActiveScenario = useCallback((scenarioId: ScenarioId) => {
    setActiveScenarioState(scenarioId)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(SCENARIO_STORAGE_KEY, activeScenario)
    document.body.className = getScenarioThemeClass(activeScenario)
  }, [activeScenario])

  const value = useMemo(
    () => ({
      activeScenario,
      setActiveScenario,
    }),
    [activeScenario, setActiveScenario],
  )

  return (
    <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>
  )
}

export function useScenario(): ScenarioContextValue {
  const context = useContext(ScenarioContext)

  if (!context) {
    throw new Error('useScenario must be used within ScenarioProvider')
  }

  return context
}
