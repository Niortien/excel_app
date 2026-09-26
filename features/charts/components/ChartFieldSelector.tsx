'use client'

// Sélecteurs de colonnes catégorie/valeur. <select> -> Client Component.
import type { SheetColumn } from '@/types/sheet'

export function ChartFieldSelector({
  columns,
  numericColumns,
  categoryColumnId,
  valueColumnId,
  onCategoryChange,
  onValueChange,
}: {
  columns: SheetColumn[]
  numericColumns: SheetColumn[]
  categoryColumnId: string
  valueColumnId: string
  onCategoryChange: (columnId: string) => void
  onValueChange: (columnId: string) => void
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="form-control">
        <span className="label-text mb-1 text-xs">Regrouper par</span>
        <select className="select select-bordered select-sm" value={categoryColumnId} onChange={(e) => onCategoryChange(e.target.value)}>
          {columns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="form-control">
        <span className="label-text mb-1 text-xs">Valeur à additionner</span>
        <select className="select select-bordered select-sm" value={valueColumnId} onChange={(e) => onValueChange(e.target.value)}>
          {(numericColumns.length > 0 ? numericColumns : columns).map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
