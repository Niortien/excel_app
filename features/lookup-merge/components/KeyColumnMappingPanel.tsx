'use client'

// Mapping visuel des colonnes clés entre les deux tableaux + choix des colonnes à ramener.
// Deux <select> et des cases à cocher -> Client Component.
import { ExcelEquivalentHint } from '@/components/ExcelEquivalentHint'
import type { SheetColumn } from '@/types/sheet'

interface KeyColumnMappingPanelProps {
  primaryColumns: SheetColumn[]
  secondaryColumns: SheetColumn[]
  primaryKeyColumnId: string
  secondaryKeyColumnId: string
  columnIdsToImport: string[]
  onPrimaryKeyChange: (columnId: string) => void
  onSecondaryKeyChange: (columnId: string) => void
  onToggleColumnToImport: (columnId: string) => void
}

export function KeyColumnMappingPanel({
  primaryColumns,
  secondaryColumns,
  primaryKeyColumnId,
  secondaryKeyColumnId,
  columnIdsToImport,
  onPrimaryKeyChange,
  onSecondaryKeyChange,
  onToggleColumnToImport,
}: KeyColumnMappingPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-base-content">
          Quelle colonne identifie chaque ligne dans les deux tableaux ?
          <ExcelEquivalentHint text="Colonnes clés de la fonction RECHERCHEV" />
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="form-control">
            <span className="label-text mb-1 text-xs">Dans votre tableau actuel</span>
            <select
              className="select select-bordered select-sm"
              value={primaryKeyColumnId}
              onChange={(e) => onPrimaryKeyChange(e.target.value)}
            >
              <option value="" disabled>
                Choisir une colonne
              </option>
              {primaryColumns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-1 text-xs">Dans le second tableau</span>
            <select
              className="select select-bordered select-sm"
              value={secondaryKeyColumnId}
              onChange={(e) => onSecondaryKeyChange(e.target.value)}
            >
              {secondaryColumns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-base-content">
          Quelles colonnes du second tableau voulez-vous ramener ?
        </legend>
        <div className="flex flex-wrap gap-2">
          {secondaryColumns
            .filter((c) => c.id !== secondaryKeyColumnId)
            .map((column) => (
              <label
                key={column.id}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-base-300 px-3 py-1.5 text-sm"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={columnIdsToImport.includes(column.id)}
                  onChange={() => onToggleColumnToImport(column.id)}
                />
                {column.label}
              </label>
            ))}
        </div>
      </fieldset>
    </div>
  )
}
