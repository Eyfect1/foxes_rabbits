import { initialObservations } from '../data/initialObservations'
import type { Observation } from '../types'

export const OBSERVATIONS_STORAGE_KEY = 'fox-dispatcher-observations'

export function loadObservations(): Observation[] {
  if (typeof window === 'undefined') {
    return initialObservations
  }

  try {
    const raw = window.localStorage.getItem(OBSERVATIONS_STORAGE_KEY)

    if (!raw) {
      return initialObservations
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return initialObservations
    }

    return parsed as Observation[]
  } catch {
    return initialObservations
  }
}

export function saveObservations(observations: Observation[]): void {
  window.localStorage.setItem(
    OBSERVATIONS_STORAGE_KEY,
    JSON.stringify(observations),
  )
}

export function clearObservationsStorage(): void {
  window.localStorage.removeItem(OBSERVATIONS_STORAGE_KEY)
}
