import type { ReactNode } from 'react'

interface AppShellProps {
  scenarioSwitcher?: ReactNode
  title: string
  subtitle: string
  tabs: Array<{ id: string; label: string }>
  activeTab: string
  onTabChange: (tabId: string) => void
  children: ReactNode
}

export function AppShell({
  scenarioSwitcher,
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Перейти к содержимому
      </a>
      {scenarioSwitcher && (
        <div className="app-shell__scenario">{scenarioSwitcher}</div>
      )}
      <header className="app-header">
        <h1 className="app-header__title">{title}</h1>
        <p className="app-header__subtitle">{subtitle}</p>
      </header>

      <div className="tabs-scroll">
        <nav className="tabs" aria-label="Разделы приложения">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab ${activeTab === tab.id ? 'tab--active' : ''}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <main id="main-content" className="app-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
