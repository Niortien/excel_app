// Fonctions pures agissant sur les lignes elles-mêmes (ajouter, supprimer, dupliquer) —
// distinctes de selection-actions.ts qui ne touche qu'au contenu d'une sélection existante.
import { getRowIndexesInRange } from '@/lib/selection'
import type { CellRange, SheetData, SheetRow } from '@/types/sheet'

export function addEmptyRow(data: SheetData): SheetData {
  const emptyRow: SheetRow = Object.fromEntries(data.columns.map((column) => [column.id, '']))
  return { columns: data.columns, rows: [...data.rows, emptyRow] }
}

export function removeRowsInRange(data: SheetData, range: CellRange): SheetData {
  const rowIndexes = new Set(getRowIndexesInRange(range))
  return { columns: data.columns, rows: data.rows.filter((_, index) => !rowIndexes.has(index)) }
}

/** Duplique chaque ligne de la plage, insérée juste après la dernière ligne sélectionnée. */
export function duplicateRowsInRange(data: SheetData, range: CellRange): SheetData {
  const rowIndexes = getRowIndexesInRange(range)
  const duplicates = rowIndexes.map((index) => ({ ...data.rows[index] }))
  const insertAt = Math.max(...rowIndexes) + 1

  const rows = [...data.rows]
  rows.splice(insertAt, 0, ...duplicates)
  return { columns: data.columns, rows }
}

/** Échange une ligne avec sa voisine du dessus/dessous. Sans effet si la ligne est déjà au bord. */
export function moveRow(data: SheetData, rowIndex: number, direction: 'up' | 'down'): SheetData {
  const targetIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1
  if (targetIndex < 0 || targetIndex >= data.rows.length) return data

  const rows = [...data.rows]
  ;[rows[rowIndex], rows[targetIndex]] = [rows[targetIndex], rows[rowIndex]]
  return { columns: data.columns, rows }
}
