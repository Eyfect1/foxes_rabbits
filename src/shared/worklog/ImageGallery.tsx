import { useState } from 'react'
import type { WorklogImage } from '../types/worklog'

interface ImageGalleryProps {
  images: WorklogImage[]
  onRemove: (imageId: string) => void
}

export function ImageGallery({ images, onRemove }: ImageGalleryProps) {
  const [preview, setPreview] = useState<WorklogImage | null>(null)

  if (images.length === 0) {
    return null
  }

  return (
    <>
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-thumb">
            <img src={image.dataUrl} alt={image.name} />
            <div className="image-thumb__actions">
              <button type="button" onClick={() => setPreview(image)}>
                Открыть
              </button>
              <button type="button" onClick={() => onRemove(image.id)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр изображения"
          onClick={() => setPreview(null)}
        >
          <button type="button" className="button" onClick={() => setPreview(null)}>
            Закрыть
          </button>
          <img src={preview.dataUrl} alt={preview.name} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </>
  )
}
