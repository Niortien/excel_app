import type { Metadata } from 'next'
import { DataCleaningView } from '@/features/data-cleaning/components/DataCleaningView'

export const metadata: Metadata = { title: 'Nettoyer — ExcelFacile' }

// Server Component : assemble uniquement la vue client du nettoyage guidé.
export default function CleanPage() {
  return <DataCleaningView />
}
