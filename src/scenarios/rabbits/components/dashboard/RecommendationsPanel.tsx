import type { Recommendation } from '../../types'

interface RecommendationsPanelProps {
  recommendations: Recommendation[]
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="panel">
      <h2 className="panel__title">Рекомендации фермеру</h2>
      <ul className="recommendation-list">
        {recommendations.map((recommendation) => (
          <li
            key={recommendation.id}
            className={`recommendation-list__item recommendation-list__item--${recommendation.priority}`}
          >
            <strong>{recommendation.title}</strong>
            <p>{recommendation.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
