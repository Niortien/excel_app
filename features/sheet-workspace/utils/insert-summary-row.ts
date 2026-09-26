// Fonction pure : transforme le résumé d'une sélection (somme, moyenne...) en une vraie ligne
// insérée dans le tableau, au-dessus ou en dessous de la sélection — pas juste un affichage
// temporaire, un résultat que l'utilisateur peut garder, copier, exporter.
import { getColumnIdsInRange, getRowIndexesInRange } from '@/lib/selection'
import type { CellRange, SheetData, SheetRow } from '@/types/sheet'

export type SummaryFunction = 'sum' | 'average' | 'count' | 'min' | 'max'

export const summaryFunctionLabels: Record<SummaryFunction, string> = {
  sum: 'Somme',
  average: 'Moyenne',
  count: 'Nombre',
  min: 'Min',
  max: 'Max',
}

export type SummaryRowPosition = 'above' | 'below'

function parseNumeric(value: unknown): number | null {
  const cleaned = String(value ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')
  if (cleaned.trim() === '') return null
  const parsed = Number.parseFloat(cleaned)
  return Number.isNaN(parsed) ? null : parsed
}

function isEmptyInColumns(row: SheetRow, columnIds: string[]): boolean {
  return columnIds.every((id) => String(row[id] ?? '').trim() === '')
}

function aggregate(values: number[], fn: SummaryFunction): number | null {
  if (fn === 'count') return values.length
  if (values.length === 0) return null
  switch (fn) {
    case 'sum':
      return values.reduce((total, value) => total + value, 0)
    case 'average':
      return values.reduce((total, value) => total + value, 0) / values.length
    case 'min':
      return Math.min(...values)
    case 'max':
      return Math.max(...values)
  }
}

/** Trouve la ligne juste après (ou avant) les vraies données, en sautant les lignes déjà
 * vides dans ces colonnes précises — typiquement une ligne de total déjà créée par un appel
 * précédent, à laquelle il reste des colonnes à compléter. */
function findAdjacentRowIndex(rows: SheetRow[], columnIds: string[], position: SummaryRowPosition): number {
  if (position === 'below') {
    let index = rows.length - 1
    while (index >= 0 && isEmptyInColumns(rows[index], columnIds)) index -= 1
    return index + 1
  }
  let index = 0
  while (index < rows.length && isEmptyInColumns(rows[index], columnIds)) index += 1
  return index - 1
}

/** Calcule le résultat de la sélection colonne par colonne (une colonne = un agrégat calculé
 * uniquement sur les cellules de cette colonne dans la sélection), puis l'insère — ou le
 * complète dans une ligne de total déjà présente juste à côté de la sélection. */
export function insertSummaryRow(
  data: SheetData,
  selectedColumnIds: string[],
  selectedRange: CellRange | null,
  fn: SummaryFunction,
  position: SummaryRowPosition
): SheetData {
  let columnIds: string[] = []
  let rowIndexes: number[] = []
  let isWholeColumnSelection = false

  if (selectedColumnIds.length > 0) {
    columnIds = selectedColumnIds
    rowIndexes = data.rows.map((_, index) => index)
    isWholeColumnSelection = true
  } else if (selectedRange) {
    columnIds = getColumnIdsInRange(selectedRange, data.columns.map((c) => c.id))
    rowIndexes = getRowIndexesInRange(selectedRange)
  } else {
    return data
  }

  if (rowIndexes.length === 0) return data

  const computedValues: Record<string, string> = {}
  for (const columnId of columnIds) {
    const values = rowIndexes
      .map((rowIndex) => parseNumeric(data.rows[rowIndex]?.[columnId]))
      .filter((value): value is number => value !== null)
    const result = aggregate(values, fn)
    computedValues[columnId] = result === null ? '' : String(Math.round(result * 100) / 100)
  }

  // En sélection "colonne entière", une ligne de total déjà ajoutée fait partie de la
  // sélection elle-même : on cherche la frontière réelle des données en sautant les lignes
  // déjà vides dans ces colonnes, plutôt que d'utiliser l'index max/min brut de la sélection.
  const adjacentIndex = isWholeColumnSelection
    ? findAdjacentRowIndex(data.rows, columnIds, position)
    : position === 'above'
      ? Math.min(...rowIndexes) - 1
      : Math.max(...rowIndexes) + 1

  const adjacentRow = data.rows[adjacentIndex]
  const canReuseAdjacentRow = adjacentRow !== undefined && isEmptyInColumns(adjacentRow, columnIds)

  if (canReuseAdjacentRow) {
    const rows = data.rows.map((row, index) => (index === adjacentIndex ? { ...row, ...computedValues } : row))
    return { columns: data.columns, rows }
  }

  const summaryRow: SheetRow = { ...Object.fromEntries(data.columns.map((c) => [c.id, ''])), ...computedValues }
  const insertAt = Math.max(0, Math.min(adjacentIndex, data.rows.length))
  const rows = [...data.rows]
  rows.splice(insertAt, 0, summaryRow)
  return { columns: data.columns, rows }
}
