import { SheetWorkspaceShell } from '@/features/sheet-workspace/components/SheetWorkspaceShell'

// Server Component : lit le paramètre de route dynamique et assemble la coquille du workspace.
// Le nom affiché est résolu côté client par SheetWorkspaceShell (session en mémoire),
// faute de backend pour le récupérer ici côté serveur.
export default async function SheetLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <SheetWorkspaceShell projectId={id}>{children}</SheetWorkspaceShell>
}
