import type { LocationStats } from '../../types'
import { useNavigation } from '../../context/NavigationContext'

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
  const maxCount = preview[0]?.count ?? 1

  if (preview.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel__title">Горячие локации</h2>
        <div className="empty-state">Локации не найдены.</div>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel__header-row">
        <h2 className="panel__title">Горячие локации</h2>
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
                {location.count} наблюд. · ср. {location.avgSuspicion.toFixed(1)}
              </span>
            </div>
            <div className="bar-list__track">
              <div
                className="bar-list__fill"
                style={{ width: `${(location.count / maxCount) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
