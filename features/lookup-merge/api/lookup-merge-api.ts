// TODO backend : `parseSecondTable` deviendra un upload vers le backend, `previewMerge`
// un POST /sheets/:id/lookup/preview. Réutilise le parseur de la feature import-sheet
// plutôt que de dupliquer la logique de lecture de fichier.
import { parseSpreadsheetFile } from '@/features/import-sheet/api/import-sheet-api'
import type { SheetColumn, SheetData } from '@/types/sheet'
import { matchRowsByKey } from '../utils/match-rows-by-key'
import type { LookupMergeResult, SecondTable } from '../types'

export async function parseSecondTable(file: File): Promise<SecondTable> {
  const result = await parseSpreadsheetFile(file)
  return { fileName: result.fileName, columns: result.columns, rows: result.rows }
}

interface PreviewMergeInput {
  primaryData: SheetData
  primaryKeyColumnId: string
  secondTable: SecondTable
  secondaryKeyColumnId: string
  columnIdsToImport: string[]
}

export async function previewMerge({
  primaryData,
  primaryKeyColumnId,
  secondTable,
  secondaryKeyColumnId,
  columnIdsToImport,
}: PreviewMergeInput): Promise<LookupMergeResult> {
  const columnsToImport: SheetColumn[] = columnIdsToImport.map((sourceId) => {
    const source = secondTable.columns.find((c) => c.id === sourceId)!
    return { ...source, id: `import_${source.id}`, label: source.label }
  })
  const sourceColumnIdByImportedId = Object.fromEntries(
    columnsToImport.map((c, i) => [c.id, columnIdsToImport[i]])
  )

  const { rows, unmatchedRowIndexes } = matchRowsByKey({
    primaryRows: primaryData.rows,
    primaryKeyColumnId,
    secondaryRows: secondTable.rows,
    secondaryKeyColumnId,
    columnsToImport,
    sourceColumnIdByImportedId,
  })

  return {
    data: { columns: [...primaryData.columns, ...columnsToImport], rows },
    unmatchedRowIndexes,
  }
}
