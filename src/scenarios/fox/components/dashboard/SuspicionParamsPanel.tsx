import { DEFAULT_SUSPICION_PARAMS } from '../../types'
import { useObservationsContext } from '../../context/ObservationsContext'

export function SuspicionParamsPanel() {
  const { params, updateParams, setParams } = useObservationsContext()

  return (
    <section className="panel">
      <h2 className="panel__title">Параметры подозрительности</h2>
      <p className="panel__hint">
        Настройте веса факторов. Формула:{' '}
        <code>
          балл = suspicion_level × {params.levelWeight.toFixed(1)} + (добыча ?{' '}
          {params.preyWeight.toFixed(1)} : 0)
        </code>
      </p>

      <div className="slider-field">
        <div className="slider-field__header">
          <label htmlFor="level-weight">Вес уровня подозрительности</label>
          <span className="slider-field__value">{params.levelWeight.toFixed(1)}</span>
        </div>
        <input
          id="level-weight"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={params.levelWeight}
          onChange={(event) =>
            updateParams({ levelWeight: Number(event.target.value) })
          }
        />
      </div>

      <div className="slider-field">
        <div className="slider-field__header">
          <label htmlFor="prey-weight">Бонус за добычу</label>
          <span className="slider-field__value">{params.preyWeight.toFixed(1)}</span>
        </div>
        <input
          id="prey-weight"
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={params.preyWeight}
          onChange={(event) =>
            updateParams({ preyWeight: Number(event.target.value) })
          }
        />
      </div>

      <div className="factor-legend">
        <span className="tag">suspicion_level (1–10)</span>
        <span className="tag tag--warning">has_prey</span>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="button"
          onClick={() => setParams(DEFAULT_SUSPICION_PARAMS)}
        >
          Сбросить параметры
        </button>
      </div>
    </section>
  )
}
