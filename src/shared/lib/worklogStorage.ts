import type { WorklogCheckpoint, WorklogState } from '../types/worklog'

export const FOX_WORKLOG_STORAGE_KEY = 'fox-dispatcher-worklog'
export const RABBITS_WORKLOG_STORAGE_KEY = 'rabbit-farm-worklog'
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

export function createEmptyWorklogState(): WorklogState {
  return { checkpoints: [] }
}

export function normalizeWorklogState(state: WorklogState): WorklogState {
  if (!Array.isArray(state.checkpoints)) {
    return createEmptyWorklogState()
  }

  return {
    checkpoints: state.checkpoints.map((checkpoint, index) => ({
      id: checkpoint.id,
      title: checkpoint.title ?? '',
      content: checkpoint.content ?? '',
      createdAt: checkpoint.createdAt ?? new Date().toISOString(),
      order: checkpoint.order ?? index,
      images: Array.isArray(checkpoint.images)
        ? checkpoint.images.map((image) => ({
            id: image.id,
            name: image.name ?? 'screenshot',
            dataUrl: image.dataUrl,
            addedAt: image.addedAt ?? new Date().toISOString(),
          }))
        : [],
    })),
  }
}

export function loadWorklogState(
  storageKey: string,
  seedState: WorklogState,
): WorklogState {
  if (typeof window === 'undefined') {
    return normalizeWorklogState(seedState)
  }

  try {
    const raw = window.localStorage.getItem(storageKey)

    if (!raw) {
      return normalizeWorklogState(seedState)
    }

    const parsed = JSON.parse(raw) as WorklogState
    return normalizeWorklogState(parsed)
  } catch {
    return normalizeWorklogState(seedState)
  }
}

export function saveWorklogState(storageKey: string, state: WorklogState): void {
  window.localStorage.setItem(storageKey, JSON.stringify(state))
}

export function clearWorklogStorage(storageKey: string): void {
  window.localStorage.removeItem(storageKey)
}

export function sortCheckpoints(
  checkpoints: WorklogCheckpoint[],
): WorklogCheckpoint[] {
  return [...checkpoints].sort((left, right) => left.order - right.order)
}

export function createCheckpoint(order: number): WorklogCheckpoint {
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    images: [],
    createdAt: new Date().toISOString(),
    order,
  }
}
