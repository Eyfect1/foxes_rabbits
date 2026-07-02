export const SCENARIO_STORAGE_KEY = 'mox-active-scenario'

export const SCENARIOS = [
  {
    id: 'fox',
    label: 'Лисий диспетчер',
    shortLabel: 'Лисы',
    themeClass: 'theme--fox',
  },
  {
    id: 'rabbits',
    label: 'Ферма невидимых кроликов',
    shortLabel: 'Кролики',
    themeClass: 'theme--rabbits',
  },
] as const

export type ScenarioId = (typeof SCENARIOS)[number]['id']

export function isScenarioId(value: string): value is ScenarioId {
  return SCENARIOS.some((scenario) => scenario.id === value)
}

export function getScenarioThemeClass(scenarioId: ScenarioId): string {
  return SCENARIOS.find((scenario) => scenario.id === scenarioId)?.themeClass ?? 'theme--fox'
}
