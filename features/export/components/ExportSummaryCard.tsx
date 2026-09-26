// Purement présentationnel : résumé de ce qui sera téléchargé.
import { IconFileSpreadsheet } from '@tabler/icons-react'

export function ExportSummaryCard({
  rowCount,
  columnCount,
  filename,
}: {
  rowCount: number
  columnCount: number
  filename: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-box border border-base-300 p-4">
      <IconFileSpreadsheet size={28} className="text-primary" />
      <div>
        <p className="font-medium text-base-content">{filename}</p>
        <p className="text-xs text-base-content/60">
          {rowCount} lignes · {columnCount} colonnes
        </p>
      </div>
    </div>
  )
}
