import type { LocationStats, Observation } from '../../types'
import { SuspicionBadge } from '../ui/SuspicionBadge'
import { useNavigation } from '../../context/NavigationContext'

interface LocationDetailProps {
  location: LocationStats
  observations: Observation[]
  onClose: () => void
}

export function LocationDetail({
  location,
  observations,
  onClose,
}: LocationDetailProps) {
  const { navigateToObservations } = useNavigation()

  return (
    <section className="panel panel--highlight">
      <div className="panel__header-row">
        <div>
          <h2 className="panel__title">{location.location}</h2>
          <p className="panel__hint panel__hint--inline">
            {location.count} наблюд. · ср. подозрительность{' '}
            {location.avgSuspicion.toFixed(1)} · лис: {location.uniqueFoxes}
          </p>
        </div>
        <button type="button" className="button" onClick={onClose}>
          Закрыть
        </button>
      </div>

      <ul className="location-detail__list">
        {observations.map((observation) => (
          <li key={observation.id} className="location-detail__item">
            <div>
              <strong>{observation.time}</strong> · <code>{observation.fox_id}</code> ·{' '}
              {observation.color}
            </div>
            <div className="location-detail__meta">
              <SuspicionBadge level={observation.suspicion_level} />
              {observation.has_prey && (
                <span className="tag tag--warning">с добычей</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="button-row">
        <button
          type="button"
          className="button button--primary"
          onClick={() =>
            navigateToObservations({
              location: location.location,
              foxId: null,
            })
          }
        >
          Открыть в журнале
        </button>
      </div>
    </section>
  )
}
