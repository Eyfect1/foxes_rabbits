import { initialSignals } from '../data/initialSignals'
import type { SignalEvent } from '../types'

export const SIGNALS_STORAGE_KEY = 'rabbit-farm-signals'

export function loadSignals(): SignalEvent[] {
  if (typeof window === 'undefined') {
    return initialSignals
  }

  try {
    const raw = window.localStorage.getItem(SIGNALS_STORAGE_KEY)

    if (!raw) {
      return initialSignals
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return initialSignals
    }

    return parsed as SignalEvent[]
  } catch {
    return initialSignals
  }
}

export function saveSignals(signals: SignalEvent[]): void {
  window.localStorage.setItem(SIGNALS_STORAGE_KEY, JSON.stringify(signals))
}

export function clearSignalsStorage(): void {
  window.localStorage.removeItem(SIGNALS_STORAGE_KEY)
}
