import { useMemo, useState } from 'react'
import { useObservationsContext } from '../../context/ObservationsContext'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'
import { LocationDetail } from './LocationDetail'

export function LocationsView() {
  const { locationStats, filteredObservations, activeFilterCount, resetFilters } =
    useObservationsContext()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const maxCount = locationStats[0]?.count ?? 1

  const selectedStats = locationStats.find(
    (location) => location.location === selectedLocation,
  )

  const selectedObservations = useMemo(() => {
    if (!selectedLocation) {
      return []
    }

    return filteredObservations
      .filter((observation) => observation.location === selectedLocation)
      .sort((left, right) => left.time.localeCompare(right.time))
  }, [filteredObservations, selectedLocation])

  const totalObservations = filteredObservations.length
  const hottestAvg = locationStats[0]?.avgSuspicion ?? 0

  if (locationStats.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel__title">Активность по локациям</h2>
        <EmptyState
          title="Локации не найдены"
          action={
            activeFilterCount > 0 ? (
              <button type="button" className="button button--primary" onClick={resetFilters}>
                Сбросить фильтры
              </button>
            ) : undefined
          }
        >
          {activeFilterCount > 0
            ? 'Текущие фильтры скрыли все локации.'
            : 'Добавьте наблюдения, чтобы увидеть карту активности.'}
        </EmptyState>
      </section>
    )
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="metrics metrics--compact">
          <div className="metric-card">
            <p className="metric-card__label">Локаций</p>
            <p className="metric-card__value metric-card__value--accent">
              {locationStats.length}
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Самая активная</p>
            <p className="metric-card__value metric-card__value--compact">
              {locationStats[0]?.location ?? '—'}
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Наблюдений в отчёте</p>
            <p className="metric-card__value">{totalObservations}</p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Пик ср. подозр.</p>
            <p className="metric-card__value">{hottestAvg.toFixed(1)}</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel__title">Активность по локациям</h2>
        <p className="panel__hint">
          Выберите локацию, чтобы увидеть наблюдения. Кнопка в деталях откроет
          отфильтрованный журнал.
        </p>

        <div className="bar-list bar-list--full">
          {locationStats.map((location) => {
            const isSelected = selectedLocation === location.location

            return (
              <button
                key={location.location}
                type="button"
                className={`bar-list__item ${isSelected ? 'bar-list__item--selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedLocation((current) =>
                    current === location.location ? null : location.location,
                  )
                }
              >
                <div className="bar-list__label">
                  <strong>{location.location}</strong>
                  <span>
                    {location.count} наблюд. · ср. подозрительность{' '}
                    {location.avgSuspicion.toFixed(1)} · лис:{' '}
                    {location.uniqueFoxes}
                  </span>
                </div>
                <div className="bar-list__track">
                  <div
                    className="bar-list__fill"
                    style={{ width: `${(location.count / maxCount) * 100}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {selectedStats && (
        <LocationDetail
          location={selectedStats}
          observations={selectedObservations}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  )
}
