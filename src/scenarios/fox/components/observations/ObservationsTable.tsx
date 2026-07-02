import { useMemo, useState } from 'react'
import type { Observation } from '../../types'
import { useObservationsContext } from '../../context/ObservationsContext'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'
import { SuspicionBadge } from '../ui/SuspicionBadge'

type SortKey =
  | 'time'
  | 'fox_id'
  | 'location'
  | 'color'
  | 'has_prey'
  | 'suspicion_level'

type SortDirection = 'asc' | 'desc'

interface ObservationsTableProps {
  onEdit: (observation: Observation) => void
}

function compareObservations(
  left: Observation,
  right: Observation,
  key: SortKey,
  direction: SortDirection,
): number {
  let result = 0

  if (key === 'has_prey') {
    result = Number(left.has_prey) - Number(right.has_prey)
  } else if (key === 'suspicion_level') {
    result = left.suspicion_level - right.suspicion_level
  } else if (key === 'time') {
    result = left.time.localeCompare(right.time)
  } else {
    result = left[key].localeCompare(right[key], 'ru')
  }

  return direction === 'asc' ? result : -result
}

export function ObservationsTable({ onEdit }: ObservationsTableProps) {
  const { observations, filteredObservations, deleteObservation, resetFilters } =
    useObservationsContext()
  const [sortKey, setSortKey] = useState<SortKey>('time')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const sortedObservations = useMemo(() => {
    return [...filteredObservations].sort((left, right) =>
      compareObservations(left, right, sortKey, sortDirection),
    )
  }, [filteredObservations, sortKey, sortDirection])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return ''
    }

    return sortDirection === 'asc' ? ' ↑' : ' ↓'
  }

  const handleDelete = (observation: Observation) => {
    if (
      window.confirm(
        `Удалить наблюдение ${observation.id} (${observation.fox_id}, ${observation.time})?`,
      )
    ) {
      deleteObservation(observation.id)
    }
  }

  if (observations.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel__title">Список наблюдений</h2>
        <EmptyState title="Журнал пуст">
          Добавьте первое наблюдение или импортируйте JSON ниже.
        </EmptyState>
      </section>
    )
  }

  if (filteredObservations.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel__title">Список наблюдений</h2>
        <EmptyState
          title="Ничего не найдено"
          action={
            <button type="button" className="button button--primary" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          }
        >
          Наблюдения не проходят текущие фильтры. Измените условия или сбросьте их.
        </EmptyState>
      </section>
    )
  }

  return (
    <section className="panel panel--table">
      <h2 className="panel__title">Список наблюдений</h2>
      <p className="panel__hint">
        Нажмите на заголовок колонки для сортировки. Показано:{' '}
        {sortedObservations.length} из {observations.length}.
      </p>

      <p className="panel__hint panel__hint--scroll">
        На узком экране таблицу можно прокручить горизонтально.
      </p>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => handleSort('time')}
                >
                  Время{sortIndicator('time')}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => handleSort('fox_id')}
                >
                  Лиса{sortIndicator('fox_id')}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => handleSort('location')}
                >
                  Локация{sortIndicator('location')}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => handleSort('color')}
                >
                  Цвет{sortIndicator('color')}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => handleSort('has_prey')}
                >
                  Добыча{sortIndicator('has_prey')}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => handleSort('suspicion_level')}
                >
                  Подозр.{sortIndicator('suspicion_level')}
                </button>
              </th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedObservations.map((observation) => (
              <tr key={observation.id}>
                <td>{observation.time}</td>
                <td>
                  <code>{observation.fox_id}</code>
                </td>
                <td>{observation.location}</td>
                <td>{observation.color}</td>
                <td>{observation.has_prey ? 'да' : 'нет'}</td>
                <td>
                  <SuspicionBadge level={observation.suspicion_level} />
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="button button--small"
                      onClick={() => onEdit(observation)}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      className="button button--small button--danger"
                      onClick={() => handleDelete(observation)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
