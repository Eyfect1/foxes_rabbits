import { ScenarioProvider, useScenario } from './app/ScenarioContext'
import { FoxApp } from './scenarios/fox/FoxApp'
import { RabbitsApp } from './scenarios/rabbits/RabbitsApp'

function ScenarioRouter() {
  const { activeScenario } = useScenario()

  if (activeScenario === 'rabbits') {
    return <RabbitsApp />
  }

  return <FoxApp />
}

function App() {
  return (
    <ScenarioProvider>
      <ScenarioRouter />
    </ScenarioProvider>
  )
}

export default App
