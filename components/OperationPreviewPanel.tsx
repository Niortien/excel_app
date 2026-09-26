'use client'

// Client Component : porte les boutons de validation/annulation (gestionnaires d'événements).
// Affiche systématiquement un aperçu avant application définitive + la phrase pédagogique
// reliant l'opération à sa fonction Excel équivalente (exigence transverse du produit).
import { IconWand } from '@tabler/icons-react'
import { ExcelEquivalentHint } from './ExcelEquivalentHint'

interface OperationPreviewPanelProps {
  title: string
  /** Phrase en langage naturel, ex: "3 doublons seront supprimés" */
  summary: string
  /** Ex: "Ceci correspond à la fonction Excel SUPPRIMER LES DOUBLONS" */
  excelEquivalent: string
  preview: React.ReactNode
  onValidate: () => void
  onCancel: () => void
  isApplying?: boolean
  validateLabel?: string
}

export function OperationPreviewPanel({
  title,
  summary,
  excelEquivalent,
  preview,
  onValidate,
  onCancel,
  isApplying = false,
  validateLabel = 'Valider',
}: OperationPreviewPanelProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-5">
      <header className="flex items-start gap-2">
        <IconWand size={18} className="mt-0.5 shrink-0 text-primary" />
        <div>
          <h3 className="font-semibold text-base-content">{title}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-base-content/70">
            {summary}
            <ExcelEquivalentHint text={excelEquivalent} />
          </p>
        </div>
      </header>

      <div>{preview}</div>

      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={isApplying}>
          Annuler
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={onValidate} disabled={isApplying}>
          {isApplying ? 'Application...' : validateLabel}
        </button>
      </div>
    </section>
  )
}
