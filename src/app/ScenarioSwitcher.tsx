import { SCENARIOS } from './scenarios'
import { useScenario } from './ScenarioContext'

export function ScenarioSwitcher() {
  const { activeScenario, setActiveScenario } = useScenario()

  return (
    <nav className="scenario-switcher" aria-label="Выбор сценария">
      {SCENARIOS.map((scenario) => (
        <button
          key={scenario.id}
          type="button"
          className={`scenario-switcher__button ${
            activeScenario === scenario.id ? 'scenario-switcher__button--active' : ''
          }`}
          aria-current={activeScenario === scenario.id ? 'page' : undefined}
          onClick={() => setActiveScenario(scenario.id)}
        >
          <span className="scenario-switcher__label">{scenario.label}</span>
          <span className="scenario-switcher__label-short">{scenario.shortLabel}</span>
        </button>
      ))}
    </nav>
  )
}
