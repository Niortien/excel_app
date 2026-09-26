// Server Component : uniquement de la mise en forme, aucune interactivité propre.
// Les actions (boutons, liens) sont fournies par l'appelant via `actions`, elles peuvent
// donc très bien être des Client Components sans que PageHeader le devienne.
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-base-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-base-content">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-base-content/60">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
