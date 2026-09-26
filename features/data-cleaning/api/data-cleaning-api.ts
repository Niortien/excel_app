// TODO backend : à remplacer par POST /sheets/:id/clean/analyze et /clean/apply.
// Calcul effectué côté client en attendant, avec la même signature async.
import type { SheetData } from '@/types/sheet'
import {
  fillEmptyCellsInRows,
  findDuplicateRowGroups,
  findRowsWithEmptyCells,
  removeDuplicateRows,
  trimWhitespaceInRows,
} from '../utils/cleaning-rules'
import type { CleaningActionId, CleaningIssuesSummary } from '../types'

export async function analyzeCleaningIssues(data: SheetData): Promise<CleaningIssuesSummary> {
  return {
    duplicateGroups: findDuplicateRowGroups(data.rows, data.columns),
    rowsWithEmptyCells: findRowsWithEmptyCells(data.rows, data.columns),
  }
}

export async function applyCleaningActions(data: SheetData, actionIds: CleaningActionId[]): Promise<SheetData> {
  let rows = data.rows
  if (actionIds.includes('trim-whitespace')) rows = trimWhitespaceInRows(rows)
  if (actionIds.includes('remove-duplicates')) rows = removeDuplicateRows(rows, data.columns)
  if (actionIds.includes('fill-empty-cells')) rows = fillEmptyCellsInRows(rows, data.columns, '—')
  return { columns: data.columns, rows }
}
