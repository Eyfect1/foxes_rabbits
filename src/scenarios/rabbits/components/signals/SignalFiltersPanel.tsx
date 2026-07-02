import { useMemo } from 'react'
import { SIGNAL_EVENT_TYPES } from '../../types'
import { getEventTypeLabel } from '../../lib/eventTypes'
import { useSignalsContext } from '../../context/SignalsContext'

export function SignalFiltersPanel() {
  const { signals, filters, updateFilters, resetFilters, activeFilterCount } =
    useSignalsContext()

  const options = useMemo(() => {
    const locations = [...new Set(signals.map((signal) => signal.location))].sort()

    return { locations }
  }, [signals])

  return (
    <section className="panel">
      <div className="panel__header-row">
        <h2 className="panel__title">Фильтры</h2>
        {activeFilterCount > 0 && (
          <button type="button" className="button" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>

      <div className="filters-grid">
        <div className="field">
          <label htmlFor="filter-event">Тип сигнала</label>
          <select
            id="filter-event"
            value={filters.event ?? ''}
            onChange={(event) =>
              updateFilters({
                event: event.target.value
                  ? (event.target.value as (typeof SIGNAL_EVENT_TYPES)[number])
                  : null,
              })
            }
          >
            <option value="">Все</option>
            {SIGNAL_EVENT_TYPES.map((eventType) => (
              <option key={eventType} value={eventType}>
                {getEventTypeLabel(eventType)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-signal-location">Локация</label>
          <select
            id="filter-signal-location"
            value={filters.location ?? ''}
            onChange={(event) =>
              updateFilters({
                location: event.target.value || null,
              })
            }
          >
            <option value="">Все</option>
            {options.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-min-intensity">Мин. интенсивность</label>
          <input
            id="filter-min-intensity"
            type="number"
            min="1"
            max="10"
            value={filters.minIntensity ?? ''}
            onChange={(event) =>
              updateFilters({
                minIntensity: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="filter-max-intensity">Макс. интенсивность</label>
          <input
            id="filter-max-intensity"
            type="number"
            min="1"
            max="10"
            value={filters.maxIntensity ?? ''}
            onChange={(event) =>
              updateFilters({
                maxIntensity: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="filter-min-count">Мин. количество</label>
          <input
            id="filter-min-count"
            type="number"
            min="1"
            value={filters.minCount ?? ''}
            onChange={(event) =>
              updateFilters({
                minCount: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="filter-max-count">Макс. количество</label>
          <input
            id="filter-max-count"
            type="number"
            min="1"
            value={filters.maxCount ?? ''}
            onChange={(event) =>
              updateFilters({
                maxCount: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </div>
      </div>
    </section>
  )
}
