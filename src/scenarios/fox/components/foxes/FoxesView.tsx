import { useEffect, useMemo, useState } from 'react'
import { useNavigation } from '../../context/NavigationContext'
import { useObservationsContext } from '../../context/ObservationsContext'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'
import { FoxCard } from './FoxCard'
import { FoxRankingTable } from './FoxRankingTable'

type ViewMode = 'cards' | 'table'

export function FoxesView() {
  const { foxSummaries, filteredObservations, activeFilterCount, resetFilters } =
    useObservationsContext()
  const { highlightedFoxId, clearHighlightedFox } = useNavigation()
  const [expandedFoxId, setExpandedFoxId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  const observationsByFox = useMemo(() => {
    const grouped = new Map<string, typeof filteredObservations>()

    for (const observation of filteredObservations) {
      const list = grouped.get(observation.fox_id) ?? []
      list.push(observation)
      grouped.set(observation.fox_id, list)
    }

    for (const list of grouped.values()) {
      list.sort((left, right) => left.time.localeCompare(right.time))
    }

    return grouped
  }, [filteredObservations])

  const leader = foxSummaries[0] ?? null
  const averageScore =
    foxSummaries.length === 0
      ? 0
      : foxSummaries.reduce((sum, fox) => sum + fox.compositeScore, 0) /
        foxSummaries.length

  useEffect(() => {
    if (!highlightedFoxId) {
      return
    }

    setExpandedFoxId(highlightedFoxId)
    setViewMode('cards')
    clearHighlightedFox()

    requestAnimationFrame(() => {
      document
        .getElementById(`fox-card-${highlightedFoxId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, [highlightedFoxId, clearHighlightedFox])

  if (foxSummaries.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel__title">Рейтинг лис</h2>
        <EmptyState
          title="Нет лис в выборке"
          action={
            activeFilterCount > 0 ? (
              <button type="button" className="button button--primary" onClick={resetFilters}>
                Сбросить фильтры
              </button>
            ) : undefined
          }
        >
          {activeFilterCount > 0
            ? 'Попробуйте ослабить фильтры или добавьте новые наблюдения.'
            : 'Добавьте наблюдения на вкладке «Наблюдения».'}
        </EmptyState>
      </section>
    )
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="metrics metrics--compact">
          <div className="metric-card">
            <p className="metric-card__label">Лис в рейтинге</p>
            <p className="metric-card__value metric-card__value--accent">
              {foxSummaries.length}
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Лидер</p>
            <p className="metric-card__value metric-card__value--compact">
              {leader?.fox_id ?? '—'}
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Средний балл</p>
            <p className="metric-card__value">{averageScore.toFixed(1)}</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel__header-row">
          <div>
            <h2 className="panel__title">Рейтинг лис</h2>
            <p className="panel__hint panel__hint--inline">
              Сортировка по составному баллу. Раскройте карточку для деталей и
              перехода в журнал.
            </p>
          </div>
          <div className="view-toggle" role="group" aria-label="Режим отображения">
            <button
              type="button"
              className={`button button--small ${viewMode === 'cards' ? 'button--active' : ''}`}
              aria-pressed={viewMode === 'cards'}
              onClick={() => setViewMode('cards')}
            >
              Карточки
            </button>
            <button
              type="button"
              className={`button button--small ${viewMode === 'table' ? 'button--active' : ''}`}
              aria-pressed={viewMode === 'table'}
              onClick={() => setViewMode('table')}
            >
              Таблица
            </button>
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="fox-list">
            {foxSummaries.map((fox, index) => (
              <FoxCard
                key={fox.fox_id}
                fox={fox}
                rank={index + 1}
                history={observationsByFox.get(fox.fox_id) ?? []}
                isExpanded={expandedFoxId === fox.fox_id}
                onToggle={() =>
                  setExpandedFoxId((current) =>
                    current === fox.fox_id ? null : fox.fox_id,
                  )
                }
              />
            ))}
          </div>
        ) : (
          <FoxRankingTable
            foxSummaries={foxSummaries}
            onSelectFox={(foxId) => {
              setViewMode('cards')
              setExpandedFoxId(foxId)
            }}
          />
        )}
      </section>
    </div>
  )
}
