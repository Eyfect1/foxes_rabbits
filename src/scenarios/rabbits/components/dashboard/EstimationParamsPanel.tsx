import { DEFAULT_ESTIMATION_PARAMS } from '../../types'
import { useSignalsContext } from '../../context/SignalsContext'

export function EstimationParamsPanel() {
  const { params, updateParams, setParams } = useSignalsContext()

  return (
    <section className="panel">
      <h2 className="panel__title">Параметры оценки</h2>
      <p className="panel__hint">
        Настройте веса типов сигналов. Формула вклада:{' '}
        <code>
          count × (intensity / 10) × {params.intensityFactor.toFixed(1)} × вес_типа
        </code>
        . Оценка кроликов и рекомендации пересчитываются сразу.
      </p>

      <div className="slider-field">
        <div className="slider-field__header">
          <label htmlFor="carrot-weight">Пропажа морковки</label>
          <span className="slider-field__value">
            {params.missingCarrotWeight.toFixed(1)}
          </span>
        </div>
        <input
          id="carrot-weight"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={params.missingCarrotWeight}
          onChange={(event) =>
            updateParams({ missingCarrotWeight: Number(event.target.value) })
          }
        />
      </div>

      <div className="slider-field">
        <div className="slider-field__header">
          <label htmlFor="hole-weight">Новая ямка</label>
          <span className="slider-field__value">{params.newHoleWeight.toFixed(1)}</span>
        </div>
        <input
          id="hole-weight"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={params.newHoleWeight}
          onChange={(event) =>
            updateParams({ newHoleWeight: Number(event.target.value) })
          }
        />
      </div>

      <div className="slider-field">
        <div className="slider-field__header">
          <label htmlFor="motion-weight">Датчик движения</label>
          <span className="slider-field__value">
            {params.motionSensorWeight.toFixed(1)}
          </span>
        </div>
        <input
          id="motion-weight"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={params.motionSensorWeight}
          onChange={(event) =>
            updateParams({ motionSensorWeight: Number(event.target.value) })
          }
        />
      </div>

      <div className="slider-field">
        <div className="slider-field__header">
          <label htmlFor="rustling-weight">Шуршание в сарае</label>
          <span className="slider-field__value">{params.rustlingWeight.toFixed(1)}</span>
        </div>
        <input
          id="rustling-weight"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={params.rustlingWeight}
          onChange={(event) =>
            updateParams({ rustlingWeight: Number(event.target.value) })
          }
        />
      </div>

      <div className="slider-field">
        <div className="slider-field__header">
          <label htmlFor="intensity-factor">Множитель интенсивности</label>
          <span className="slider-field__value">{params.intensityFactor.toFixed(1)}</span>
        </div>
        <input
          id="intensity-factor"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={params.intensityFactor}
          onChange={(event) =>
            updateParams({ intensityFactor: Number(event.target.value) })
          }
        />
      </div>

      <div className="factor-legend">
        <span className="tag">count</span>
        <span className="tag tag--warning">intensity (1–10)</span>
        <span className="tag">тип сигнала</span>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="button"
          onClick={() => setParams(DEFAULT_ESTIMATION_PARAMS)}
        >
          Сбросить параметры
        </button>
      </div>
    </section>
  )
}
