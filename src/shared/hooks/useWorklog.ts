import { useCallback, useEffect, useState } from 'react'
import type { WorklogCheckpoint, WorklogImage, WorklogState } from '../types/worklog'
import { downloadWorklogSeed } from '../lib/worklogExport'
import {
  clearWorklogStorage,
  createCheckpoint,
  loadWorklogState,
  MAX_IMAGE_SIZE_BYTES,
  normalizeWorklogState,
  saveWorklogState,
  sortCheckpoints,
} from '../lib/worklogStorage'

interface UseWorklogOptions {
  storageKey: string
  seedState: WorklogState
  exportFileName: string
}

interface UseWorklogResult {
  checkpoints: WorklogCheckpoint[]
  addCheckpoint: () => void
  updateCheckpoint: (
    id: string,
    patch: Partial<Pick<WorklogCheckpoint, 'title' | 'content'>>,
  ) => void
  removeCheckpoint: (id: string) => void
  addImagesToCheckpoint: (id: string, files: FileList | File[]) => Promise<string[]>
  removeImageFromCheckpoint: (checkpointId: string, imageId: string) => void
  moveCheckpoint: (id: string, direction: 'up' | 'down') => void
  resetToSeed: () => void
  exportForDeploy: () => void
  error: string | null
  clearError: () => void
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error(`Не удалось прочитать файл ${file.name}`))
    reader.readAsDataURL(file)
  })
}

export function useWorklog({
  storageKey,
  seedState,
  exportFileName,
}: UseWorklogOptions): UseWorklogResult {
  const normalizedSeed = normalizeWorklogState(seedState)

  const [checkpoints, setCheckpoints] = useState<WorklogCheckpoint[]>(() =>
    sortCheckpoints(loadWorklogState(storageKey, normalizedSeed).checkpoints),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    saveWorklogState(storageKey, { checkpoints })
  }, [checkpoints, storageKey])

  const addCheckpoint = useCallback(() => {
    setCheckpoints((current) => {
      const nextOrder =
        current.length === 0
          ? 0
          : Math.max(...current.map((checkpoint) => checkpoint.order)) + 1

      return sortCheckpoints([...current, createCheckpoint(nextOrder)])
    })
  }, [])

  const updateCheckpoint = useCallback(
    (
      id: string,
      patch: Partial<Pick<WorklogCheckpoint, 'title' | 'content'>>,
    ) => {
      setCheckpoints((current) =>
        current.map((checkpoint) =>
          checkpoint.id === id ? { ...checkpoint, ...patch } : checkpoint,
        ),
      )
    },
    [],
  )

  const removeCheckpoint = useCallback((id: string) => {
    setCheckpoints((current) => current.filter((checkpoint) => checkpoint.id !== id))
  }, [])

  const addImagesToCheckpoint = useCallback(
    async (id: string, files: FileList | File[]) => {
      const rejected: string[] = []
      const fileList = Array.from(files)

      const newImages: WorklogImage[] = []

      for (const file of fileList) {
        if (!file.type.startsWith('image/')) {
          rejected.push(`${file.name}: допустимы только изображения`)
          continue
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          rejected.push(
            `${file.name}: размер превышает ${Math.round(MAX_IMAGE_SIZE_BYTES / (1024 * 1024))} МБ`,
          )
          continue
        }

        try {
          const dataUrl = await readFileAsDataUrl(file)
          newImages.push({
            id: crypto.randomUUID(),
            name: file.name,
            dataUrl,
            addedAt: new Date().toISOString(),
          })
        } catch {
          rejected.push(`${file.name}: ошибка чтения`)
        }
      }

      if (newImages.length > 0) {
        setCheckpoints((current) =>
          current.map((checkpoint) =>
            checkpoint.id === id
              ? { ...checkpoint, images: [...checkpoint.images, ...newImages] }
              : checkpoint,
          ),
        )
      }

      if (rejected.length > 0) {
        setError(rejected.join('; '))
      }

      return rejected
    },
    [],
  )

  const removeImageFromCheckpoint = useCallback(
    (checkpointId: string, imageId: string) => {
      setCheckpoints((current) =>
        current.map((checkpoint) =>
          checkpoint.id === checkpointId
            ? {
                ...checkpoint,
                images: checkpoint.images.filter((image) => image.id !== imageId),
              }
            : checkpoint,
        ),
      )
    },
    [],
  )

  const moveCheckpoint = useCallback((id: string, direction: 'up' | 'down') => {
    setCheckpoints((current) => {
      const sorted = sortCheckpoints(current)
      const index = sorted.findIndex((checkpoint) => checkpoint.id === id)

      if (index === -1) {
        return current
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1

      if (targetIndex < 0 || targetIndex >= sorted.length) {
        return current
      }

      const reordered = [...sorted]
      const currentOrder = reordered[index].order
      reordered[index] = {
        ...reordered[index],
        order: reordered[targetIndex].order,
      }
      reordered[targetIndex] = {
        ...reordered[targetIndex],
        order: currentOrder,
      }

      return sortCheckpoints(reordered)
    })
  }, [])

  const resetToSeed = useCallback(() => {
    clearWorklogStorage(storageKey)
    setCheckpoints(sortCheckpoints(normalizedSeed.checkpoints))
    setError(null)
  }, [normalizedSeed.checkpoints, storageKey])

  const exportForDeploy = useCallback(() => {
    downloadWorklogSeed({ checkpoints }, exportFileName)
  }, [checkpoints, exportFileName])

  const clearError = useCallback(() => setError(null), [])

  return {
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
  }
}
