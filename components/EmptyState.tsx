// Server Component : bloc d'état vide générique, réutilisé partout où une liste/un aperçu peut être vide.
import type { TablerIcon } from '@tabler/icons-react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: TablerIcon
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 px-6 py-14 text-center">
      <Icon size={32} className="text-base-content/30" />
      <div>
        <p className="font-medium text-base-content">{title}</p>
        {description && <p className="mt-1 text-sm text-base-content/60">{description}</p>}
      </div>
      {action}
    </div>
  )
}
