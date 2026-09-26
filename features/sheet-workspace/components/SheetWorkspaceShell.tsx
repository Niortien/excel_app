'use client'

// Client Component : met en évidence l'onglet actif via usePathname (API navigateur) et
// porte les boutons annuler/rétablir. Enveloppe toutes les sous-pages /sheet/[id]/*.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useSheetSession } from '@/hooks/use-sheet-session'
import { useUndoRedo } from '@/hooks/use-undo-redo'
import { workspaceSections } from '../utils/workspace-sections'

export function SheetWorkspaceShell({
  projectId,
  children,
}: {
  projectId: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { undo, redo, canUndo, canRedo } = useUndoRedo()
  const { project } = useSheetSession()
  const projectName = project && project.id === projectId ? project.name : 'Feuille de travail'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-base-300 bg-base-100 px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Link href="/" className="text-xs text-base-content/50 hover:underline">
                ← Accueil
              </Link>
              <h1 className="truncate text-lg font-bold text-base-content">{projectName}</h1>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Annuler la dernière opération"
              >
                <IconArrowBackUp size={16} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Rétablir l'opération annulée"
              >
                <IconArrowForwardUp size={16} />
              </button>
            </div>
          </div>

          <nav aria-label="Sections de la feuille">
            <ul className="flex flex-wrap gap-1">
              <li>
                <Link
                  href={`/sheet/${projectId}`}
                  className={cn(
                    'btn btn-sm',
                    pathname === `/sheet/${projectId}` ? 'btn-primary' : 'btn-ghost'
                  )}
                >
                  Tableau
                </Link>
              </li>
              {workspaceSections.map((section) => {
                const href = `/sheet/${projectId}/${section.id}`
                const isActive = pathname === href
                return (
                  <li key={section.id}>
                    <Link href={href} className={cn('btn btn-sm', isActive ? 'btn-primary' : 'btn-ghost')}>
                      {section.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  )
}
