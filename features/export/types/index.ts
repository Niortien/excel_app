export type ExportFormat = 'xlsx' | 'csv'

export interface ExportFormatDefinition {
  id: ExportFormat
  label: string
  description: string
}

export const exportFormatCatalog: ExportFormatDefinition[] = [
  { id: 'xlsx', label: 'Excel (.xlsx)', description: 'Compatible avec Excel, Google Sheets et LibreOffice' },
  { id: 'csv', label: 'CSV', description: 'Fichier texte simple, compatible avec presque tous les logiciels' },
]
