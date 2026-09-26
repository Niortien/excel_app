import type { SheetColumn, SheetData, SheetRow } from '@/types/sheet'

export type LookupWizardStepId = 'select-file' | 'map-keys' | 'preview'

export interface SecondTable {
  fileName: string
  columns: SheetColumn[]
  rows: SheetRow[]
}

export interface LookupMergeResult {
  data: SheetData
  unmatchedRowIndexes: number[]
}
