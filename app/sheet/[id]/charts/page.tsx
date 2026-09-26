import type { Metadata } from 'next'
import { ChartBuilderView } from '@/features/charts/components/ChartBuilderView'

export const metadata: Metadata = { title: 'Graphique — ExcelFacile' }

// Server Component : assemble uniquement la vue client du générateur de graphiques.
export default function ChartsPage() {
  return <ChartBuilderView />
}
