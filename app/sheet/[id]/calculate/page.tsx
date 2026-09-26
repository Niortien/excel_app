import type { Metadata } from 'next'
import { CalculationBuilderView } from '@/features/calculations/components/CalculationBuilderView'

export const metadata: Metadata = { title: 'Calculer — ExcelFacile' }

// Server Component : assemble uniquement la vue client du constructeur de calcul.
export default function CalculatePage() {
  return <CalculationBuilderView />
}
