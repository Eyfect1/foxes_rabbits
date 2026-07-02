import { useObservationsContext } from '../../context/ObservationsContext'

export function ActiveFiltersBanner() {
  const { filters, activeFilterCount, resetFilters } = useObservationsContext()

  if (activeFilterCount === 0) {
    return null
  }

  const labels: string[] = []

  if (filters.foxId) {
    labels.push(`лиса: ${filters.foxId}`)
  }

  if (filters.location) {
    labels.push(`локация: ${filters.location}`)
  }

  if (filters.color) {
    labels.push(`цвет: ${filters.color}`)
  }

  if (filters.hasPrey !== null) {
    labels.push(filters.hasPrey ? 'с добычей' : 'без добычи')
  }

  if (filters.minSuspicion !== null) {
    labels.push(`мин. ${filters.minSuspicion}`)
  }

  if (filters.maxSuspicion !== null) {
    labels.push(`макс. ${filters.maxSuspicion}`)
  }

  return (
    <section className="panel panel--info" aria-live="polite">
      <div className="panel__header-row">
        <div>
          <h2 className="panel__title">Активные фильтры</h2>
          <p className="panel__hint panel__hint--inline">{labels.join(' · ')}</p>
        </div>
        <button type="button" className="button" onClick={resetFilters}>
          Сбросить фильтры
        </button>
      </div>
    </section>
  )
}
