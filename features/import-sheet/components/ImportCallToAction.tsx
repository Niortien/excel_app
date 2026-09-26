// Server Component : colonne gauche du hero, statique (le comportement de navigation est
// délégué à <Link>). Porte le déclencheur interne (le "pourquoi maintenant") et les deux
// actions possibles à l'écran d'accueil : importer un fichier existant, ou partir de zéro.
import Link from 'next/link'
import { IconTable, IconUpload } from '@tabler/icons-react'

export function ImportCallToAction() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl font-semibold leading-[1.1] text-base-content sm:text-5xl">
        Vos fichiers Excel,
        <br />
        enfin faciles à tenir à jour.
      </h1>
      <p className="max-w-md text-base text-[var(--ink-muted)]">
        Encore une liste à trier avant la réunion ? Déposez le fichier : ExcelFacile repère vos
        colonnes, vous gardez le contrôle du résultat.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/import" className="btn btn-primary btn-lg gap-2">
          <IconUpload size={20} />
          Importer un fichier
        </Link>
        <Link href="/new" className="btn btn-ghost gap-2">
          <IconTable size={18} />
          Créer une feuille vierge
        </Link>
      </div>
      <p className="text-xs text-[var(--ink-muted)]">Excel (.xlsx, .xls) ou CSV.</p>
    </div>
  )
}
