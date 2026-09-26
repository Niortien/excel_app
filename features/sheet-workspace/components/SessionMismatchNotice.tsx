// Server Component : message d'erreur explicite (pas de jargon technique) affiché quand la
// feuille demandée n'est plus disponible en session — cas d'un accès direct/rafraîchissement
// sans backend pour recharger les données. <Link> ne nécessite pas de Client Component.
import Link from 'next/link'
import { IconAlertTriangle } from '@tabler/icons-react'

export function SessionMismatchNotice() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      <IconAlertTriangle size={32} className="text-warning" />
      <div>
        <p className="font-medium text-base-content">Cette feuille n&apos;est plus disponible</p>
        <p className="mt-1 text-sm text-base-content/60">
          Vos données de travail sont conservées dans votre navigateur le temps de la session. Réimportez votre
          fichier pour continuer.
        </p>
      </div>
      <Link href="/import" className="btn btn-primary btn-sm">
        Importer un fichier
      </Link>
    </div>
  )
}
