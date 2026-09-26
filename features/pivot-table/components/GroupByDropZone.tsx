'use client'

// Zone de dépôt "Regrouper par" : accepte le glisser-déposer HTML5 et affiche les colonnes
// choisies avec un bouton de retrait (alternative clavier complète).
import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { SheetColumn } from '@/types/sheet'

export function GroupByDropZone({
  allColumns,
  selectedColumnIds,
  onDropColumn,
  onRemove,
}: {
  allColumns: SheetColumn[]
  selectedColumnIds: string[]
  onDropColumn: (columnId: string) => void
  onRemove: (columnId: string) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const selectedColumns = selectedColumnIds
    .map((id) => allColumns.find((c) => c.id === id))
    .filter((c): c is SheetColumn => !!c)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        onDropColumn(e.dataTransfer.getData('text/plain'))
      }}
      className={cn(
        'flex min-h-16 flex-col gap-2 rounded-box border-2 border-dashed p-3',
        isDragOver ? 'border-primary bg-primary/5' : 'border-base-300'
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Regrouper par</p>
      {selectedColumns.length === 0 ? (
        <p className="text-sm text-base-content/40">Glissez une colonne ici, ou utilisez le bouton « Regrouper »</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedColumns.map((column) => (
            <span key={column.id} className="badge badge-primary gap-1">
              {column.label}
              <button
                type="button"
                onClick={() => onRemove(column.id)}
                aria-label={`Retirer ${column.label} du regroupement`}
              >
                <IconX size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
