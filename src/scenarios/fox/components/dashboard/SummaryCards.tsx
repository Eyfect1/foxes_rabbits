interface SummaryCardsProps {
  uniqueFoxCount: number
  observationCount: number
  hottestLocation: string | null
  leaderScore: number | null
  maxSuspicion: number
}

export function SummaryCards({
  uniqueFoxCount,
  observationCount,
  hottestLocation,
  leaderScore,
  maxSuspicion,
}: SummaryCardsProps) {
  return (
    <div className="metrics">
      <div className="metric-card">
        <p className="metric-card__label">Уникальных лис</p>
        <p className="metric-card__value metric-card__value--accent">
          {uniqueFoxCount}
        </p>
      </div>
      <div className="metric-card">
        <p className="metric-card__label">Наблюдений в отчёте</p>
        <p className="metric-card__value">{observationCount}</p>
      </div>
      <div className="metric-card">
        <p className="metric-card__label">Самая горячая локация</p>
        <p className="metric-card__value metric-card__value--compact">
          {hottestLocation ?? '—'}
        </p>
      </div>
      <div className="metric-card">
        <p className="metric-card__label">Пик подозрительности</p>
        <p className="metric-card__value">
          {maxSuspicion > 0 ? maxSuspicion : '—'}
        </p>
        {leaderScore !== null && (
          <p className="metric-card__footnote">
            Балл лидера: {leaderScore.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  )
}
