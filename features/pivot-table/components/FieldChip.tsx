'use client'

// Jeton représentant une colonne, déplaçable en glisser-déposer HTML5 natif (draggable) et
// activable au clavier via les boutons fournis par le parent (onAddToGroup/onAddToAggregate).
import { IconGripVertical } from '@tabler/icons-react'
import type { SheetColumn } from '@/types/sheet'

export function FieldChip({
  column,
  onAddToGroup,
  onAddToAggregate,
}: {
  column: SheetColumn
  onAddToGroup: () => void
  onAddToAggregate: () => void
}) {
  return (
    <div
      draggable
      onDragStart={(event) => event.dataTransfer.setData('text/plain', column.id)}
      className="flex items-center gap-1 rounded-full border border-base-300 bg-base-100 py-1 pl-2 pr-1 text-sm"
    >
      <IconGripVertical size={14} className="text-base-content/30" aria-hidden />
      {column.label}
      <button type="button" className="btn btn-ghost btn-xs" onClick={onAddToGroup}>
        Regrouper
      </button>
      <button type="button" className="btn btn-ghost btn-xs" onClick={onAddToAggregate}>
        Calculer
      </button>
    </div>
  )
}
