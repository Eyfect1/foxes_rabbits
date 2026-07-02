import type { Observation } from '../types'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export function createObservationId(): string {
  return `obs_${crypto.randomUUID().slice(0, 8)}`
}

export function createEmptyObservation(): Observation {
  return {
    id: createObservationId(),
    fox_id: '',
    location: '',
    color: '',
    has_prey: false,
    suspicion_level: 5,
    time: '12:00',
  }
}

export function validateObservation(
  observation: Partial<Observation>,
): string | null {
  if (!observation.fox_id?.trim()) {
    return 'Укажите ID лисы'
  }

  if (!observation.location?.trim()) {
    return 'Укажите локацию'
  }

  if (!observation.color?.trim()) {
    return 'Укажите цвет'
  }

  if (!observation.time?.trim() || !TIME_PATTERN.test(observation.time)) {
    return 'Время должно быть в формате ЧЧ:ММ'
  }

  const level = observation.suspicion_level

  if (
    level === undefined ||
    !Number.isFinite(level) ||
    level < 1 ||
    level > 10
  ) {
    return 'Подозрительность должна быть от 1 до 10'
  }

  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseObservationEntry(
  entry: unknown,
  index: number,
): { observation?: Observation; error?: string } {
  if (!isRecord(entry)) {
    return { error: `Запись ${index + 1}: ожидается объект` }
  }

  const observation: Observation = {
    id: typeof entry.id === 'string' && entry.id.trim() ? entry.id : createObservationId(),
    fox_id: String(entry.fox_id ?? ''),
    location: String(entry.location ?? ''),
    color: String(entry.color ?? ''),
    has_prey: Boolean(entry.has_prey),
    suspicion_level: Number(entry.suspicion_level),
    time: String(entry.time ?? ''),
  }

  const validationError = validateObservation(observation)

  if (validationError) {
    return { error: `Запись ${index + 1}: ${validationError}` }
  }

  return { observation }
}

export function parseObservationsJson(
  json: string,
): { observations: Observation[] } | { error: string } {
  try {
    const parsed = JSON.parse(json) as unknown

    if (!Array.isArray(parsed)) {
      return { error: 'JSON должен быть массивом наблюдений' }
    }

    if (parsed.length === 0) {
      return { error: 'Массив наблюдений не может быть пустым' }
    }

    const observations: Observation[] = []

    for (const [index, entry] of parsed.entries()) {
      const result = parseObservationEntry(entry, index)

      if (result.error) {
        return { error: result.error }
      }

      if (result.observation) {
        observations.push(result.observation)
      }
    }

    return { observations }
  } catch {
    return { error: 'Некорректный JSON' }
  }
}
