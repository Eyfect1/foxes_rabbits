import { useCallback, useEffect, useMemo, useState } from 'react'
import { initialObservations } from '../data/initialObservations'
import {
  applyFilters,
  getFoxSummaries,
  getLocationStats,
  getMostSuspiciousFox,
  getUniqueFoxCount,
} from '../lib/analytics'
import {
  createObservationId,
  parseObservationsJson,
  validateObservation,
} from '../lib/observations'
import {
  clearObservationsStorage,
  loadObservations,
  saveObservations,
} from '../lib/observationStorage'
import type {
  FoxSummary,
  LocationStats,
  Observation,
  ObservationFilters,
  SuspicionParams,
} from '../types'
import {
  DEFAULT_SUSPICION_PARAMS,
  EMPTY_OBSERVATION_FILTERS,
} from '../types'

export interface UseObservationsResult {
  observations: Observation[]
  filteredObservations: Observation[]
  params: SuspicionParams
  filters: ObservationFilters
  uniqueFoxCount: number
  locationStats: LocationStats[]
  foxSummaries: FoxSummary[]
  topFox: FoxSummary | null
  activeFilterCount: number
  setParams: (params: SuspicionParams) => void
  updateParams: (patch: Partial<SuspicionParams>) => void
  setFilters: (filters: ObservationFilters) => void
  updateFilters: (patch: Partial<ObservationFilters>) => void
  resetFilters: () => void
  addObservation: (
    observation: Omit<Observation, 'id'> & { id?: string },
  ) => string | null
  updateObservation: (
    id: string,
    patch: Partial<Omit<Observation, 'id'>>,
  ) => string | null
  deleteObservation: (id: string) => void
  resetObservations: () => void
  importObservations: (json: string) => string | null
  error: string | null
  clearError: () => void
}

export function useObservations(): UseObservationsResult {
  const [observations, setObservations] = useState<Observation[]>(loadObservations)
  const [params, setParams] = useState<SuspicionParams>(DEFAULT_SUSPICION_PARAMS)
  const [filters, setFilters] = useState<ObservationFilters>(
    EMPTY_OBSERVATION_FILTERS,
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    saveObservations(observations)
  }, [observations])

  const filteredObservations = useMemo(
    () => applyFilters(observations, filters),
    [observations, filters],
  )

  const foxSummaries = useMemo(
    () => getFoxSummaries(filteredObservations, params),
    [filteredObservations, params],
  )

  const locationStats = useMemo(
    () => getLocationStats(filteredObservations),
    [filteredObservations],
  )

  const uniqueFoxCount = useMemo(
    () => getUniqueFoxCount(filteredObservations),
    [filteredObservations],
  )

  const topFox = useMemo(
    () => getMostSuspiciousFox(foxSummaries),
    [foxSummaries],
  )

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((value) => value !== null).length
  }, [filters])

  const updateParams = useCallback((patch: Partial<SuspicionParams>) => {
    setParams((current) => ({ ...current, ...patch }))
  }, [])

  const updateFilters = useCallback((patch: Partial<ObservationFilters>) => {
    setFilters((current) => ({ ...current, ...patch }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_OBSERVATION_FILTERS)
  }, [])

  const addObservation = useCallback(
    (observation: Omit<Observation, 'id'> & { id?: string }) => {
      const nextObservation: Observation = {
        ...observation,
        id: observation.id ?? createObservationId(),
      }

      const validationError = validateObservation(nextObservation)

      if (validationError) {
        setError(validationError)
        return validationError
      }

      setObservations((current) => [...current, nextObservation])
      return null
    },
    [],
  )

  const updateObservation = useCallback(
    (id: string, patch: Partial<Omit<Observation, 'id'>>) => {
      const currentObservation = observations.find(
        (observation) => observation.id === id,
      )

      if (!currentObservation) {
        const message = 'Наблюдение не найдено'
        setError(message)
        return message
      }

      const nextObservation: Observation = {
        ...currentObservation,
        ...patch,
        id,
      }

      const validationError = validateObservation(nextObservation)

      if (validationError) {
        setError(validationError)
        return validationError
      }

      setObservations((current) =>
        current.map((observation) =>
          observation.id === id ? nextObservation : observation,
        ),
      )
      return null
    },
    [observations],
  )

  const deleteObservation = useCallback((id: string) => {
    setObservations((current) =>
      current.filter((observation) => observation.id !== id),
    )
  }, [])

  const resetObservations = useCallback(() => {
    clearObservationsStorage()
    setObservations(initialObservations)
    setFilters(EMPTY_OBSERVATION_FILTERS)
    setError(null)
  }, [])

  const importObservations = useCallback((json: string) => {
    const result = parseObservationsJson(json)

    if ('error' in result) {
      setError(result.error)
      return result.error
    }

    setObservations(result.observations)
    setFilters(EMPTY_OBSERVATION_FILTERS)
    setError(null)
    return null
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    observations,
    filteredObservations,
    params,
    filters,
    uniqueFoxCount,
    locationStats,
    foxSummaries,
    topFox,
    activeFilterCount,
    setParams,
    updateParams,
    setFilters,
    updateFilters,
    resetFilters,
    addObservation,
    updateObservation,
    deleteObservation,
    resetObservations,
    importObservations,
    error,
    clearError,
  }
}
