// Lecture d'un fichier .xlsx/.xls/.csv en mémoire, côté navigateur, via SheetJS.
// Renvoie une structure brute (en-têtes + lignes de texte) : la détection de type
// des colonnes est faite séparément par column-type-detector.
import * as XLSX from 'xlsx'

export interface RawSpreadsheet {
  headers: string[]
  rows: string[][]
}

export async function parseSpreadsheetFile(file: File): Promise<RawSpreadsheet> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) return { headers: [], rows: [] }

  const sheet = workbook.Sheets[firstSheetName]
  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false, defval: '' })
  const [headerRow, ...dataRows] = rawRows

  const headers = (headerRow ?? []).map((cell, index) => {
    const label = String(cell ?? '').trim()
    return label.length > 0 ? label : `Colonne ${index + 1}`
  })

  const rows = dataRows.map((row) => headers.map((_, index) => String(row[index] ?? '').trim()))

  return { headers, rows }
}
