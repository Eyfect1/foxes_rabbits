import type {
  FoxSummary,
  LocationStats,
  Observation,
  ObservationFilters,
  SuspicionParams,
} from '../types'

export function computeObservationScore(
  observation: Observation,
  params: SuspicionParams,
): number {
  return (
    observation.suspicion_level * params.levelWeight +
    (observation.has_prey ? params.preyWeight : 0)
  )
}

export function getUniqueFoxCount(observations: Observation[]): number {
  return new Set(observations.map((observation) => observation.fox_id)).size
}

export function getLocationStats(observations: Observation[]): LocationStats[] {
  const grouped = new Map<
    string,
    { count: number; totalSuspicion: number; foxes: Set<string> }
  >()

  for (const observation of observations) {
    const current = grouped.get(observation.location) ?? {
      count: 0,
      totalSuspicion: 0,
      foxes: new Set<string>(),
    }

    current.count += 1
    current.totalSuspicion += observation.suspicion_level
    current.foxes.add(observation.fox_id)
    grouped.set(observation.location, current)
  }

  return Array.from(grouped.entries())
    .map(([location, data]) => ({
      location,
      count: data.count,
      avgSuspicion: data.totalSuspicion / data.count,
      uniqueFoxes: data.foxes.size,
    }))
    .sort((left, right) => right.count - left.count)
}

function getPrimaryLocation(observations: Observation[]): string | null {
  if (observations.length === 0) {
    return null
  }

  const counts = new Map<string, number>()

  for (const observation of observations) {
    counts.set(observation.location, (counts.get(observation.location) ?? 0) + 1)
  }

  let primaryLocation: string | null = null
  let maxCount = 0

  for (const [location, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count
      primaryLocation = location
    }
  }

  return primaryLocation
}

function buildFoxExplanation(
  observations: Observation[],
  preySightings: number,
  maxSuspicion: number,
  primaryLocation: string | null,
): string[] {
  const explanation: string[] = []
  const countLabel =
    observations.length === 1 ? '1 наблюдение' : `${observations.length} наблюдения`

  explanation.push(countLabel)

  if (preySightings > 0) {
    explanation.push(
      preySightings === 1
        ? '1 раз замечена с добычей'
        : `${preySightings} раза замечена с добычей`,
    )
  }

  const peakObservation = observations.find(
    (observation) => observation.suspicion_level === maxSuspicion,
  )

  if (peakObservation) {
    explanation.push(
      `макс. подозрительность ${maxSuspicion} в ${peakObservation.time}`,
    )
  }

  if (primaryLocation) {
    explanation.push(`чаще всего: ${primaryLocation}`)
  }

  return explanation
}

export function getFoxSummaries(
  observations: Observation[],
  params: SuspicionParams,
): FoxSummary[] {
  const grouped = new Map<string, Observation[]>()

  for (const observation of observations) {
    const foxObservations = grouped.get(observation.fox_id) ?? []
    foxObservations.push(observation)
    grouped.set(observation.fox_id, foxObservations)
  }

  return Array.from(grouped.entries())
    .map(([foxId, foxObservations]) => {
      const scores = foxObservations.map((observation) =>
        computeObservationScore(observation, params),
      )
      const suspicionLevels = foxObservations.map(
        (observation) => observation.suspicion_level,
      )
      const preySightings = foxObservations.filter(
        (observation) => observation.has_prey,
      ).length
      const maxSuspicion = Math.max(...suspicionLevels)
      const primaryLocation = getPrimaryLocation(foxObservations)
      const locations = [...new Set(foxObservations.map((observation) => observation.location))]

      return {
        fox_id: foxId,
        color: foxObservations[0]?.color ?? 'неизвестный',
        observationCount: foxObservations.length,
        avgSuspicion:
          suspicionLevels.reduce((sum, level) => sum + level, 0) /
          suspicionLevels.length,
        maxSuspicion,
        preySightings,
        compositeScore:
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        locations,
        primaryLocation,
        explanation: buildFoxExplanation(
          foxObservations,
          preySightings,
          maxSuspicion,
          primaryLocation,
        ),
      }
    })
    .sort((left, right) => right.compositeScore - left.compositeScore)
}

export function getMostSuspiciousFox(
  summaries: FoxSummary[],
): FoxSummary | null {
  if (summaries.length === 0) {
    return null
  }

  return summaries[0] ?? null
}

export function applyFilters(
  observations: Observation[],
  filters: ObservationFilters,
): Observation[] {
  return observations.filter((observation) => {
    if (filters.foxId && observation.fox_id !== filters.foxId) {
      return false
    }

    if (filters.location && observation.location !== filters.location) {
      return false
    }

    if (filters.color && observation.color !== filters.color) {
      return false
    }

    if (
      filters.hasPrey !== null &&
      observation.has_prey !== filters.hasPrey
    ) {
      return false
    }

    if (
      filters.minSuspicion !== null &&
      observation.suspicion_level < filters.minSuspicion
    ) {
      return false
    }

    if (
      filters.maxSuspicion !== null &&
      observation.suspicion_level > filters.maxSuspicion
    ) {
      return false
    }

    return true
  })
}
