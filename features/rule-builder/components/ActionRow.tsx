'use client'

// Ligne "Alors [nouvelle colonne] = [valeur] sinon [valeur]". Client Component (inputs contrôlés).
import type { Rule } from '../types'

export function ActionRow({ rule, onChange }: { rule: Rule; onChange: (patch: Partial<Rule>) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="badge badge-secondary">Alors</span>
      <span className="text-sm text-base-content/70">remplir la colonne</span>
      <input
        type="text"
        className="input input-bordered input-sm w-44"
        placeholder="Ex : Statut"
        value={rule.outputColumnName}
        onChange={(e) => onChange({ outputColumnName: e.target.value })}
      />
      <span className="text-sm text-base-content/70">avec</span>
      <input
        type="text"
        className="input input-bordered input-sm w-28"
        value={rule.thenValue}
        onChange={(e) => onChange({ thenValue: e.target.value })}
      />
      <span className="text-sm text-base-content/70">sinon</span>
      <input
        type="text"
        className="input input-bordered input-sm w-28"
        value={rule.elseValue}
        onChange={(e) => onChange({ elseValue: e.target.value })}
      />
    </div>
  )
}
