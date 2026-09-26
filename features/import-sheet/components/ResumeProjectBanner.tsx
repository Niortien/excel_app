'use client'

// Déclencheur externe (Hook Model) : remet en avant le dernier projet travaillé, pour que
// revenir sur l'app soit un aller direct au travail en cours plutôt qu'un nouveau départ.
// Client Component : dépend de useRecentProjects (TanStack Query). Ne s'affiche que s'il y a
// réellement un projet récent — jamais de relance factice.
import Link from 'next/link'
import { IconArrowRight, IconFileSpreadsheet } from '@tabler/icons-react'
import { formatDateTime } from '@/lib/formatters'
import { useRecentProjects } from '../hooks/use-recent-projects'

export function ResumeProjectBanner() {
  const { data: projects } = useRecentProjects()
  const mostRecent = projects?.[0]

  if (!mostRecent) return null

  return (
    <Link
      href={`/sheet/${mostRecent.id}`}
      className="group flex items-center gap-3 rounded-box border border-primary/30 bg-[var(--ledger-soft)] px-4 py-3 transition-colors hover:border-primary"
    >
      <IconFileSpreadsheet size={22} className="shrink-0 text-primary" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-[var(--ink-muted)]">Reprendre où vous en étiez</span>
        <span className="block truncate font-medium text-base-content">
          {mostRecent.name} <span className="font-normal text-[var(--ink-muted)]">— modifié {formatDateTime(mostRecent.updatedAt)}</span>
        </span>
      </span>
      <IconArrowRight size={18} className="shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
