export const SIGNAL_EVENT_TYPES = [
  'missing_carrot',
  'new_hole',
  'motion_sensor',
  'rustling',
] as const

export type SignalEventType = (typeof SIGNAL_EVENT_TYPES)[number]

export interface SignalEvent {
  id: string
  event: SignalEventType
  location: string
  count: number
  intensity: number
  time: string
}

export interface EstimationParams {
  missingCarrotWeight: number
  newHoleWeight: number
  motionSensorWeight: number
  rustlingWeight: number
  intensityFactor: number
}

export interface SignalFilters {
  event: SignalEventType | null
  location: string | null
  minIntensity: number | null
  maxIntensity: number | null
  minCount: number | null
  maxCount: number | null
}

export interface SignalContribution {
  signal: SignalEvent
  contribution: number
  sharePercent: number
}

export interface LocationStats {
  location: string
  signalCount: number
  avgIntensity: number
  totalContribution: number
  eventTypes: SignalEventType[]
}

export interface SignalTypeStats {
  event: SignalEventType
  label: string
  signalCount: number
  totalCount: number
  avgIntensity: number
  totalContribution: number
}

export interface FarmEstimation {
  rabbitCount: number
  rawScore: number
  confidence: number
  topContributors: SignalContribution[]
  recommendations: Recommendation[]
}

export interface Recommendation {
  id: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  relatedEvent?: SignalEventType
}

export const DEFAULT_ESTIMATION_PARAMS: EstimationParams = {
  missingCarrotWeight: 1,
  newHoleWeight: 1.5,
  motionSensorWeight: 2,
  rustlingWeight: 1.2,
  intensityFactor: 1,
}

export const EMPTY_SIGNAL_FILTERS: SignalFilters = {
  event: null,
  location: null,
  minIntensity: null,
  maxIntensity: null,
  minCount: null,
  maxCount: null,
}
