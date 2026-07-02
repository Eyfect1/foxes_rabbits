import { useMemo } from 'react'
import { useObservationsContext } from '../../context/ObservationsContext'

export function ObservationFiltersPanel() {
  const { observations, filters, updateFilters, resetFilters, activeFilterCount } =
    useObservationsContext()

  const options = useMemo(() => {
    const foxIds = [...new Set(observations.map((o) => o.fox_id))].sort()
    const locations = [...new Set(observations.map((o) => o.location))].sort()
    const colors = [...new Set(observations.map((o) => o.color))].sort()

    return { foxIds, locations, colors }
  }, [observations])

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
          <label htmlFor="filter-fox">Лиса</label>
          <select
            id="filter-fox"
            value={filters.foxId ?? ''}
            onChange={(event) =>
              updateFilters({
                foxId: event.target.value || null,
              })
            }
          >
            <option value="">Все</option>
            {options.foxIds.map((foxId) => (
              <option key={foxId} value={foxId}>
                {foxId}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-location">Локация</label>
          <select
            id="filter-location"
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
          <label htmlFor="filter-color">Цвет</label>
          <select
            id="filter-color"
            value={filters.color ?? ''}
            onChange={(event) =>
              updateFilters({
                color: event.target.value || null,
              })
            }
          >
            <option value="">Все</option>
            {options.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-prey">Добыча</label>
          <select
            id="filter-prey"
            value={
              filters.hasPrey === null ? '' : filters.hasPrey ? 'yes' : 'no'
            }
            onChange={(event) => {
              const value = event.target.value

              updateFilters({
                hasPrey: value === '' ? null : value === 'yes',
              })
            }}
          >
            <option value="">Все</option>
            <option value="yes">С добычей</option>
            <option value="no">Без добычи</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-min">Мин. подозрительность</label>
          <input
            id="filter-min"
            type="number"
            min="1"
            max="10"
            value={filters.minSuspicion ?? ''}
            onChange={(event) =>
              updateFilters({
                minSuspicion: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="filter-max">Макс. подозрительность</label>
          <input
            id="filter-max"
            type="number"
            min="1"
            max="10"
            value={filters.maxSuspicion ?? ''}
            onChange={(event) =>
              updateFilters({
                maxSuspicion: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
          />
        </div>
      </div>
    </section>
  )
}
