import { FOX_WORKLOG_STORAGE_KEY } from '../../../../shared/lib/worklogStorage'
import { WorklogSection } from '../../../../shared/worklog/WorklogSection'
import { initialWorklog } from '../../data/initialWorklog'

export function AIWorklog() {
  return (
    <WorklogSection
      scenarioTitle="Лисий диспетчер"
      storageKey={FOX_WORKLOG_STORAGE_KEY}
      seedState={initialWorklog}
      exportFileName="fox-dispatcher-worklog-seed.json"
      seedFilePath="src/scenarios/fox/data/initialWorklog.ts"
    />
  )
}
