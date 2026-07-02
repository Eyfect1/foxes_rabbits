import { getEventTypeLabel } from './eventTypes'
import type {
  EstimationParams,
  FarmEstimation,
  LocationStats,
  Recommendation,
  SignalContribution,
  SignalEvent,
  SignalEventType,
  SignalFilters,
  SignalTypeStats,
} from '../types'

function getEventWeight(
  event: SignalEventType,
  params: EstimationParams,
): number {
  switch (event) {
    case 'missing_carrot':
      return params.missingCarrotWeight
    case 'new_hole':
      return params.newHoleWeight
    case 'motion_sensor':
      return params.motionSensorWeight
    case 'rustling':
      return params.rustlingWeight
  }
}

export function computeSignalContribution(
  signal: SignalEvent,
  params: EstimationParams,
): number {
  const intensityMultiplier =
    (signal.intensity / 10) * params.intensityFactor

  return signal.count * intensityMultiplier * getEventWeight(signal.event, params)
}

export function computeRawRabbitScore(
  signals: SignalEvent[],
  params: EstimationParams,
): number {
  return signals.reduce(
    (sum, signal) => sum + computeSignalContribution(signal, params),
    0,
  )
}

export function estimateRabbitCount(
  signals: SignalEvent[],
  params: EstimationParams,
): number {
  if (signals.length === 0) {
    return 0
  }

  return Math.max(0, Math.round(computeRawRabbitScore(signals, params)))
}

export function computeConfidence(signals: SignalEvent[]): number {
  if (signals.length === 0) {
    return 0
  }

  const signalScore = Math.min(signals.length / 5, 1) * 30
  const uniqueTypes = new Set(signals.map((signal) => signal.event)).size
  const typeScore = (uniqueTypes / 3) * 30
  const uniqueLocations = new Set(signals.map((signal) => signal.location)).size
  const locationScore = Math.min(uniqueLocations / 3, 1) * 20
  const avgIntensity =
    signals.reduce((sum, signal) => sum + signal.intensity, 0) / signals.length
  const intensityScore = (avgIntensity / 10) * 20

  return Math.round(
    Math.min(100, signalScore + typeScore + locationScore + intensityScore),
  )
}

export function getTopContributors(
  signals: SignalEvent[],
  params: EstimationParams,
  limit = 5,
): SignalContribution[] {
  const rawScore = computeRawRabbitScore(signals, params)

  if (rawScore === 0) {
    return []
  }

  return signals
    .map((signal) => {
      const contribution = computeSignalContribution(signal, params)

      return {
        signal,
        contribution,
        sharePercent: (contribution / rawScore) * 100,
      }
    })
    .sort((left, right) => right.contribution - left.contribution)
    .slice(0, limit)
}

function getSignalsByType(
  signals: SignalEvent[],
  event: SignalEventType,
): SignalEvent[] {
  return signals.filter((signal) => signal.event === event)
}

function getTypeContribution(
  signals: SignalEvent[],
  event: SignalEventType,
  params: EstimationParams,
): number {
  return getSignalsByType(signals, event).reduce(
    (sum, signal) => sum + computeSignalContribution(signal, params),
    0,
  )
}

export function getRecommendations(
  signals: SignalEvent[],
  params: EstimationParams,
  confidence: number,
): Recommendation[] {
  const recommendations: Recommendation[] = []
  const rabbitCount = estimateRabbitCount(signals, params)

  if (signals.length === 0) {
    recommendations.push({
      id: 'no-signals',
      priority: 'high',
      title: 'Нет сигналов',
      description:
        'Добавьте косвенные наблюдения или импортируйте данные, чтобы система могла оценить поголовье.',
    })
    return recommendations
  }

  if (confidence < 50) {
    recommendations.push({
      id: 'low-confidence',
      priority: 'medium',
      title: 'Соберите больше сигналов',
      description: `Уверенность ${confidence}% — добавьте наблюдения в разных локациях и типах событий.`,
    })
  }

  const carrotSignals = getSignalsByType(signals, 'missing_carrot')
  const carrotContribution = getTypeContribution(signals, 'missing_carrot', params)

  if (carrotSignals.length > 0 && carrotContribution >= 1.5) {
    recommendations.push({
      id: 'protect-garden',
      priority: 'high',
      title: 'Защитить огород',
      description:
        'Пропажа морковки заметна — усильте ограждение огорода и проверьте грядки на свежие следы.',
      relatedEvent: 'missing_carrot',
    })
  }

  const holeSignals = getSignalsByType(signals, 'new_hole')
  const holeCount = holeSignals.reduce((sum, signal) => sum + signal.count, 0)

  if (holeSignals.length > 0 && holeCount >= 2) {
    recommendations.push({
      id: 'reinforce-fence',
      priority: 'high',
      title: 'Укрепить забор',
      description: `Зафиксировано ${holeCount} новых ямок — проверьте участок у забора и засыпьте норы.`,
      relatedEvent: 'new_hole',
    })
  }

  const motionSignals = getSignalsByType(signals, 'motion_sensor')

  if (motionSignals.some((signal) => signal.intensity >= 7)) {
    const location = motionSignals.find((signal) => signal.intensity >= 7)?.location

    recommendations.push({
      id: 'check-barn',
      priority: 'high',
      title: 'Проверить сарай',
      description: location
        ? `Датчик движения сработал в «${location}» — осмотрите помещение и закройте лазейки.`
        : 'Сильный сигнал датчика движения — осмотрите сарай и закройте лазейки.',
      relatedEvent: 'motion_sensor',
    })
  }

  const rustlingSignals = getSignalsByType(signals, 'rustling')

  if (rustlingSignals.length > 0) {
    recommendations.push({
      id: 'check-rustling',
      priority: 'medium',
      title: 'Проверить шуршание',
      description:
        'Зафиксировано шуршание — осмотрите сарай и соседние постройки в тихое время суток.',
      relatedEvent: 'rustling',
    })
  }

  if (rabbitCount >= 6) {
    recommendations.push({
      id: 'high-population',
      priority: 'medium',
      title: 'Высокая оценка поголовья',
      description: `Система оценивает ~${rabbitCount} кроликов — рассмотрите дополнительные ловушки и ночной обход.`,
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'all-clear',
      priority: 'low',
      title: 'Ситуация под контролем',
      description:
        'Сигналы слабые — продолжайте мониторинг и фиксируйте новые события.',
    })
  }

  return recommendations
}

export function getLocationStats(
  signals: SignalEvent[],
  params: EstimationParams,
): LocationStats[] {
  const grouped = new Map<
    string,
    {
      signalCount: number
      totalIntensity: number
      totalContribution: number
      eventTypes: Set<SignalEventType>
    }
  >()

  for (const signal of signals) {
    const current = grouped.get(signal.location) ?? {
      signalCount: 0,
      totalIntensity: 0,
      totalContribution: 0,
      eventTypes: new Set<SignalEventType>(),
    }

    current.signalCount += 1
    current.totalIntensity += signal.intensity
    current.totalContribution += computeSignalContribution(signal, params)
    current.eventTypes.add(signal.event)
    grouped.set(signal.location, current)
  }

  return Array.from(grouped.entries())
    .map(([location, data]) => ({
      location,
      signalCount: data.signalCount,
      avgIntensity: data.totalIntensity / data.signalCount,
      totalContribution: data.totalContribution,
      eventTypes: [...data.eventTypes],
    }))
    .sort((left, right) => right.totalContribution - left.totalContribution)
}

export function getSignalTypeStats(
  signals: SignalEvent[],
  params: EstimationParams,
): SignalTypeStats[] {
  const grouped = new Map<
    SignalEventType,
    {
      signalCount: number
      totalCount: number
      totalIntensity: number
      totalContribution: number
    }
  >()

  for (const signal of signals) {
    const current = grouped.get(signal.event) ?? {
      signalCount: 0,
      totalCount: 0,
      totalIntensity: 0,
      totalContribution: 0,
    }

    current.signalCount += 1
    current.totalCount += signal.count
    current.totalIntensity += signal.intensity
    current.totalContribution += computeSignalContribution(signal, params)
    grouped.set(signal.event, current)
  }

  return Array.from(grouped.entries())
    .map(([event, data]) => ({
      event,
      label: getEventTypeLabel(event),
      signalCount: data.signalCount,
      totalCount: data.totalCount,
      avgIntensity: data.totalIntensity / data.signalCount,
      totalContribution: data.totalContribution,
    }))
    .sort((left, right) => right.totalContribution - left.totalContribution)
}

export function applyFilters(
  signals: SignalEvent[],
  filters: SignalFilters,
): SignalEvent[] {
  return signals.filter((signal) => {
    if (filters.event && signal.event !== filters.event) {
      return false
    }

    if (filters.location && signal.location !== filters.location) {
      return false
    }

    if (
      filters.minIntensity !== null &&
      signal.intensity < filters.minIntensity
    ) {
      return false
    }

    if (
      filters.maxIntensity !== null &&
      signal.intensity > filters.maxIntensity
    ) {
      return false
    }

    if (filters.minCount !== null && signal.count < filters.minCount) {
      return false
    }

    if (filters.maxCount !== null && signal.count > filters.maxCount) {
      return false
    }

    return true
  })
}

export function computeFarmEstimation(
  signals: SignalEvent[],
  params: EstimationParams,
): FarmEstimation {
  const rawScore = computeRawRabbitScore(signals, params)
  const confidence = computeConfidence(signals)
  const rabbitCount = estimateRabbitCount(signals, params)

  return {
    rabbitCount,
    rawScore,
    confidence,
    topContributors: getTopContributors(signals, params),
    recommendations: getRecommendations(signals, params, confidence),
  }
}
