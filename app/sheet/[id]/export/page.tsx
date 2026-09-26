import type { Metadata } from 'next'
import { ExportView } from '@/features/export/components/ExportView'

export const metadata: Metadata = { title: 'Exporter — ExcelFacile' }

// Server Component : assemble uniquement la vue client d'export.
export default function ExportPage() {
  return <ExportView />
}
