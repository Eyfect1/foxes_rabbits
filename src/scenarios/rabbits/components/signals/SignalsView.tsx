import { useState } from 'react'
import type { SignalEvent } from '../../types'
import { ActiveFiltersBanner } from '../dashboard/ActiveFiltersBanner'
import { SignalFiltersPanel } from './SignalFiltersPanel'
import { SignalForm } from './SignalForm'
import { SignalsTable } from './SignalsTable'
import { DataControls } from '../data/DataControls'

type FormMode = 'closed' | 'add' | 'edit'

export function SignalsView() {
  const [formMode, setFormMode] = useState<FormMode>('closed')
  const [editingSignal, setEditingSignal] = useState<SignalEvent | null>(null)

  const openAddForm = () => {
    setEditingSignal(null)
    setFormMode('add')
  }

  const openEditForm = (signal: SignalEvent) => {
    setEditingSignal(signal)
    setFormMode('edit')
  }

  const closeForm = () => {
    setFormMode('closed')
    setEditingSignal(null)
  }

  return (
    <div className="page-grid">
      <ActiveFiltersBanner />

      <section className="panel">
        <div className="panel__header-row">
          <div>
            <h2 className="panel__title">Косвенные сигналы</h2>
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
              Добавить сигнал
            </button>
          )}
        </div>
      </section>

      {formMode !== 'closed' && (
        <SignalForm
          key={editingSignal?.id ?? 'new'}
          editingSignal={formMode === 'edit' ? editingSignal : null}
          onCancel={closeForm}
          onSaved={closeForm}
        />
      )}

      <SignalFiltersPanel />
      <SignalsTable onEdit={openEditForm} />
      <DataControls />
    </div>
  )
}
