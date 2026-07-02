import { useSignalsContext } from '../../context/SignalsContext'
import { ActiveFiltersBanner } from '../dashboard/ActiveFiltersBanner'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'
import { SummaryCards } from './SummaryCards'
import { TopContributorsCard } from './TopContributorsCard'
import { RecommendationsPanel } from './RecommendationsPanel'
import { LocationPreview } from './LocationPreview'
import { EstimationParamsPanel } from './EstimationParamsPanel'

export function Dashboard() {
  const {
    signals,
    filteredSignals,
    estimation,
    locationStats,
    activeFilterCount,
    resetFilters,
  } = useSignalsContext()

  if (signals.length === 0) {
    return (
      <div className="page-grid">
        <section className="panel">
          <h2 className="panel__title">Сводка фермы</h2>
          <EmptyState title="Нет сигналов для оценки">
            Добавьте косвенные сигналы на вкладке «Сигналы» или импортируйте JSON из ТЗ,
            чтобы система оценила поголовье кроликов.
          </EmptyState>
        </section>
      </div>
    )
  }

  if (filteredSignals.length === 0) {
    return (
      <div className="page-grid">
        <ActiveFiltersBanner />
        <section className="panel">
          <h2 className="panel__title">Сводка фермы</h2>
          <EmptyState
            title="Нет данных для отчёта"
            action={
              <button type="button" className="button button--primary" onClick={resetFilters}>
                Сбросить фильтры
              </button>
            }
          >
            Активные фильтры скрыли все сигналы. Сбросьте фильтры или измените условия на
            вкладке «Сигналы».
          </EmptyState>
        </section>
      </div>
    )
  }

  return (
    <div className="page-grid">
      <ActiveFiltersBanner />

      <section className="panel">
        <h2 className="panel__title">Сводка фермы</h2>
        <p className="panel__hint">
          Отчёт пересчитывается при изменении сигналов, фильтров и параметров оценки.
          {activeFilterCount > 0
            ? ` Сейчас применено фильтров: ${activeFilterCount}.`
            : ''}
        </p>

        <SummaryCards
          rabbitCount={estimation.rabbitCount}
          confidence={estimation.confidence}
          signalCount={filteredSignals.length}
          hottestLocation={locationStats[0]?.location ?? null}
          rawScore={estimation.rawScore}
        />
      </section>

      <EstimationParamsPanel />
      <TopContributorsCard contributors={estimation.topContributors} />
      <RecommendationsPanel recommendations={estimation.recommendations} />
      <LocationPreview locationStats={locationStats} />
    </div>
  )
}
