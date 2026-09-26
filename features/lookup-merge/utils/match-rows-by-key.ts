// Fonction pure réalisant le rapprochement de deux tableaux à partir d'une colonne clé
// de chaque côté (équivalent d'une recherche verticale, jamais nommée ainsi dans l'UI).
import type { SheetColumn, SheetRow } from '@/types/sheet'

interface MatchRowsByKeyInput {
  primaryRows: SheetRow[]
  primaryKeyColumnId: string
  secondaryRows: SheetRow[]
  secondaryKeyColumnId: string
  /** Colonnes de la deuxième table à ramener, déjà préfixées pour éviter les collisions d'id. */
  columnsToImport: SheetColumn[]
  sourceColumnIdByImportedId: Record<string, string>
}

export function matchRowsByKey({
  primaryRows,
  primaryKeyColumnId,
  secondaryRows,
  secondaryKeyColumnId,
  columnsToImport,
  sourceColumnIdByImportedId,
}: MatchRowsByKeyInput): { rows: SheetRow[]; unmatchedRowIndexes: number[] } {
  const secondaryByKey = new Map<string, SheetRow>()
  for (const row of secondaryRows) {
    const key = normalizeKey(row[secondaryKeyColumnId])
    if (key && !secondaryByKey.has(key)) secondaryByKey.set(key, row)
  }

  const unmatchedRowIndexes: number[] = []

  const rows = primaryRows.map((row, index) => {
    const key = normalizeKey(row[primaryKeyColumnId])
    const match = key ? secondaryByKey.get(key) : undefined
    if (!match) unmatchedRowIndexes.push(index)

    const importedValues = Object.fromEntries(
      columnsToImport.map((column) => [column.id, match ? match[sourceColumnIdByImportedId[column.id]] : null])
    )

    return { ...row, ...importedValues }
  })

  return { rows, unmatchedRowIndexes }
}

function normalizeKey(value: SheetRow[string]): string | null {
  const text = String(value ?? '').trim().toLowerCase()
  return text.length > 0 ? text : null
}
