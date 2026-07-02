import { useCallback, useEffect, useMemo, useState } from 'react'
import { initialSignals } from '../data/initialSignals'
import {
  applyFilters,
  computeFarmEstimation,
  getLocationStats,
  getSignalTypeStats,
} from '../lib/analytics'
import {
  createSignalId,
  parseSignalsJson,
  validateSignal,
} from '../lib/signals'
import {
  clearSignalsStorage,
  loadSignals,
  saveSignals,
} from '../lib/signalStorage'
import type {
  EstimationParams,
  FarmEstimation,
  LocationStats,
  SignalEvent,
  SignalFilters,
  SignalTypeStats,
} from '../types'
import {
  DEFAULT_ESTIMATION_PARAMS,
  EMPTY_SIGNAL_FILTERS,
} from '../types'

export interface UseSignalsResult {
  signals: SignalEvent[]
  filteredSignals: SignalEvent[]
  params: EstimationParams
  filters: SignalFilters
  estimation: FarmEstimation
  locationStats: LocationStats[]
  signalTypeStats: SignalTypeStats[]
  activeFilterCount: number
  setParams: (params: EstimationParams) => void
  updateParams: (patch: Partial<EstimationParams>) => void
  setFilters: (filters: SignalFilters) => void
  updateFilters: (patch: Partial<SignalFilters>) => void
  resetFilters: () => void
  addSignal: (signal: Omit<SignalEvent, 'id'> & { id?: string }) => string | null
  updateSignal: (
    id: string,
    patch: Partial<Omit<SignalEvent, 'id'>>,
  ) => string | null
  deleteSignal: (id: string) => void
  resetSignals: () => void
  importSignals: (json: string) => string | null
  error: string | null
  clearError: () => void
}

export function useSignals(): UseSignalsResult {
  const [signals, setSignals] = useState<SignalEvent[]>(loadSignals)
  const [params, setParams] = useState<EstimationParams>(DEFAULT_ESTIMATION_PARAMS)
  const [filters, setFilters] = useState<SignalFilters>(EMPTY_SIGNAL_FILTERS)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    saveSignals(signals)
  }, [signals])

  const filteredSignals = useMemo(
    () => applyFilters(signals, filters),
    [signals, filters],
  )

  const estimation = useMemo(
    () => computeFarmEstimation(filteredSignals, params),
    [filteredSignals, params],
  )

  const locationStats = useMemo(
    () => getLocationStats(filteredSignals, params),
    [filteredSignals, params],
  )

  const signalTypeStats = useMemo(
    () => getSignalTypeStats(filteredSignals, params),
    [filteredSignals, params],
  )

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((value) => value !== null).length
  }, [filters])

  const updateParams = useCallback((patch: Partial<EstimationParams>) => {
    setParams((current) => ({ ...current, ...patch }))
  }, [])

  const updateFilters = useCallback((patch: Partial<SignalFilters>) => {
    setFilters((current) => ({ ...current, ...patch }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_SIGNAL_FILTERS)
  }, [])

  const addSignal = useCallback(
    (signal: Omit<SignalEvent, 'id'> & { id?: string }) => {
      const nextSignal: SignalEvent = {
        ...signal,
        id: signal.id ?? createSignalId(),
      }

      const validationError = validateSignal(nextSignal)

      if (validationError) {
        setError(validationError)
        return validationError
      }

      setSignals((current) => [...current, nextSignal])
      return null
    },
    [],
  )

  const updateSignal = useCallback(
    (id: string, patch: Partial<Omit<SignalEvent, 'id'>>) => {
      const currentSignal = signals.find((signal) => signal.id === id)

      if (!currentSignal) {
        const message = 'Сигнал не найден'
        setError(message)
        return message
      }

      const nextSignal: SignalEvent = {
        ...currentSignal,
        ...patch,
        id,
      }

      const validationError = validateSignal(nextSignal)

      if (validationError) {
        setError(validationError)
        return validationError
      }

      setSignals((current) =>
        current.map((signal) => (signal.id === id ? nextSignal : signal)),
      )
      return null
    },
    [signals],
  )

  const deleteSignal = useCallback((id: string) => {
    setSignals((current) => current.filter((signal) => signal.id !== id))
  }, [])

  const resetSignals = useCallback(() => {
    clearSignalsStorage()
    setSignals(initialSignals)
    setFilters(EMPTY_SIGNAL_FILTERS)
    setError(null)
  }, [])

  const importSignals = useCallback((json: string) => {
    const result = parseSignalsJson(json)

    if ('error' in result) {
      setError(result.error)
      return result.error
    }

    setSignals(result.signals)
    setFilters(EMPTY_SIGNAL_FILTERS)
    setError(null)
    return null
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    signals,
    filteredSignals,
    params,
    filters,
    estimation,
    locationStats,
    signalTypeStats,
    activeFilterCount,
    setParams,
    updateParams,
    setFilters,
    updateFilters,
    resetFilters,
    addSignal,
    updateSignal,
    deleteSignal,
    resetSignals,
    importSignals,
    error,
    clearError,
  }
}
