// Génération du fichier d'export. Contrairement aux autres features, cette opération ne
// nécessite pas de backend : elle transforme les données déjà en mémoire dans le navigateur.
import * as XLSX from 'xlsx'
import type { SheetData } from '@/types/sheet'
import type { ExportFormat } from '../types'

export async function generateExportFile(data: SheetData, format: ExportFormat): Promise<Blob> {
  const header = data.columns.map((column) => column.label)
  const rows = data.rows.map((row) => data.columns.map((column) => row[column.id] ?? ''))
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows])

  if (format === 'csv') {
    const csvContent = XLSX.utils.sheet_to_csv(worksheet)
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille 1')
  const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer
  return new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}
