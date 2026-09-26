// Fonctions pures de transformation de colonnes : ajouter, renommer, convertir, scinder,
// fusionner, déplacer.
import { slugifyColumnLabel } from '@/features/import-sheet/utils/slugify-column-label'
import type { ColumnDataType, SheetData, SheetRow } from '@/types/sheet'
import { generateIdSequence, type IdColumnOptions } from './id-sequence'

export function addEmptyColumn(data: SheetData, label: string, dataType: ColumnDataType): SheetData {
  const usedIds = new Set(data.columns.map((c) => c.id))
  const id = slugifyColumnLabel(label, usedIds)
  const columns = [...data.columns, { id, label, dataType, hasEmptyValues: true }]
  const rows = data.rows.map((row) => ({ ...row, [id]: '' }))
  return { columns, rows }
}

/** Ajoute une colonne d'identifiant auto-incrémenté (numéro, lettre ou chiffres romains).
 * Type texte même pour un format numérique : un identifiant n'est pas fait pour être additionné.
 * Le nombre d'identifiants demandé (endAt - startAt + 1) pilote le résultat : si le tableau a
 * moins de lignes que d'identifiants demandés, les lignes manquantes sont ajoutées ; s'il en a
 * plus, les lignes en trop restent vides dans cette colonne. */
export function addIdColumn(data: SheetData, label: string, options: IdColumnOptions): SheetData {
  const usedIds = new Set(data.columns.map((c) => c.id))
  const id = slugifyColumnLabel(label, usedIds)
  const sequence = generateIdSequence(options)
  const count = sequence.length

  const missingRowCount = Math.max(0, count - data.rows.length)
  const rows: SheetRow[] = [...data.rows]
  for (let i = 0; i < missingRowCount; i += 1) {
    rows.push(Object.fromEntries(data.columns.map((c) => [c.id, ''])))
  }

  const columns = [...data.columns, { id, label, dataType: 'text' as const, hasEmptyValues: count < rows.length }]
  const rowsWithId = rows.map((row, index) => ({ ...row, [id]: index < count ? sequence[index] : '' }))
  return { columns, rows: rowsWithId }
}

export function moveColumn(data: SheetData, columnId: string, direction: 'left' | 'right'): SheetData {
  const index = data.columns.findIndex((c) => c.id === columnId)
  const targetIndex = direction === 'left' ? index - 1 : index + 1
  if (index === -1 || targetIndex < 0 || targetIndex >= data.columns.length) return data

  const columns = [...data.columns]
  ;[columns[index], columns[targetIndex]] = [columns[targetIndex], columns[index]]
  return { ...data, columns }
}

export function renameColumn(data: SheetData, columnId: string, newLabel: string): SheetData {
  return { ...data, columns: data.columns.map((c) => (c.id === columnId ? { ...c, label: newLabel } : c)) }
}

export function convertColumnType(data: SheetData, columnId: string, newType: ColumnDataType): SheetData {
  return { ...data, columns: data.columns.map((c) => (c.id === columnId ? { ...c, dataType: newType } : c)) }
}

export function splitColumn(
  data: SheetData,
  columnId: string,
  delimiter: string,
  firstLabel: string,
  secondLabel: string
): SheetData {
  const usedIds = new Set(data.columns.map((c) => c.id))
  const firstId = slugifyColumnLabel(firstLabel, usedIds)
  const secondId = slugifyColumnLabel(secondLabel, usedIds)
  const columnIndex = data.columns.findIndex((c) => c.id === columnId)

  const columns = [...data.columns]
  columns.splice(
    columnIndex + 1,
    0,
    { id: firstId, label: firstLabel, dataType: 'text', hasEmptyValues: false },
    { id: secondId, label: secondLabel, dataType: 'text', hasEmptyValues: false }
  )

  const rows = data.rows.map((row) => {
    const [first = '', second = ''] = String(row[columnId] ?? '').split(delimiter)
    return { ...row, [firstId]: first.trim(), [secondId]: second.trim() }
  })

  return { columns, rows }
}

export function mergeColumns(
  data: SheetData,
  columnIds: [string, string],
  separator: string,
  newLabel: string
): SheetData {
  const usedIds = new Set(data.columns.map((c) => c.id))
  const newId = slugifyColumnLabel(newLabel, usedIds)

  const rows = data.rows.map((row) => ({
    ...row,
    [newId]: columnIds.map((id) => String(row[id] ?? '')).join(separator),
  }))

  return { columns: [...data.columns, { id: newId, label: newLabel, dataType: 'text', hasEmptyValues: false }], rows }
}
