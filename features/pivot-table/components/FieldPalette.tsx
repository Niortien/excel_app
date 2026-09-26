'use client'

// Palette des colonnes disponibles à glisser (ou ajouter au clavier) vers les zones cibles.
import type { SheetColumn } from '@/types/sheet'
import { FieldChip } from './FieldChip'

export function FieldPalette({
  columns,
  onAddToGroup,
  onAddToAggregate,
}: {
  columns: SheetColumn[]
  onAddToGroup: (columnId: string) => void
  onAddToAggregate: (columnId: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-base-content">Vos colonnes</p>
      <div className="flex flex-wrap gap-2">
        {columns.map((column) => (
          <FieldChip
            key={column.id}
            column={column}
            onAddToGroup={() => onAddToGroup(column.id)}
            onAddToAggregate={() => onAddToAggregate(column.id)}
          />
        ))}
      </div>
    </div>
  )
}
