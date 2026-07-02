import type { LocationStats, SignalEvent } from '../../types'
import { getEventTypeLabel } from '../../lib/eventTypes'
import { IntensityBadge } from '../ui/IntensityBadge'
import { useNavigation } from '../../context/NavigationContext'

interface LocationDetailProps {
  location: LocationStats
  signals: SignalEvent[]
  onClose: () => void
}

export function LocationDetail({ location, signals, onClose }: LocationDetailProps) {
  const { navigateToSignals } = useNavigation()

  return (
    <section className="panel panel--highlight">
      <div className="panel__header-row">
        <div>
          <h2 className="panel__title">{location.location}</h2>
          <p className="panel__hint panel__hint--inline">
            {location.signalCount} сигн. · ср. интенсивность{' '}
            {location.avgIntensity.toFixed(1)} · вклад{' '}
            {location.totalContribution.toFixed(1)}
          </p>
        </div>
        <button type="button" className="button" onClick={onClose}>
          Закрыть
        </button>
      </div>

      <ul className="location-detail__list">
        {signals.map((signal) => (
          <li key={signal.id} className="location-detail__item">
            <div>
              <strong>{signal.time}</strong> · {getEventTypeLabel(signal.event)} · кол-во{' '}
              {signal.count}
            </div>
            <div className="location-detail__meta">
              <IntensityBadge level={signal.intensity} />
            </div>
          </li>
        ))}
      </ul>

      <div className="button-row">
        <button
          type="button"
          className="button button--primary"
          onClick={() =>
            navigateToSignals({
              location: location.location,
              event: null,
            })
          }
        >
          Открыть в журнале
        </button>
      </div>
    </section>
  )
}
