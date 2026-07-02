import { useMemo, useState } from 'react'
import type { SignalEvent } from '../../types'
import { useSignalsContext } from '../../context/SignalsContext'
import { getEventTypeLabel } from '../../lib/eventTypes'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'
import { IntensityBadge } from '../ui/IntensityBadge'

type SortKey = 'time' | 'event' | 'location' | 'count' | 'intensity'

type SortDirection = 'asc' | 'desc'

interface SignalsTableProps {
  onEdit: (signal: SignalEvent) => void
}

function compareSignals(
  left: SignalEvent,
  right: SignalEvent,
  key: SortKey,
  direction: SortDirection,
): number {
  let result = 0

  if (key === 'count' || key === 'intensity') {
    result = left[key] - right[key]
  } else if (key === 'time') {
    result = left.time.localeCompare(right.time)
  } else if (key === 'event') {
    result = left.event.localeCompare(right.event, 'ru')
  } else {
    result = left.location.localeCompare(right.location, 'ru')
  }

  return direction === 'asc' ? result : -result
}

export function SignalsTable({ onEdit }: SignalsTableProps) {
  const { signals, filteredSignals, deleteSignal, resetFilters } = useSignalsContext()
  const [sortKey, setSortKey] = useState<SortKey>('time')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const sortedSignals = useMemo(() => {
    return [...filteredSignals].sort((left, right) =>
      compareSignals(left, right, sortKey, sortDirection),
    )
  }, [filteredSignals, sortKey, sortDirection])

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

  const handleDelete = (signal: SignalEvent) => {
    if (
      window.confirm(
        `Удалить сигнал ${signal.id} (${getEventTypeLabel(signal.event)}, ${signal.time})?`,
      )
    ) {
      deleteSignal(signal.id)
    }
  }

  if (signals.length === 0) {
    return (
      <section className="panel panel--table">
        <h2 className="panel__title">Журнал сигналов</h2>
        <EmptyState title="Журнал пуст">
          Добавьте первый сигнал или импортируйте JSON ниже.
        </EmptyState>
      </section>
    )
  }

  if (filteredSignals.length === 0) {
    return (
      <section className="panel panel--table">
        <h2 className="panel__title">Журнал сигналов</h2>
        <EmptyState
          title="Ничего не найдено"
          action={
            <button type="button" className="button button--primary" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          }
        >
          Сигналы не проходят текущие фильтры. Измените условия или сбросьте их.
        </EmptyState>
      </section>
    )
  }

  return (
    <section className="panel panel--table">
      <h2 className="panel__title">Журнал сигналов</h2>
      <p className="panel__hint">
        Нажмите на заголовок колонки для сортировки. Показано:{' '}
        {sortedSignals.length} из {signals.length}.
      </p>

      <p className="panel__hint panel__hint--scroll">
        На узком экране таблицу можно прокручить горизонтально.
      </p>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">
                <button type="button" className="sort-button" onClick={() => handleSort('time')}>
                  Время{sortIndicator('time')}
                </button>
              </th>
              <th scope="col">
                <button type="button" className="sort-button" onClick={() => handleSort('event')}>
                  Тип{sortIndicator('event')}
                </button>
              </th>
              <th scope="col">
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => handleSort('location')}
                >
                  Локация{sortIndicator('location')}
                </button>
              </th>
              <th scope="col">
                <button type="button" className="sort-button" onClick={() => handleSort('count')}>
                  Кол-во{sortIndicator('count')}
                </button>
              </th>
              <th scope="col">
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => handleSort('intensity')}
                >
                  Интенсивность{sortIndicator('intensity')}
                </button>
              </th>
              <th scope="col">ID</th>
              <th scope="col">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedSignals.map((signal) => (
              <tr key={signal.id}>
                <td>{signal.time}</td>
                <td>{getEventTypeLabel(signal.event)}</td>
                <td>{signal.location}</td>
                <td>{signal.count}</td>
                <td>
                  <IntensityBadge level={signal.intensity} />
                </td>
                <td>
                  <code>{signal.id}</code>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="button button--small"
                      onClick={() => onEdit(signal)}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      className="button button--small button--danger"
                      onClick={() => handleDelete(signal)}
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
