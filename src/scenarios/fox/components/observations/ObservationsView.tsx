import { useState } from 'react'
import type { Observation } from '../../types'
import { DataControls } from './DataControls'
import { ObservationFiltersPanel } from './ObservationFiltersPanel'
import { ObservationForm } from './ObservationForm'
import { ObservationsTable } from './ObservationsTable'

type FormMode = 'closed' | 'add' | 'edit'

export function ObservationsView() {
  const [formMode, setFormMode] = useState<FormMode>('closed')
  const [editingObservation, setEditingObservation] =
    useState<Observation | null>(null)

  const openAddForm = () => {
    setEditingObservation(null)
    setFormMode('add')
  }

  const openEditForm = (observation: Observation) => {
    setEditingObservation(observation)
    setFormMode('edit')
  }

  const closeForm = () => {
    setFormMode('closed')
    setEditingObservation(null)
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="panel__header-row">
          <div>
            <h2 className="panel__title">Журнал наблюдений</h2>
            <p className="panel__hint panel__hint--inline">
              Добавляйте, редактируйте и удаляйте записи. Отчёт на других вкладках
              обновится автоматически.
            </p>
          </div>
          {formMode === 'closed' && (
            <button
              type="button"
              className="button button--primary button--block-mobile"
              onClick={openAddForm}
            >
              Добавить наблюдение
            </button>
          )}
        </div>
      </section>

      {formMode !== 'closed' && (
        <ObservationForm
          key={editingObservation?.id ?? 'new'}
          editingObservation={formMode === 'edit' ? editingObservation : null}
          onCancel={closeForm}
          onSaved={closeForm}
        />
      )}

      <ObservationFiltersPanel />
      <ObservationsTable onEdit={openEditForm} />
      <DataControls />
    </div>
  )
}
