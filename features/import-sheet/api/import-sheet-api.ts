// Appels liés à l'import d'un fichier.
// TODO backend : `parseSpreadsheetFile` et `confirmImport` s'exécutent aujourd'hui entièrement
// côté client (pas de backend NestJS branché). Le contrat (signature async, formes de retour)
// est celui attendu d'un futur POST /sheets/import et POST /sheets, pour un remplacement direct.
import { detectColumnType } from '../utils/column-type-detector'
import { parseSpreadsheetFile as parseRawSpreadsheet } from '../utils/parse-spreadsheet-file'
import { slugifyColumnLabel } from '../utils/slugify-column-label'
import type { ImportPreviewResult } from '../types'
import type { SheetProject } from '@/types/sheet'

export async function parseSpreadsheetFile(file: File): Promise<ImportPreviewResult> {
  const raw = await parseRawSpreadsheet(file)
  const usedIds = new Set<string>()

  const columns = raw.headers.map((label, index) => {
    const id = slugifyColumnLabel(label, usedIds)
    const sampleValues = raw.rows.map((row) => row[index] ?? '')
    return {
      id,
      label,
      dataType: detectColumnType(sampleValues),
      hasEmptyValues: sampleValues.some((value) => value.trim().length === 0),
    }
  })

  const rows = raw.rows.map((row) =>
    Object.fromEntries(columns.map((column, index) => [column.id, row[index] ?? '']))
  )

  return { fileName: file.name, columns, rows }
}

export async function confirmImport(input: {
  preview: ImportPreviewResult
  projectName: string
}): Promise<SheetProject> {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: input.projectName.trim() || input.preview.fileName,
    sourceFileName: input.preview.fileName,
    rowCount: input.preview.rows.length,
    columnCount: input.preview.columns.length,
    createdAt: now,
    updatedAt: now,
  }
}
