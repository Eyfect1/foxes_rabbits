import { useSignalsContext } from '../../context/SignalsContext'
import { getEventTypeLabel } from '../../lib/eventTypes'

export function ActiveFiltersBanner() {
  const { filters, activeFilterCount, resetFilters } = useSignalsContext()

  if (activeFilterCount === 0) {
    return null
  }

  const labels: string[] = []

  if (filters.event) {
    labels.push(`тип: ${getEventTypeLabel(filters.event)}`)
  }

  if (filters.location) {
    labels.push(`локация: ${filters.location}`)
  }

  if (filters.minIntensity !== null) {
    labels.push(`мин. инт. ${filters.minIntensity}`)
  }

  if (filters.maxIntensity !== null) {
    labels.push(`макс. инт. ${filters.maxIntensity}`)
  }

  if (filters.minCount !== null) {
    labels.push(`мин. кол-во ${filters.minCount}`)
  }

  if (filters.maxCount !== null) {
    labels.push(`макс. кол-во ${filters.maxCount}`)
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
