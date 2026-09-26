// Server Component : barre d'actions purement composée de liens de navigation vers les
// sous-pages de la feuille. Aucun état ni gestionnaire d'événement propre.
import Link from 'next/link'
import {
  IconArrowsCross,
  IconCalculator,
  IconEraser,
  IconChartBar,
  IconDownload,
  IconSitemap,
} from '@tabler/icons-react'
import type { TablerIcon } from '@tabler/icons-react'
import type { WorkspaceSectionId } from '../types'
import { workspaceSections } from '../utils/workspace-sections'

const iconBySection: Record<WorkspaceSectionId, TablerIcon> = {
  calculate: IconCalculator,
  clean: IconEraser,
  lookup: IconArrowsCross,
  pivot: IconSitemap,
  rules: IconSitemap,
  charts: IconChartBar,
  export: IconDownload,
}

export function ActionToolbar({ projectId }: { projectId: string }) {
  return (
    <nav aria-label="Opérations disponibles sur la feuille" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {workspaceSections.map((section) => {
        const Icon = iconBySection[section.id]
        return (
          <Link
            key={section.id}
            href={`/sheet/${projectId}/${section.id}`}
            className="flex flex-col items-start gap-2 rounded-box border border-base-300 p-4 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <Icon size={20} className="text-primary" />
            <span className="font-medium text-base-content">{section.label}</span>
            <span className="text-xs text-base-content/60">{section.description}</span>
          </Link>
        )
      })}
    </nav>
  )
}
