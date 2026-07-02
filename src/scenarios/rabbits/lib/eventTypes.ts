import type { SignalEventType } from '../types'

export const EVENT_TYPE_LABELS: Record<SignalEventType, string> = {
  missing_carrot: 'Пропажа морковки',
  new_hole: 'Новая ямка',
  motion_sensor: 'Датчик движения',
  rustling: 'Шуршание в сарае',
}

export function getEventTypeLabel(event: SignalEventType): string {
  return EVENT_TYPE_LABELS[event]
}

export function formatEventType(event: SignalEventType): string {
  return getEventTypeLabel(event)
}
