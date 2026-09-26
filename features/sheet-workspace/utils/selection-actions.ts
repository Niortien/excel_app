// Fonctions pures appliquant les actions rapides (copier / vider / supprimer) à une sélection
// de colonnes ou de cellules, façon clic droit dans Excel.
import { getColumnIdsInRange, getRowIndexesInRange } from '@/lib/selection'
import type { CellRange, SheetData } from '@/types/sheet'

/** Remplace le contenu de toutes les cellules de la sélection par `value` (chaîne vide pour
 * "vider"). Une sélection de colonnes s'applique à toutes les lignes ; une plage de cellules
 * ne touche que les lignes qu'elle couvre. */
export function fillSelectionWithValue(
  data: SheetData,
  selectedColumnIds: string[],
  selectedRange: CellRange | null,
  value: string
): SheetData {
  if (selectedColumnIds.length > 0) {
    const rows = data.rows.map((row) => {
      const next = { ...row }
      selectedColumnIds.forEach((columnId) => {
        next[columnId] = value
      })
      return next
    })
    return { columns: data.columns, rows }
  }

  if (selectedRange) {
    const columnOrder = data.columns.map((c) => c.id)
    const columnIds = getColumnIdsInRange(selectedRange, columnOrder)
    const rowIndexes = new Set(getRowIndexesInRange(selectedRange))
    const rows = data.rows.map((row, index) => {
      if (!rowIndexes.has(index)) return row
      const next = { ...row }
      columnIds.forEach((columnId) => {
        next[columnId] = value
      })
      return next
    })
    return { columns: data.columns, rows }
  }

  return data
}

export function clearSelectionContent(data: SheetData, selectedColumnIds: string[], selectedRange: CellRange | null): SheetData {
  return fillSelectionWithValue(data, selectedColumnIds, selectedRange, '')
}

export function updateCellValue(data: SheetData, rowIndex: number, columnId: string, value: string): SheetData {
  const rows = data.rows.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row))
  return { columns: data.columns, rows }
}

export function removeSelectedColumns(data: SheetData, selectedColumnIds: string[]): SheetData {
  const columns = data.columns.filter((c) => !selectedColumnIds.includes(c.id))
  const rows = data.rows.map((row) => {
    const next = { ...row }
    selectedColumnIds.forEach((columnId) => {
      delete next[columnId]
    })
    return next
  })
  return { columns, rows }
}

export function buildSelectionCopyText(data: SheetData, selectedColumnIds: string[], selectedRange: CellRange | null): string {
  const columnOrder = data.columns.map((c) => c.id)

  let columnIds: string[] = []
  let rowIndexes: number[] = []

  if (selectedColumnIds.length > 0) {
    columnIds = columnOrder.filter((id) => selectedColumnIds.includes(id))
    rowIndexes = data.rows.map((_, index) => index)
  } else if (selectedRange) {
    columnIds = getColumnIdsInRange(selectedRange, columnOrder)
    rowIndexes = getRowIndexesInRange(selectedRange)
  }

  const header = columnIds.map((id) => data.columns.find((c) => c.id === id)?.label ?? id).join('\t')
  const body = rowIndexes
    .map((rowIndex) => columnIds.map((id) => String(data.rows[rowIndex]?.[id] ?? '')).join('\t'))
    .join('\n')

  return [header, body].join('\n')
}
