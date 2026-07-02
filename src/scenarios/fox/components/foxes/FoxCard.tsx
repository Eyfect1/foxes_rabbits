import type { FoxSummary, Observation } from '../../types'
import { SuspicionBadge } from '../ui/SuspicionBadge'
import { useNavigation } from '../../context/NavigationContext'

interface FoxCardProps {
  fox: FoxSummary
  rank: number
  history: Observation[]
  isExpanded: boolean
  onToggle: () => void
}

export function FoxCard({
  fox,
  rank,
  history,
  isExpanded,
  onToggle,
}: FoxCardProps) {
  const { navigateToObservations } = useNavigation()

  return (
    <article
      id={`fox-card-${fox.fox_id}`}
      className={`fox-card ${rank === 1 ? 'fox-card--leader' : ''} ${
        isExpanded ? 'fox-card--expanded' : ''
      }`}
    >
      <button
        type="button"
        className="fox-card__header"
        aria-expanded={isExpanded}
        aria-controls={`fox-body-${fox.fox_id}`}
        onClick={onToggle}
      >
        <div>
          <p className="fox-card__rank">#{rank}</p>
          <p className="fox-card__id">{fox.fox_id}</p>
          <p className="fox-card__meta">
            {fox.color} · {fox.explanation.join(' · ')}
          </p>
        </div>
        <div className="fox-card__score">
          <span>{fox.compositeScore.toFixed(1)}</span>
          <small>балл</small>
        </div>
      </button>

      {isExpanded && (
        <div className="fox-card__body" id={`fox-body-${fox.fox_id}`}>
          <div className="detail-grid">
            <div className="detail-stat">
              <span className="detail-stat__label">Наблюдений</span>
              <span className="detail-stat__value">{fox.observationCount}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__label">С добычей</span>
              <span className="detail-stat__value">{fox.preySightings}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__label">Ср. подозр.</span>
              <span className="detail-stat__value">
                {fox.avgSuspicion.toFixed(1)}
              </span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat__label">Макс.</span>
              <span className="detail-stat__value">
                <SuspicionBadge level={fox.maxSuspicion} />
              </span>
            </div>
          </div>

          <p className="fox-card__locations">
            Локации: {fox.locations.join(', ')}
            {fox.primaryLocation ? ` · чаще: ${fox.primaryLocation}` : ''}
          </p>

          <ul className="fox-card__history">
            {history.map((observation) => (
              <li key={observation.id}>
                <strong>{observation.time}</strong> · {observation.location} ·{' '}
                <SuspicionBadge level={observation.suspicion_level} />
                {observation.has_prey ? ' · с добычей' : ''}
              </li>
            ))}
          </ul>

          <div className="button-row">
            <button
              type="button"
              className="button button--primary"
              onClick={() =>
                navigateToObservations({
                  foxId: fox.fox_id,
                  location: null,
                })
              }
            >
              Показать в журнале
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
