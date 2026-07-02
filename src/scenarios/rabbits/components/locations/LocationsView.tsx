import { useMemo, useState } from 'react'
import { useSignalsContext } from '../../context/SignalsContext'
import { ActiveFiltersBanner } from '../dashboard/ActiveFiltersBanner'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'
import { LocationDetail } from './LocationDetail'

export function LocationsView() {
  const { locationStats, filteredSignals, activeFilterCount, resetFilters } =
    useSignalsContext()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const maxContribution = locationStats[0]?.totalContribution ?? 1

  const selectedStats = locationStats.find(
    (location) => location.location === selectedLocation,
  )

  const selectedSignals = useMemo(() => {
    if (!selectedLocation) {
      return []
    }

    return filteredSignals
      .filter((signal) => signal.location === selectedLocation)
      .sort((left, right) => left.time.localeCompare(right.time))
  }, [filteredSignals, selectedLocation])

  const totalSignals = filteredSignals.length
  const hottestAvg = locationStats[0]?.avgIntensity ?? 0

  if (locationStats.length === 0) {
    return (
      <div className="page-grid">
        <ActiveFiltersBanner />
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
            : 'Добавьте сигналы, чтобы увидеть карту активности.'}
        </EmptyState>
        </section>
      </div>
    )
  }

  return (
    <div className="page-grid">
      <ActiveFiltersBanner />

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
            <p className="metric-card__label">Сигналов в отчёте</p>
            <p className="metric-card__value">{totalSignals}</p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Пик ср. интенсивности</p>
            <p className="metric-card__value">{hottestAvg.toFixed(1)}</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel__title">Активность по локациям</h2>
        <p className="panel__hint">
          Выберите локацию, чтобы увидеть сигналы. Кнопка в деталях откроет
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
                    {location.signalCount} сигн. · ср. интенсивность{' '}
                    {location.avgIntensity.toFixed(1)} · вклад{' '}
                    {location.totalContribution.toFixed(1)}
                  </span>
                </div>
                <div className="bar-list__track">
                  <div
                    className="bar-list__fill"
                    style={{
                      width: `${(location.totalContribution / maxContribution) * 100}%`,
                    }}
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
          signals={selectedSignals}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  )
}
