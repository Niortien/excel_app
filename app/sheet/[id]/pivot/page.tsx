import type { Metadata } from 'next'
import { PivotBuilderView } from '@/features/pivot-table/components/PivotBuilderView'

export const metadata: Metadata = { title: 'Croiser — ExcelFacile' }

// Server Component : assemble uniquement la vue client du constructeur de tableau croisé.
export default function PivotPage() {
  return <PivotBuilderView />
}
