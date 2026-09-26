'use client'

// Liste des projets récents sur la page d'accueil. Interactif (bouton de suppression),
// donc Client Component ; les données proviennent de useRecentProjects (TanStack Query).
import Link from 'next/link'
import { IconFileSpreadsheet, IconTrash } from '@tabler/icons-react'
import { EmptyState } from '@/components/EmptyState'
import { formatDateTime } from '@/lib/formatters'
import { useRecentProjects, useRemoveRecentProject } from '../hooks/use-recent-projects'

export function RecentProjectsList() {
  const { data: projects, isLoading } = useRecentProjects()
  const removeProject = useRemoveRecentProject()

  if (isLoading) {
    return <p className="text-sm text-base-content/60">Chargement des projets récents...</p>
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={IconFileSpreadsheet}
        title="Aucun projet pour le moment"
        description="Les fichiers que vous importez apparaîtront ici pour y revenir rapidement."
      />
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-base-300 rounded-box border border-base-300">
      {projects.map((project) => (
        <li key={project.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href={`/sheet/${project.id}`} className="flex min-w-0 flex-1 items-center gap-3">
            <IconFileSpreadsheet size={20} className="shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block truncate font-medium text-base-content">{project.name}</span>
              <span className="block text-xs text-base-content/60">
                {project.rowCount} lignes · {project.columnCount} colonnes · modifié le {formatDateTime(project.updatedAt)}
              </span>
            </span>
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            aria-label={`Retirer ${project.name} des projets récents`}
            onClick={() => removeProject.mutate(project.id)}
          >
            <IconTrash size={16} />
          </button>
        </li>
      ))}
    </ul>
  )
}
