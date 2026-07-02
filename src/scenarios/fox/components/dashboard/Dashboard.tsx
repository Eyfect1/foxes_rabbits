import { useMemo } from 'react'
import { useObservationsContext } from '../../context/ObservationsContext'
import { LocationPreview } from './LocationPreview'
import { ActiveFiltersBanner } from './ActiveFiltersBanner'
import { SummaryCards } from './SummaryCards'
import { SuspicionParamsPanel } from './SuspicionParamsPanel'
import { TopFoxCard } from './TopFoxCard'

export function Dashboard() {
  const {
    filteredObservations,
    uniqueFoxCount,
    locationStats,
    topFox,
    activeFilterCount,
  } = useObservationsContext()

  const maxSuspicion = useMemo(() => {
    if (filteredObservations.length === 0) {
      return 0
    }

    return Math.max(
      ...filteredObservations.map((observation) => observation.suspicion_level),
    )
  }, [filteredObservations])

  return (
    <div className="page-grid">
      <ActiveFiltersBanner />

      <section className="panel">
        <h2 className="panel__title">Сводка леса</h2>
        <p className="panel__hint">
          Отчёт пересчитывается при изменении данных, фильтров и параметров
          подозрительности.
          {activeFilterCount > 0
            ? ` Сейчас применено фильтров: ${activeFilterCount}.`
            : ''}
        </p>

        <SummaryCards
          uniqueFoxCount={uniqueFoxCount}
          observationCount={filteredObservations.length}
          hottestLocation={locationStats[0]?.location ?? null}
          leaderScore={topFox?.compositeScore ?? null}
          maxSuspicion={maxSuspicion}
        />
      </section>

      <TopFoxCard topFox={topFox} />
      <SuspicionParamsPanel />
      <LocationPreview locationStats={locationStats} />
    </div>
  )
}
