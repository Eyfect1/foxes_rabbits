import type { FoxSummary } from '../../types'

interface FoxRankingTableProps {
  foxSummaries: FoxSummary[]
  onSelectFox: (foxId: string) => void
}

export function FoxRankingTable({
  foxSummaries,
  onSelectFox,
}: FoxRankingTableProps) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Лиса</th>
            <th>Цвет</th>
            <th>Балл</th>
            <th>Наблюд.</th>
            <th>С добычей</th>
            <th>Макс.</th>
            <th>Локации</th>
          </tr>
        </thead>
        <tbody>
          {foxSummaries.map((fox, index) => (
            <tr key={fox.fox_id}>
              <td>{index + 1}</td>
              <td>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => onSelectFox(fox.fox_id)}
                >
                  <code>{fox.fox_id}</code>
                </button>
              </td>
              <td>{fox.color}</td>
              <td>
                <strong className="text-accent">{fox.compositeScore.toFixed(1)}</strong>
              </td>
              <td>{fox.observationCount}</td>
              <td>{fox.preySightings}</td>
              <td>{fox.maxSuspicion}</td>
              <td>{fox.locations.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
