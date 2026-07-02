import { useMemo, useState, type FormEvent } from 'react'
import { createEmptySignal, validateSignal } from '../../lib/signals'
import { getEventTypeLabel } from '../../lib/eventTypes'
import type { SignalEvent, SignalEventType } from '../../types'
import { SIGNAL_EVENT_TYPES } from '../../types'
import { useSignalsContext } from '../../context/SignalsContext'

interface SignalFormProps {
  editingSignal: SignalEvent | null
  onCancel: () => void
  onSaved: () => void
}

export function SignalForm({ editingSignal, onCancel, onSaved }: SignalFormProps) {
  const { signals, addSignal, updateSignal } = useSignalsContext()
  const isEditing = editingSignal !== null

  const [form, setForm] = useState<SignalEvent>(() =>
    editingSignal ? { ...editingSignal } : createEmptySignal(),
  )
  const [error, setError] = useState<string | null>(null)

  const locationSuggestions = useMemo(() => {
    return [...new Set(signals.map((signal) => signal.location))].sort()
  }, [signals])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const validationError = validateSignal(form)

    if (validationError) {
      setError(validationError)
      return
    }

    const payload = {
      event: form.event,
      location: form.location.trim(),
      count: form.count,
      intensity: form.intensity,
      time: form.time.trim(),
    }

    const saveError = isEditing
      ? updateSignal(form.id, payload)
      : addSignal(payload)

    if (saveError) {
      setError(saveError)
      return
    }

    onSaved()
  }

  return (
    <section className="panel panel--form">
      <h2 className="panel__title">
        {isEditing ? 'Редактировать сигнал' : 'Новый сигнал'}
      </h2>

      {error && (
        <div className="alert" role="alert">
          <span>{error}</span>
          <button type="button" className="button" onClick={() => setError(null)}>
            Закрыть
          </button>
        </div>
      )}

      <form className="observation-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="signal-event">Тип сигнала</label>
            <select
              id="signal-event"
              value={form.event}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  event: event.target.value as SignalEventType,
                }))
              }
            >
              {SIGNAL_EVENT_TYPES.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {getEventTypeLabel(eventType)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="signal-time">Время (ЧЧ:ММ)</label>
            <input
              id="signal-time"
              type="text"
              value={form.time}
              placeholder="08:30"
              onChange={(event) =>
                setForm((current) => ({ ...current, time: event.target.value }))
              }
            />
          </div>

          <div className="field">
            <label htmlFor="signal-location">Локация</label>
            <input
              id="signal-location"
              type="text"
              list="signal-location-suggestions"
              value={form.location}
              placeholder="Огород"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
            />
            <datalist id="signal-location-suggestions">
              {locationSuggestions.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>

          <div className="field">
            <label htmlFor="signal-count">Количество</label>
            <input
              id="signal-count"
              type="number"
              min="1"
              step="1"
              value={form.count}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  count: Number(event.target.value),
                }))
              }
            />
          </div>

          <div className="field">
            <label htmlFor="signal-intensity">Интенсивность (1–10)</label>
            <input
              id="signal-intensity"
              type="number"
              min="1"
              max="10"
              value={form.intensity}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  intensity: Number(event.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="button-row">
          <button type="submit" className="button button--primary">
            {isEditing ? 'Сохранить' : 'Добавить'}
          </button>
          <button type="button" className="button" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </section>
  )
}
