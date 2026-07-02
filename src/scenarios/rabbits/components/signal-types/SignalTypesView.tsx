import { useSignalsContext } from '../../context/SignalsContext'
import { useNavigation } from '../../context/NavigationContext'
import { ActiveFiltersBanner } from '../dashboard/ActiveFiltersBanner'
import { EmptyState } from '../../../../shared/components/ui/EmptyState'

export function SignalTypesView() {
  const { signalTypeStats, activeFilterCount, resetFilters } = useSignalsContext()
  const { navigateToSignalType } = useNavigation()

  const maxContribution = signalTypeStats[0]?.totalContribution ?? 1
  const totalTypes = signalTypeStats.length
  const leader = signalTypeStats[0] ?? null

  if (signalTypeStats.length === 0) {
    return (
      <div className="page-grid">
        <ActiveFiltersBanner />
        <section className="panel">
          <h2 className="panel__title">Типы сигналов</h2>
          <EmptyState
            title="Типы не найдены"
            action={
              activeFilterCount > 0 ? (
                <button type="button" className="button button--primary" onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              ) : undefined
            }
          >
            {activeFilterCount > 0
              ? 'Текущие фильтры скрыли все типы сигналов.'
              : 'Добавьте сигналы, чтобы увидеть разбивку по типам.'}
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
            <p className="metric-card__label">Типов в отчёте</p>
            <p className="metric-card__value metric-card__value--accent">{totalTypes}</p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Сильнейший тип</p>
            <p className="metric-card__value metric-card__value--compact">
              {leader?.label ?? '—'}
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Вклад лидера</p>
            <p className="metric-card__value">
              {leader ? leader.totalContribution.toFixed(1) : '—'}
            </p>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel__title">Вклад типов сигналов</h2>
        <p className="panel__hint">
          Как разные косвенные признаки влияют на оценку поголовья. Нажмите на тип,
          чтобы открыть отфильтрованный журнал.
        </p>

        <div className="bar-list bar-list--full">
          {signalTypeStats.map((typeStats) => (
            <button
              key={typeStats.event}
              type="button"
              className="bar-list__item"
              aria-label={`${typeStats.label}: вклад ${typeStats.totalContribution.toFixed(1)}`}
              onClick={() => navigateToSignalType(typeStats.event)}
            >
              <div className="bar-list__label">
                <strong>{typeStats.label}</strong>
                <span>
                  {typeStats.signalCount} сигн. · суммарно {typeStats.totalCount} ед. ·
                  ср. инт. {typeStats.avgIntensity.toFixed(1)} · вклад{' '}
                  {typeStats.totalContribution.toFixed(1)}
                </span>
              </div>
              <div className="bar-list__track" aria-hidden="true">
                <div
                  className="bar-list__fill"
                  style={{
                    width: `${(typeStats.totalContribution / maxContribution) * 100}%`,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
