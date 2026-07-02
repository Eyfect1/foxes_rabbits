import { useState } from 'react'
import { useSignalsContext } from '../../context/SignalsContext'

export function DataControls() {
  const {
    signals,
    filteredSignals,
    activeFilterCount,
    resetSignals,
    importSignals,
    error,
    clearError,
  } = useSignalsContext()
  const [jsonInput, setJsonInput] = useState('')

  return (
    <section className="panel">
      <h2 className="panel__title">Управление данными</h2>
      <p className="panel__hint">
        Всего сигналов: {signals.length}. В отчёте сейчас: {filteredSignals.length}
        {activeFilterCount > 0 ? ` (активных фильтров: ${activeFilterCount})` : ''}.
        Данные сохраняются в браузере.
      </p>

      {error && (
        <div className="alert" role="alert">
          <span>{error}</span>
          <button type="button" className="button" onClick={clearError}>
            Закрыть
          </button>
        </div>
      )}

      <div className="field">
        <label htmlFor="signals-import">Импорт JSON</label>
        <textarea
          id="signals-import"
          value={jsonInput}
          placeholder='[{"id":"evt_001","event":"missing_carrot",...}]'
          aria-describedby="signals-import-hint"
          onChange={(event) => setJsonInput(event.target.value)}
        />
        <p id="signals-import-hint" className="field-hint">
          Ожидается массив объектов с полями id, event (missing_carrot | new_hole |
          motion_sensor | rustling), location, count (≥ 1), intensity (1–10), time
          (ЧЧ:ММ).
        </p>
      </div>

      <div className="button-row button-row--stack-mobile">
        <button
          type="button"
          className="button button--primary"
          disabled={!jsonInput.trim()}
          onClick={() => {
            const importError = importSignals(jsonInput)

            if (!importError) {
              setJsonInput('')
            }
          }}
        >
          Импортировать
        </button>
        <button
          type="button"
          className="button"
          onClick={() => {
            setJsonInput(JSON.stringify(signals, null, 2))
          }}
        >
          Экспорт в поле
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={() => {
            if (
              window.confirm('Сбросить сигналы к стартовым данным из ТЗ?')
            ) {
              resetSignals()
              setJsonInput('')
            }
          }}
        >
          Сбросить к стартовым
        </button>
      </div>
    </section>
  )
}
