// Fonction pure : construit un nom de fichier propre à partir du nom du projet.
import type { ExportFormat } from '../types'

export function buildExportFilename(projectName: string, format: ExportFormat): string {
  const base =
    projectName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'export-excelfacile'

  return `${base}.${format}`
}
