// Purement présentationnel. Composé depuis OperationHistoryPanel (Client Component), il fait
// donc partie du bundle client, mais reste sans état ni gestionnaire d'événement propre.
import { ExcelEquivalentHint } from '@/components/ExcelEquivalentHint'
import { formatRelativeTime } from '../utils/format-relative-time'
import type { OperationLogEntry } from '../types'

export function OperationHistoryEntryRow({ entry, index }: { entry: OperationLogEntry; index: number }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-base-200 text-[11px] font-medium text-base-content/70">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm text-base-content">
          {entry.label}
          {entry.excelEquivalent && <ExcelEquivalentHint text={entry.excelEquivalent} />}
        </p>
        <p className="text-xs text-base-content/50">{formatRelativeTime(entry.appliedAt)}</p>
      </div>
    </li>
  )
}
