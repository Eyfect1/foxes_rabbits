import type { LocationStats } from '../../types'
import { useNavigation } from '../../context/NavigationContext'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'

interface LocationPreviewProps {
  locationStats: LocationStats[]
  limit?: number
}

export function LocationPreview({
  locationStats,
  limit = 3,
}: LocationPreviewProps) {
  const { navigateToLocation, setActiveTab } = useNavigation()
  const preview = locationStats.slice(0, limit)
  const maxContribution = preview[0]?.totalContribution ?? 1

  if (preview.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel__title">Активные зоны</h2>
        <EmptyState title="Локации не найдены">
          Сигналы не привязаны к локациям или скрыты фильтрами.
        </EmptyState>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel__header-row">
        <h2 className="panel__title">Активные зоны</h2>
        <button
          type="button"
          className="button"
          onClick={() => setActiveTab('locations')}
        >
          Все локации
        </button>
      </div>

      <div className="bar-list">
        {preview.map((location) => (
          <button
            key={location.location}
            type="button"
            className="bar-list__item"
            onClick={() => navigateToLocation(location.location)}
          >
            <div className="bar-list__label">
              <strong>{location.location}</strong>
              <span>
                {location.signalCount} сигн. · вклад {location.totalContribution.toFixed(1)}
              </span>
            </div>
            <div className="bar-list__track">
              <div
                className="bar-list__fill"
                style={{
                  width: `${(location.totalContribution / maxContribution) * 100}%`,
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
