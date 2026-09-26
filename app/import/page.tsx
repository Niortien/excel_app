import type { Metadata } from 'next'
import { ImportSheetView } from '@/features/import-sheet/components/ImportSheetView'

export const metadata: Metadata = {
  title: 'Importer un fichier — ExcelFacile',
}

// Server Component : aucune donnée à charger côté serveur pour cette page, elle se contente
// d'assembler la vue client qui porte tout le wizard d'import.
export default function ImportPage() {
  return <ImportSheetView />
}
