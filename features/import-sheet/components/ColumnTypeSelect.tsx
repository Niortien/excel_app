'use client'

// Sélecteur de type pour une colonne détectée : un <select> a nécessairement besoin
// d'un gestionnaire onChange, donc Client Component.
import { columnTypeOptions } from '@/lib/column-types'
import type { ColumnDataType } from '@/types/sheet'

export function ColumnTypeSelect({
  columnLabel,
  value,
  onChange,
}: {
  columnLabel: string
  value: ColumnDataType
  onChange: (dataType: ColumnDataType) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="sr-only">Type de la colonne {columnLabel}</span>
      <select
        className="select select-bordered select-sm"
        value={value}
        onChange={(event) => onChange(event.target.value as ColumnDataType)}
      >
        {columnTypeOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
