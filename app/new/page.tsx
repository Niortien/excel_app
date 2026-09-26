import type { Metadata } from 'next'
import { NewSheetView } from '@/features/new-sheet/components/NewSheetView'

export const metadata: Metadata = {
  title: 'Créer une feuille — ExcelFacile',
}

// Server Component : aucune donnée à charger côté serveur, assemble la vue client.
export default function NewSheetPage() {
  return <NewSheetView />
}
