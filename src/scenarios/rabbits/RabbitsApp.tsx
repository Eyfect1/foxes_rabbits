import { AppShell } from '../../shared/layout/AppShell'
import { ScenarioSwitcher } from '../../app/ScenarioSwitcher'
import { TABS } from './constants/tabs'
import { NavigationProvider, useNavigation } from './context/NavigationContext'
import { SignalsProvider } from './context/SignalsContext'
import { Dashboard } from './components/dashboard/Dashboard'
import { SignalsView } from './components/signals/SignalsView'
import { LocationsView } from './components/locations/LocationsView'
import { SignalTypesView } from './components/signal-types/SignalTypesView'
import { AIWorklog } from './components/worklog/AIWorklog'

function RabbitsAppContent() {
  const { activeTab, setActiveTab } = useNavigation()

  return (
    <AppShell
      scenarioSwitcher={<ScenarioSwitcher />}
      title="Ферма невидимых кроликов"
      subtitle="Интерактивный интерфейс фермера: косвенные сигналы, оценка кроликов и рекомендации."
      tabs={TABS.map((tab) => ({ id: tab.id, label: tab.label }))}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as (typeof TABS)[number]['id'])}
    >
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'signals' && <SignalsView />}
      {activeTab === 'locations' && <LocationsView />}
      {activeTab === 'types' && <SignalTypesView />}
      {activeTab === 'worklog' && <AIWorklog />}
    </AppShell>
  )
}

export function RabbitsApp() {
  return (
    <SignalsProvider>
      <NavigationProvider>
        <RabbitsAppContent />
      </NavigationProvider>
    </SignalsProvider>
  )
}
