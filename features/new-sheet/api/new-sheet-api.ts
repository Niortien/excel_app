// TODO backend : à remplacer par POST /sheets (création sans fichier). Génère localement
// en attendant, avec le même contrat de retour qu'import-sheet-api.ts::confirmImport.
import { slugifyColumnLabel } from '@/features/import-sheet/utils/slugify-column-label'
import type { SheetColumn, SheetData, SheetProject, SheetRow } from '@/types/sheet'

const STARTER_COLUMN_LABELS = ['Colonne A', 'Colonne B', 'Colonne C']
const STARTER_ROW_COUNT = 8

export async function createBlankSheet(projectName: string): Promise<{ project: SheetProject; data: SheetData }> {
  const usedIds = new Set<string>()
  const columns: SheetColumn[] = STARTER_COLUMN_LABELS.map((label) => ({
    id: slugifyColumnLabel(label, usedIds),
    label,
    dataType: 'text',
    hasEmptyValues: true,
  }))

  const rows: SheetRow[] = Array.from({ length: STARTER_ROW_COUNT }, () =>
    Object.fromEntries(columns.map((column) => [column.id, '']))
  )

  const now = new Date().toISOString()
  const project: SheetProject = {
    id: crypto.randomUUID(),
    name: projectName.trim() || 'Nouveau tableau',
    sourceFileName: 'Tableau créé manuellement',
    rowCount: rows.length,
    columnCount: columns.length,
    createdAt: now,
    updatedAt: now,
  }

  return { project, data: { columns, rows } }
}
