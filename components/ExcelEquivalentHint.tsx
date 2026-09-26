'use client'

// Client Component : l'info-bulle s'ouvre/se ferme au survol et au focus clavier (état local).
// Affiche la correspondance technique Excel, jamais visible par défaut — uniquement à la demande.
import { IconInfoCircle } from '@tabler/icons-react'

export function ExcelEquivalentHint({ text }: { text: string }) {
  return (
    <span className="tooltip tooltip-top" data-tip={text}>
      <button
        type="button"
        className="text-base-content/40 hover:text-base-content/70 focus-visible:text-base-content/70"
        aria-label={`Équivalence technique Excel : ${text}`}
      >
        <IconInfoCircle size={16} />
      </button>
    </span>
  )
}
