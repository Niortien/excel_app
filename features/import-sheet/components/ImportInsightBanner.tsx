// Récompense variable (Hook Model) : phrase spécifique calculée à partir du fichier réel de
// l'utilisateur, jamais un "Import réussi" générique. Traitement visuel distinct (or-tampon)
// pour marquer ce moment comme la seule touche de couleur forte de l'assistant.
import { IconSparkles } from '@tabler/icons-react'

export function ImportInsightBanner({ insight }: { insight: string }) {
  return (
    <p className="flex items-center gap-2 rounded-box border border-accent/30 bg-[var(--stamp-soft)] px-3 py-2 text-sm text-base-content">
      <IconSparkles size={16} className="shrink-0 text-accent" />
      {insight}
    </p>
  )
}
