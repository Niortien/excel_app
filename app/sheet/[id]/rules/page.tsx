import type { Metadata } from 'next'
import { RuleBuilderView } from '@/features/rule-builder/components/RuleBuilderView'

export const metadata: Metadata = { title: 'Règles — ExcelFacile' }

// Server Component : assemble uniquement la vue client du constructeur de règles.
export default function RulesPage() {
  return <RuleBuilderView />
}
