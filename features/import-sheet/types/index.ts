import type { SheetColumn, SheetRow } from '@/types/sheet'

export type ImportWizardStepId = 'select-file' | 'review-columns' | 'confirm'

export interface ImportPreviewResult {
  fileName: string
  columns: SheetColumn[]
  rows: SheetRow[]
}

export interface RecentProjectSummary {
  id: string
  name: string
  sourceFileName: string
  rowCount: number
  columnCount: number
  updatedAt: string
}
