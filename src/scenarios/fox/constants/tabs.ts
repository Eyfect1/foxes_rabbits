export const TABS = [
  { id: 'dashboard', label: 'Дашборд' },
  { id: 'observations', label: 'Наблюдения' },
  { id: 'foxes', label: 'Лисы' },
  { id: 'locations', label: 'Локации' },
  { id: 'worklog', label: 'AI Worklog' },
] as const

export type TabId = (typeof TABS)[number]['id']
