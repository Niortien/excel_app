// Fonction pure : symétrique de insert-summary-row.ts, mais par ligne plutôt que par colonne —
// pour chaque ligne de la sélection, agrège les colonnes sélectionnées et place le résultat
// dans une nouvelle colonne (ou complète une colonne de total déjà présente juste à côté).
import { slugifyColumnLabel } from '@/features/import-sheet/utils/slugify-column-label'
import { getColumnIdsInRange, getRowIndexesInRange } from '@/lib/selection'
import type { CellRange, SheetData, SheetColumn } from '@/types/sheet'
import { summaryFunctionLabels, type SummaryFunction } from './insert-summary-row'

export type SummaryColumnPosition = 'left' | 'right'

function parseNumeric(value: unknown): number | null {
  const cleaned = String(value ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')
  if (cleaned.trim() === '') return null
  const parsed = Number.parseFloat(cleaned)
  return Number.isNaN(parsed) ? null : parsed
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

function isColumnEmptyForRows(columns: SheetColumn[], data: SheetData, columnIndex: number, rowIndexes: number[]): boolean {
  const columnId = columns[columnIndex]?.id
  if (!columnId) return false
  return rowIndexes.every((rowIndex) => String(data.rows[rowIndex]?.[columnId] ?? '').trim() === '')
}

/** Trouve l'index de colonne juste après (ou avant) les vraies données, en sautant les
 * colonnes déjà vides pour ces lignes précises — typiquement une colonne de total déjà créée
 * par un appel précédent, à laquelle il reste des lignes à compléter. */
function findAdjacentColumnIndex(data: SheetData, rowIndexes: number[], position: SummaryColumnPosition): number {
  if (position === 'right') {
    let index = data.columns.length - 1
    while (index >= 0 && isColumnEmptyForRows(data.columns, data, index, rowIndexes)) index -= 1
    return index + 1
  }
  let index = 0
  while (index < data.columns.length && isColumnEmptyForRows(data.columns, data, index, rowIndexes)) index += 1
  return index - 1
}

export function insertSummaryColumn(
  data: SheetData,
  selectedColumnIds: string[],
  selectedRange: CellRange | null,
  fn: SummaryFunction,
  position: SummaryColumnPosition
): SheetData {
  const allColumnIds = data.columns.map((c) => c.id)
  let columnIds: string[] = []
  let rowIndexes: number[] = []

  if (selectedColumnIds.length > 0) {
    columnIds = selectedColumnIds
    rowIndexes = data.rows.map((_, index) => index)
  } else if (selectedRange) {
    columnIds = getColumnIdsInRange(selectedRange, allColumnIds)
    rowIndexes = getRowIndexesInRange(selectedRange)
  } else {
    return data
  }

  if (columnIds.length === 0 || rowIndexes.length === 0) return data

  const computedValues: Record<number, string> = {}
  for (const rowIndex of rowIndexes) {
    const values = columnIds
      .map((columnId) => parseNumeric(data.rows[rowIndex]?.[columnId]))
      .filter((value): value is number => value !== null)
    const result = aggregate(values, fn)
    computedValues[rowIndex] = result === null ? '' : String(Math.round(result * 100) / 100)
  }

  // Sélection "ligne entière" (spanning toutes les colonnes actuelles) : une colonne de total
  // déjà ajoutée fait partie de la sélection elle-même, donc on cherche la vraie frontière des
  // données en sautant les colonnes déjà vides pour ces lignes, plutôt que l'index min/max brut.
  const isWholeRowSelection = columnIds.length === allColumnIds.length
  const columnOrder = allColumnIds
  const selectedColumnIndexes = columnIds.map((id) => columnOrder.indexOf(id))

  const adjacentColumnIndex = isWholeRowSelection
    ? findAdjacentColumnIndex(data, rowIndexes, position)
    : position === 'left'
      ? Math.min(...selectedColumnIndexes) - 1
      : Math.max(...selectedColumnIndexes) + 1

  const adjacentColumn = data.columns[adjacentColumnIndex]
  const canReuseAdjacentColumn = adjacentColumn !== undefined && isColumnEmptyForRows(data.columns, data, adjacentColumnIndex, rowIndexes)

  if (canReuseAdjacentColumn) {
    const rows = data.rows.map((row, index) =>
      rowIndexes.includes(index) ? { ...row, [adjacentColumn.id]: computedValues[index] } : row
    )
    return { columns: data.columns, rows }
  }

  const usedIds = new Set(allColumnIds)
  const newColumnId = slugifyColumnLabel(summaryFunctionLabels[fn], usedIds)
  const newColumn: SheetColumn = { id: newColumnId, label: summaryFunctionLabels[fn], dataType: 'number', hasEmptyValues: true }

  const insertAt = Math.max(0, Math.min(adjacentColumnIndex, data.columns.length))
  const columns = [...data.columns]
  columns.splice(insertAt, 0, newColumn)

  const rows = data.rows.map((row, index) => ({
    ...row,
    [newColumnId]: rowIndexes.includes(index) ? computedValues[index] : '',
  }))

  return { columns, rows }
}
