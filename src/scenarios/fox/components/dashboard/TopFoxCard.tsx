import type { FoxSummary } from '../../types'
import { useNavigation } from '../../context/NavigationContext'

interface TopFoxCardProps {
  topFox: FoxSummary | null
}

export function TopFoxCard({ topFox }: TopFoxCardProps) {
  const { navigateToFox } = useNavigation()

  if (!topFox) {
    return (
      <section className="panel">
        <h2 className="panel__title">Самая подозрительная лиса</h2>
        <div className="empty-state">
          Нет наблюдений для отчёта. Сбросьте фильтры или добавьте данные.
        </div>
      </section>
    )
  }

  return (
    <section className="panel panel--highlight">
      <h2 className="panel__title">Самая подозрительная лиса</h2>
      <div className="top-fox">
        <div className="top-fox__main">
          <div>
            <p className="top-fox__id">{topFox.fox_id}</p>
            <p className="top-fox__meta">
              {topFox.color} · {topFox.observationCount} наблюд.
            </p>
          </div>
          <div className="top-fox__score">
            <span className="top-fox__score-value">
              {topFox.compositeScore.toFixed(1)}
            </span>
            <span className="top-fox__score-label">балл</span>
          </div>
        </div>

        <div className="top-fox__why">
          <p className="top-fox__why-title">Почему</p>
          <ul className="top-fox__why-list">
            {topFox.explanation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigateToFox(topFox.fox_id)}
          >
            Подробнее о лисе
          </button>
        </div>
      </div>
    </section>
  )
}
