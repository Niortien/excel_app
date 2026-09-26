// Purement présentationnel : deux compteurs d'anomalies détectées.
import { IconCopy, IconSquareRoundedX } from '@tabler/icons-react'
import type { CleaningIssuesSummary } from '../types'

export function CleaningIssuesSummaryCards({ issues }: { issues: CleaningIssuesSummary | null }) {
  const duplicateRowCount = issues?.duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0) ?? 0
  const emptyCellRowCount = issues?.rowsWithEmptyCells.length ?? 0

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="flex items-center gap-3 rounded-box border border-base-300 p-4">
        <IconCopy size={22} className="text-warning" />
        <div>
          <p className="text-lg font-bold text-base-content">{duplicateRowCount}</p>
          <p className="text-xs text-base-content/60">lignes en double détectées</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-box border border-base-300 p-4">
        <IconSquareRoundedX size={22} className="text-warning" />
        <div>
          <p className="text-lg font-bold text-base-content">{emptyCellRowCount}</p>
          <p className="text-xs text-base-content/60">lignes avec des cellules vides</p>
        </div>
      </div>
    </div>
  )
}
