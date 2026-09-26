// Fonctions pures d'analyse et de transformation utilisées par le nettoyage guidé.
import type { SheetColumn, SheetRow } from '@/types/sheet'

function rowSignature(row: SheetRow, columns: SheetColumn[]): string {
  return columns.map((column) => String(row[column.id] ?? '')).join('␟')
}

/** Regroupe les index de lignes strictement identiques (toutes colonnes confondues). */
export function findDuplicateRowGroups(rows: SheetRow[], columns: SheetColumn[]): number[][] {
  const groupsBySignature = new Map<string, number[]>()
  rows.forEach((row, index) => {
    const signature = rowSignature(row, columns)
    const group = groupsBySignature.get(signature)
    if (group) group.push(index)
    else groupsBySignature.set(signature, [index])
  })
  return [...groupsBySignature.values()].filter((group) => group.length > 1)
}

/** Index des lignes contenant au moins une cellule vide. */
export function findRowsWithEmptyCells(rows: SheetRow[], columns: SheetColumn[]): number[] {
  return rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => columns.some((column) => String(row[column.id] ?? '').trim() === ''))
    .map(({ index }) => index)
}

export function removeDuplicateRows(rows: SheetRow[], columns: SheetColumn[]): SheetRow[] {
  const seen = new Set<string>()
  return rows.filter((row) => {
    const signature = rowSignature(row, columns)
    if (seen.has(signature)) return false
    seen.add(signature)
    return true
  })
}

export function trimWhitespaceInRows(rows: SheetRow[]): SheetRow[] {
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    )
  )
}

export function fillEmptyCellsInRows(rows: SheetRow[], columns: SheetColumn[], placeholder: string): SheetRow[] {
  return rows.map((row) => {
    const next = { ...row }
    for (const column of columns) {
      if (String(next[column.id] ?? '').trim() === '') next[column.id] = placeholder
    }
    return next
  })
}
