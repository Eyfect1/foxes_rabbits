import { TABS } from './constants/tabs'
import { Dashboard } from './components/dashboard/Dashboard'
import { FoxesView } from './components/foxes/FoxesView'
import { LocationsView } from './components/locations/LocationsView'
import { ObservationsView } from './components/observations/ObservationsView'
import { AIWorklog } from './components/worklog/AIWorklog'
import { NavigationProvider, useNavigation } from './context/NavigationContext'
import { ObservationsProvider } from './context/ObservationsContext'
import { AppShell } from '../../shared/layout/AppShell'
import { ScenarioSwitcher } from '../../app/ScenarioSwitcher'

function FoxAppContent() {
  const { activeTab, setActiveTab } = useNavigation()

  return (
    <AppShell
      scenarioSwitcher={<ScenarioSwitcher />}
      title="Лисий диспетчер"
      subtitle="Интерактивный интерфейс лесного смотрителя: наблюдения, подозрительность и отчёт по лисам."
      tabs={TABS.map((tab) => ({ id: tab.id, label: tab.label }))}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as (typeof TABS)[number]['id'])}
    >
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'observations' && <ObservationsView />}
      {activeTab === 'foxes' && <FoxesView />}
      {activeTab === 'locations' && <LocationsView />}
      {activeTab === 'worklog' && <AIWorklog />}
    </AppShell>
  )
}

export function FoxApp() {
  return (
    <ObservationsProvider>
      <NavigationProvider>
        <FoxAppContent />
      </NavigationProvider>
    </ObservationsProvider>
  )
}
