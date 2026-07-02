import { useState } from 'react'
import { useObservationsContext } from '../../context/ObservationsContext'

export function DataControls() {
  const {
    observations,
    filteredObservations,
    activeFilterCount,
    resetObservations,
    importObservations,
    error,
    clearError,
  } = useObservationsContext()
  const [jsonInput, setJsonInput] = useState('')

  return (
    <section className="panel">
      <h2 className="panel__title">Управление данными</h2>
      <p className="panel__hint">
        Всего наблюдений: {observations.length}. В отчёте сейчас:{' '}
        {filteredObservations.length}
        {activeFilterCount > 0 ? ` (активных фильтров: ${activeFilterCount})` : ''}.
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
        <label htmlFor="observations-import">Импорт JSON</label>
        <textarea
          id="observations-import"
          value={jsonInput}
          placeholder='[{"id":"obs_001","fox_id":"fox_001",...}]'
          aria-describedby="import-hint"
          onChange={(event) => setJsonInput(event.target.value)}
        />
        <p id="import-hint" className="field-hint">
          Ожидается массив объектов с полями id, fox_id, location, color,
          has_prey, suspicion_level (1–10), time (ЧЧ:ММ).
        </p>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="button button--primary"
          disabled={!jsonInput.trim()}
          onClick={() => {
            const importError = importObservations(jsonInput)

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
            setJsonInput(JSON.stringify(observations, null, 2))
          }}
        >
          Экспорт в поле
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={() => {
            if (
              window.confirm(
                'Сбросить наблюдения к стартовым данным из ТЗ?',
              )
            ) {
              resetObservations()
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
