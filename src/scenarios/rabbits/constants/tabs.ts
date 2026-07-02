export const TABS = [
  { id: 'dashboard', label: 'Дашборд' },
  { id: 'signals', label: 'Сигналы' },
  { id: 'locations', label: 'Локации' },
  { id: 'types', label: 'Типы сигналов' },
  { id: 'worklog', label: 'AI Worklog' },
] as const

export type TabId = (typeof TABS)[number]['id']
