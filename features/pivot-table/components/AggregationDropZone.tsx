'use client'

// Zone de dépôt "Calculer" : chaque colonne déposée devient une agrégation configurable
// (somme, moyenne...) via un <select>, avec bouton de retrait.
import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { SheetColumn } from '@/types/sheet'
import { aggregationOperationLabels, type AggregationOperation, type PivotAggregation } from '../types'

export function AggregationDropZone({
  allColumns,
  aggregations,
  onDropColumn,
  onOperationChange,
  onRemove,
}: {
  allColumns: SheetColumn[]
  aggregations: PivotAggregation[]
  onDropColumn: (columnId: string) => void
  onOperationChange: (aggregationId: string, operation: AggregationOperation) => void
  onRemove: (aggregationId: string) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)

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
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Calculer</p>
      {aggregations.length === 0 ? (
        <p className="text-sm text-base-content/40">Glissez une colonne ici, ou utilisez le bouton « Calculer »</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {aggregations.map((aggregation) => {
            const column = allColumns.find((c) => c.id === aggregation.columnId)
            return (
              <li key={aggregation.id} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm">{column?.label}</span>
                <select
                  className="select select-bordered select-xs"
                  value={aggregation.operation}
                  onChange={(e) => onOperationChange(aggregation.id, e.target.value as AggregationOperation)}
                >
                  {Object.entries(aggregationOperationLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-square"
                  onClick={() => onRemove(aggregation.id)}
                  aria-label={`Retirer ce calcul sur ${column?.label}`}
                >
                  <IconX size={12} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
