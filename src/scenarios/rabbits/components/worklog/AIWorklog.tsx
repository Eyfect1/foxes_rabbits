import { RABBITS_WORKLOG_STORAGE_KEY } from '../../../../shared/lib/worklogStorage'
import { WorklogSection } from '../../../../shared/worklog/WorklogSection'
import { initialWorklog } from '../../data/initialWorklog'

export function AIWorklog() {
  return (
    <WorklogSection
      scenarioTitle="Ферма невидимых кроликов"
      storageKey={RABBITS_WORKLOG_STORAGE_KEY}
      seedState={initialWorklog}
      exportFileName="rabbit-farm-worklog-seed.json"
      seedFilePath="src/scenarios/rabbits/data/initialWorklog.ts"
    />
  )
}
