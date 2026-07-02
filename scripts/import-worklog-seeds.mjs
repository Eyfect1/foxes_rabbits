import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function writeSeed(jsonPath, tsPath) {
  const data = JSON.parse(readFileSync(jsonPath, 'utf8'))
  const header = `import type { WorklogState } from '../../../shared/types/worklog'

export const initialWorklog: WorklogState = `
  const body = JSON.stringify(data, null, 2)
  writeFileSync(tsPath, `${header}${body}\n`, 'utf8')
  console.log(`Written ${tsPath} — checkpoints: ${data.checkpoints?.length ?? 0}`)
}

const root = resolve(import.meta.dirname, '../..')

writeSeed(
  resolve(root, 'fox-dispatcher-worklog-seed.json'),
  resolve(import.meta.dirname, '../src/scenarios/fox/data/initialWorklog.ts'),
)
writeSeed(
  resolve(root, 'rabbit-farm-worklog-seed.json'),
  resolve(import.meta.dirname, '../src/scenarios/rabbits/data/initialWorklog.ts'),
)
