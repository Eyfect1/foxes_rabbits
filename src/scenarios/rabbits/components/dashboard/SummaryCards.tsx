interface SummaryCardsProps {
  rabbitCount: number
  confidence: number
  signalCount: number
  hottestLocation: string | null
  rawScore: number
}

export function SummaryCards({
  rabbitCount,
  confidence,
  signalCount,
  hottestLocation,
  rawScore,
}: SummaryCardsProps) {
  return (
    <div className="metrics">
      <div className="metric-card">
        <p className="metric-card__label">Оценка кроликов</p>
        <p className="metric-card__value metric-card__value--accent">{rabbitCount}</p>
        <p className="metric-card__footnote">сырой балл: {rawScore.toFixed(1)}</p>
      </div>
      <div className="metric-card">
        <p className="metric-card__label">Уверенность</p>
        <p className="metric-card__value">{confidence}%</p>
        <div className="confidence-bar" aria-hidden="true">
          <div className="confidence-bar__fill" style={{ width: `${confidence}%` }} />
        </div>
      </div>
      <div className="metric-card">
        <p className="metric-card__label">Сигналов в отчёте</p>
        <p className="metric-card__value">{signalCount}</p>
      </div>
      <div className="metric-card">
        <p className="metric-card__label">Самая активная зона</p>
        <p className="metric-card__value metric-card__value--compact">
          {hottestLocation ?? '—'}
        </p>
      </div>
    </div>
  )
}
