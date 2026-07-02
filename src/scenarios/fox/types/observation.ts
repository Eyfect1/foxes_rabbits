export interface Observation {
  id: string
  fox_id: string
  location: string
  color: string
  has_prey: boolean
  suspicion_level: number
  time: string
}

export interface SuspicionParams {
  preyWeight: number
  levelWeight: number
}

export interface ObservationFilters {
  foxId: string | null
  location: string | null
  color: string | null
  hasPrey: boolean | null
  minSuspicion: number | null
  maxSuspicion: number | null
}

export interface FoxSummary {
  fox_id: string
  color: string
  observationCount: number
  avgSuspicion: number
  maxSuspicion: number
  preySightings: number
  compositeScore: number
  locations: string[]
  primaryLocation: string | null
  explanation: string[]
}

export interface LocationStats {
  location: string
  count: number
  avgSuspicion: number
  uniqueFoxes: number
}

export const DEFAULT_SUSPICION_PARAMS: SuspicionParams = {
  preyWeight: 2,
  levelWeight: 1,
}

export const EMPTY_OBSERVATION_FILTERS: ObservationFilters = {
  foxId: null,
  location: null,
  color: null,
  hasPrey: null,
  minSuspicion: null,
  maxSuspicion: null,
}
