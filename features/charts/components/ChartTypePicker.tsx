'use client'

// Sélecteur de type de graphique. Boutons -> Client Component.
import { cn } from '@/lib/utils'
import { chartTypeCatalog } from '../types'
import type { ChartType } from '../types'

export function ChartTypePicker({ value, onChange }: { value: ChartType; onChange: (type: ChartType) => void }) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Type de graphique">
      {chartTypeCatalog.map((type) => (
        <button
          key={type.id}
          type="button"
          role="radio"
          aria-checked={value === type.id}
          onClick={() => onChange(type.id)}
          className={cn('btn btn-sm', value === type.id ? 'btn-primary' : 'btn-ghost')}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}
