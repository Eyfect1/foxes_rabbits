import type { WorklogCheckpoint } from '../types/worklog'
import { ImageGallery } from './ImageGallery'
import { ImageUploader } from './ImageUploader'

interface CheckpointCardProps {
  checkpoint: WorklogCheckpoint
  index: number
  onUpdate: (
    id: string,
    patch: Partial<Pick<WorklogCheckpoint, 'title' | 'content'>>,
  ) => void
  onRemove: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
  onAddImages: (id: string, files: FileList) => void
  onRemoveImage: (checkpointId: string, imageId: string) => void
  canMoveUp: boolean
  canMoveDown: boolean
}

export function CheckpointCard({
  checkpoint,
  index,
  onUpdate,
  onRemove,
  onMove,
  onAddImages,
  onRemoveImage,
  canMoveUp,
  canMoveDown,
}: CheckpointCardProps) {
  return (
    <article className="checkpoint-card">
      <div className="checkpoint-card__header">
        <span className="checkpoint-card__index">Чекпоинт {index + 1}</span>
        <div className="button-row">
          <button
            type="button"
            className="button"
            disabled={!canMoveUp}
            onClick={() => onMove(checkpoint.id, 'up')}
          >
            Выше
          </button>
          <button
            type="button"
            className="button"
            disabled={!canMoveDown}
            onClick={() => onMove(checkpoint.id, 'down')}
          >
            Ниже
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={() => onRemove(checkpoint.id)}
          >
            Удалить
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor={`checkpoint-title-${checkpoint.id}`}>Заголовок</label>
        <input
          id={`checkpoint-title-${checkpoint.id}`}
          type="text"
          value={checkpoint.title}
          placeholder="Например: первая формулировка задачи для AI"
          onChange={(event) =>
            onUpdate(checkpoint.id, { title: event.target.value })
          }
        />
      </div>

      <div className="field">
        <label htmlFor={`checkpoint-content-${checkpoint.id}`}>Описание</label>
        <textarea
          id={`checkpoint-content-${checkpoint.id}`}
          value={checkpoint.content}
          placeholder="Что сделали, какие решения приняли, что проверили..."
          onChange={(event) =>
            onUpdate(checkpoint.id, { content: event.target.value })
          }
        />
      </div>

      <ImageUploader onSelect={(files) => onAddImages(checkpoint.id, files)} />
      <ImageGallery
        images={checkpoint.images}
        onRemove={(imageId) => onRemoveImage(checkpoint.id, imageId)}
      />
    </article>
  )
}
