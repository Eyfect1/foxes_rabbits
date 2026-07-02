import type { WorklogState } from '../types/worklog'
import { useWorklog } from '../hooks/useWorklog'
import { CheckpointCard } from './CheckpointCard'
import { EmptyState } from '../components/ui/EmptyState'

interface WorklogSectionProps {
  scenarioTitle: string
  storageKey: string
  seedState: WorklogState
  exportFileName: string
  seedFilePath: string
}

export function WorklogSection({
  scenarioTitle,
  storageKey,
  seedState,
  exportFileName,
  seedFilePath,
}: WorklogSectionProps) {
  const {
    checkpoints,
    addCheckpoint,
    updateCheckpoint,
    removeCheckpoint,
    addImagesToCheckpoint,
    removeImageFromCheckpoint,
    moveCheckpoint,
    resetToSeed,
    exportForDeploy,
    error,
    clearError,
  } = useWorklog({ storageKey, seedState, exportFileName })

  const handleResetToSeed = () => {
    if (
      window.confirm(
        'Загрузить встроенный worklog из проекта? Локальные правки в этом браузере будут заменены.',
      )
    ) {
      resetToSeed()
    }
  }

  return (
    <section className="panel">
      <h2 className="panel__title">AI Worklog</h2>
      <p className="panel__hint">
        Как я работал(а) с AI над сценарием «{scenarioTitle}». При первом открытии
        сайта показывается встроенный worklog из репозитория — его увидят и другие
        люди после деплоя. Локальные правки сохраняются только в вашем браузере.
      </p>

      <details className="worklog-deploy-hint">
        <summary>Как обновить worklog для всех пользователей</summary>
        <ol className="worklog-deploy-hint__list">
          <li>Заполните чекпоинты и прикрепите скриншоты.</li>
          <li>Нажмите «Экспорт для деплоя» — скачается JSON.</li>
          <li>
            Скопируйте содержимое JSON в объект <code>initialWorklog</code> в файле{' '}
            <code>{seedFilePath}</code>.
          </li>
          <li>Закоммитьте изменения и задеплойте проект заново.</li>
        </ol>
      </details>

      {error && (
        <div className="alert" role="alert">
          <span>{error}</span>
          <button type="button" className="button" onClick={clearError}>
            Закрыть
          </button>
        </div>
      )}

      {checkpoints.length === 0 ? (
        <EmptyState title="Пока нет чекпоинтов">
          Добавьте первый чекпоинт или встройте готовый worklog через экспорт и файл{' '}
          <code>{seedFilePath}</code>.
        </EmptyState>
      ) : (
        checkpoints.map((checkpoint, index) => (
          <CheckpointCard
            key={checkpoint.id}
            checkpoint={checkpoint}
            index={index}
            onUpdate={updateCheckpoint}
            onRemove={removeCheckpoint}
            onMove={moveCheckpoint}
            onAddImages={(id, files) => {
              void addImagesToCheckpoint(id, files)
            }}
            onRemoveImage={removeImageFromCheckpoint}
            canMoveUp={index > 0}
            canMoveDown={index < checkpoints.length - 1}
          />
        ))
      )}

      <div className="button-row button-row--stack-mobile button-row--spaced">
        <button type="button" className="button button--primary" onClick={addCheckpoint}>
          Добавить чекпоинт
        </button>
        <button type="button" className="button" onClick={exportForDeploy}>
          Экспорт для деплоя
        </button>
        <button type="button" className="button" onClick={handleResetToSeed}>
          Встроенный worklog
        </button>
      </div>
    </section>
  )
}
