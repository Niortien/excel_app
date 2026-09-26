import type { Metadata } from 'next'
import { LookupMergeView } from '@/features/lookup-merge/components/LookupMergeView'

export const metadata: Metadata = { title: 'Rechercher / fusionner — ExcelFacile' }

// Server Component : assemble uniquement la vue client de l'assistant de fusion.
export default function LookupPage() {
  return <LookupMergeView />
}
