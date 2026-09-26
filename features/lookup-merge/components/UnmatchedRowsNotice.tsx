// Purement présentationnel : avertit sans jargon des lignes n'ayant trouvé aucune correspondance.
import { IconAlertTriangle } from '@tabler/icons-react'

export function UnmatchedRowsNotice({ unmatchedCount }: { unmatchedCount: number }) {
  if (unmatchedCount === 0) {
    return <p className="text-sm text-success">Toutes les lignes ont trouvé une correspondance.</p>
  }

  return (
    <p className="flex items-start gap-2 rounded-box bg-warning/10 px-4 py-3 text-sm text-warning-content">
      <IconAlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" />
      {unmatchedCount} ligne{unmatchedCount > 1 ? 's' : ''} de votre tableau ne correspond
      {unmatchedCount > 1 ? 'ent' : ''} à aucune ligne du second tableau. Ces colonnes resteront vides pour elles.
    </p>
  )
}
