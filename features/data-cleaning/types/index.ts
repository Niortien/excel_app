export type CleaningActionId = 'remove-duplicates' | 'trim-whitespace' | 'fill-empty-cells'

export interface CleaningIssuesSummary {
  duplicateGroups: number[][]
  rowsWithEmptyCells: number[]
}

export interface CleaningActionDefinition {
  id: CleaningActionId
  label: string
  excelEquivalent: string
}
