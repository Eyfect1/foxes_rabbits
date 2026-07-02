import { useMemo, useState, type FormEvent } from 'react'
import { createEmptyObservation, validateObservation } from '../../lib/observations'
import type { Observation } from '../../types'
import { useObservationsContext } from '../../context/ObservationsContext'

interface ObservationFormProps {
  editingObservation: Observation | null
  onCancel: () => void
  onSaved: () => void
}

export function ObservationForm({
  editingObservation,
  onCancel,
  onSaved,
}: ObservationFormProps) {
  const { observations, addObservation, updateObservation } =
    useObservationsContext()
  const isEditing = editingObservation !== null

  const [form, setForm] = useState<Observation>(() =>
    editingObservation ? { ...editingObservation } : createEmptyObservation(),
  )
  const [error, setError] = useState<string | null>(null)

  const suggestions = useMemo(() => {
    const foxIds = [...new Set(observations.map((o) => o.fox_id))].sort()
    const locations = [...new Set(observations.map((o) => o.location))].sort()
    const colors = [...new Set(observations.map((o) => o.color))].sort()

    return { foxIds, locations, colors }
  }, [observations])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const validationError = validateObservation(form)

    if (validationError) {
      setError(validationError)
      return
    }

    const saveError = isEditing
      ? updateObservation(form.id, {
          fox_id: form.fox_id.trim(),
          location: form.location.trim(),
          color: form.color.trim(),
          has_prey: form.has_prey,
          suspicion_level: form.suspicion_level,
          time: form.time.trim(),
        })
      : addObservation({
          fox_id: form.fox_id.trim(),
          location: form.location.trim(),
          color: form.color.trim(),
          has_prey: form.has_prey,
          suspicion_level: form.suspicion_level,
          time: form.time.trim(),
        })

    if (saveError) {
      setError(saveError)
      return
    }

    onSaved()
  }

  return (
    <section className="panel panel--form">
      <h2 className="panel__title">
        {isEditing ? 'Редактировать наблюдение' : 'Новое наблюдение'}
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
            <label htmlFor="obs-fox-id">ID лисы</label>
            <input
              id="obs-fox-id"
              type="text"
              list="fox-id-suggestions"
              value={form.fox_id}
              placeholder="fox_001"
              onChange={(event) =>
                setForm((current) => ({ ...current, fox_id: event.target.value }))
              }
            />
            <datalist id="fox-id-suggestions">
              {suggestions.foxIds.map((foxId) => (
                <option key={foxId} value={foxId} />
              ))}
            </datalist>
          </div>

          <div className="field">
            <label htmlFor="obs-time">Время (ЧЧ:ММ)</label>
            <input
              id="obs-time"
              type="text"
              value={form.time}
              placeholder="08:30"
              onChange={(event) =>
                setForm((current) => ({ ...current, time: event.target.value }))
              }
            />
          </div>

          <div className="field">
            <label htmlFor="obs-location">Локация</label>
            <input
              id="obs-location"
              type="text"
              list="location-suggestions"
              value={form.location}
              placeholder="Северная поляна"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
            />
            <datalist id="location-suggestions">
              {suggestions.locations.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>

          <div className="field">
            <label htmlFor="obs-color">Цвет</label>
            <input
              id="obs-color"
              type="text"
              list="color-suggestions"
              value={form.color}
              placeholder="рыжая"
              onChange={(event) =>
                setForm((current) => ({ ...current, color: event.target.value }))
              }
            />
            <datalist id="color-suggestions">
              {suggestions.colors.map((color) => (
                <option key={color} value={color} />
              ))}
            </datalist>
          </div>

          <div className="field">
            <label htmlFor="obs-suspicion">Подозрительность (1–10)</label>
            <input
              id="obs-suspicion"
              type="number"
              min="1"
              max="10"
              value={form.suspicion_level}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  suspicion_level: Number(event.target.value),
                }))
              }
            />
          </div>

          <div className="field field--checkbox">
            <label htmlFor="obs-prey">
              <input
                id="obs-prey"
                type="checkbox"
                checked={form.has_prey}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    has_prey: event.target.checked,
                  }))
                }
              />
              Замечена с добычей
            </label>
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
