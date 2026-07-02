import { SIGNAL_EVENT_TYPES, type SignalEvent, type SignalEventType } from '../types'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export function createSignalId(): string {
  return `evt_${crypto.randomUUID().slice(0, 8)}`
}

export function isSignalEventType(value: string): value is SignalEventType {
  return SIGNAL_EVENT_TYPES.includes(value as SignalEventType)
}

export function createEmptySignal(): SignalEvent {
  return {
    id: createSignalId(),
    event: 'missing_carrot',
    location: '',
    count: 1,
    intensity: 5,
    time: '12:00',
  }
}

export function validateSignal(signal: Partial<SignalEvent>): string | null {
  if (!signal.event || !isSignalEventType(signal.event)) {
    return 'Укажите корректный тип сигнала'
  }

  if (!signal.location?.trim()) {
    return 'Укажите локацию'
  }

  if (!signal.time?.trim() || !TIME_PATTERN.test(signal.time)) {
    return 'Время должно быть в формате ЧЧ:ММ'
  }

  const count = signal.count

  if (
    count === undefined ||
    !Number.isFinite(count) ||
    !Number.isInteger(count) ||
    count < 1
  ) {
    return 'Количество должно быть целым числом от 1'
  }

  const intensity = signal.intensity

  if (
    intensity === undefined ||
    !Number.isFinite(intensity) ||
    intensity < 1 ||
    intensity > 10
  ) {
    return 'Интенсивность должна быть от 1 до 10'
  }

  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseSignalEntry(
  entry: unknown,
  index: number,
): { signal?: SignalEvent; error?: string } {
  if (!isRecord(entry)) {
    return { error: `Запись ${index + 1}: ожидается объект` }
  }

  const eventValue = String(entry.event ?? '')

  const signal: SignalEvent = {
    id: typeof entry.id === 'string' && entry.id.trim() ? entry.id : createSignalId(),
    event: isSignalEventType(eventValue) ? eventValue : 'missing_carrot',
    location: String(entry.location ?? ''),
    count: Number(entry.count),
    intensity: Number(entry.intensity),
    time: String(entry.time ?? ''),
  }

  if (!isSignalEventType(eventValue)) {
    return {
      error: `Запись ${index + 1}: неизвестный тип события «${eventValue}»`,
    }
  }

  const validationError = validateSignal(signal)

  if (validationError) {
    return { error: `Запись ${index + 1}: ${validationError}` }
  }

  return { signal }
}

export function parseSignalsJson(
  json: string,
): { signals: SignalEvent[] } | { error: string } {
  try {
    const parsed = JSON.parse(json) as unknown

    if (!Array.isArray(parsed)) {
      return { error: 'JSON должен быть массивом сигналов' }
    }

    if (parsed.length === 0) {
      return { error: 'Массив сигналов не может быть пустым' }
    }

    const signals: SignalEvent[] = []

    for (const [index, entry] of parsed.entries()) {
      const result = parseSignalEntry(entry, index)

      if (result.error) {
        return { error: result.error }
      }

      if (result.signal) {
        signals.push(result.signal)
      }
    }

    return { signals }
  } catch {
    return { error: 'Некорректный JSON' }
  }
}
