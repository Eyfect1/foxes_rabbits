import type { SignalContribution } from '../../types'
import { getEventTypeLabel } from '../../lib/eventTypes'
import { useNavigation } from '../../context/NavigationContext'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'

interface TopContributorsCardProps {
  contributors: SignalContribution[]
}

export function TopContributorsCard({ contributors }: TopContributorsCardProps) {
  const { navigateToSignals } = useNavigation()

  if (contributors.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel__title">Сильнейшие сигналы</h2>
        <EmptyState title="Нет вкладчиков">
          Добавьте сигналы с ненулевым вкладом в оценку.
        </EmptyState>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel__header-row">
        <h2 className="panel__title">Сильнейшие сигналы</h2>
        <button
          type="button"
          className="button"
          onClick={() => navigateToSignals()}
        >
          Все сигналы
        </button>
      </div>

      <ul className="contribution-list">
        {contributors.map((entry) => (
          <li key={entry.signal.id} className="contribution-list__item">
            <span>
              {getEventTypeLabel(entry.signal.event)} — {entry.signal.location},{' '}
              {entry.signal.time}
            </span>
            <span className="contribution-list__value">
              {entry.contribution.toFixed(1)} ({entry.sharePercent.toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
