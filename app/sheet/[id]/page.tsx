import type { Metadata } from 'next'
import { SheetWorkspaceView } from '@/features/sheet-workspace/components/SheetWorkspaceView'

export const metadata: Metadata = {
  title: 'Espace de travail — ExcelFacile',
}

// Server Component : transmet uniquement l'identifiant de route à la vue client.
export default async function SheetWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <SheetWorkspaceView projectId={id} />
}
