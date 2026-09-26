'use client'

// Choix du format d'export. Boutons radio -> Client Component.
import { exportFormatCatalog } from '../types'
import type { ExportFormat } from '../types'

export function ExportFormatPicker({ value, onChange }: { value: ExportFormat; onChange: (format: ExportFormat) => void }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold text-base-content">Format du fichier</legend>
      {exportFormatCatalog.map((format) => (
        <label
          key={format.id}
          className="flex cursor-pointer items-center gap-3 rounded-box border border-base-300 px-3 py-2.5"
        >
          <input
            type="radio"
            name="export-format"
            className="radio radio-sm"
            checked={value === format.id}
            onChange={() => onChange(format.id)}
          />
          <span>
            <span className="block text-sm font-medium text-base-content">{format.label}</span>
            <span className="block text-xs text-base-content/60">{format.description}</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}
