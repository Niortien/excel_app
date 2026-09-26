'use client'

// Formulaire dont les champs affichés dépendent de l'action choisie. Regroupé en un seul
// composant car les cinq actions partagent la même mécanique simple de champs contrôlés.
import { columnTypeOptions } from '@/lib/column-types'
import type { ColumnDataType, SheetColumn } from '@/types/sheet'
import type { ColumnToolActionType } from '../types'

interface ColumnToolFormProps {
  actionType: ColumnToolActionType
  columns: SheetColumn[]
  form: {
    columnId: string
    newLabel: string
    newType: ColumnDataType
    delimiter: string
    firstLabel: string
    secondLabel: string
    mergeColumnIdA: string
    mergeColumnIdB: string
    separator: string
    mergeLabel: string
  }
  onChange: (patch: Partial<ColumnToolFormProps['form']>) => void
}

export function ColumnToolForm({ actionType, columns, form, onChange }: ColumnToolFormProps) {
  if (actionType === 'add') {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <TextField label="Nom de la colonne" value={form.newLabel} onChange={(v) => onChange({ newLabel: v })} />
        <label className="form-control">
          <span className="label-text mb-1 text-xs">Type</span>
          <select
            className="select select-bordered select-sm"
            value={form.newType}
            onChange={(e) => onChange({ newType: e.target.value as ColumnDataType })}
          >
            {columnTypeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  }

  if (actionType === 'rename') {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <ColumnSelect label="Colonne" columns={columns} value={form.columnId} onChange={(v) => onChange({ columnId: v })} />
        <TextField label="Nouveau nom" value={form.newLabel} onChange={(v) => onChange({ newLabel: v })} />
      </div>
    )
  }

  if (actionType === 'convert-type') {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <ColumnSelect label="Colonne" columns={columns} value={form.columnId} onChange={(v) => onChange({ columnId: v })} />
        <label className="form-control">
          <span className="label-text mb-1 text-xs">Nouveau type</span>
          <select
            className="select select-bordered select-sm"
            value={form.newType}
            onChange={(e) => onChange({ newType: e.target.value as ColumnDataType })}
          >
            {columnTypeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  }

  if (actionType === 'split') {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <ColumnSelect label="Colonne à scinder" columns={columns} value={form.columnId} onChange={(v) => onChange({ columnId: v })} />
        <TextField label="Séparateur" value={form.delimiter} onChange={(v) => onChange({ delimiter: v })} className="w-20" />
        <TextField label="Nom colonne 1" value={form.firstLabel} onChange={(v) => onChange({ firstLabel: v })} />
        <TextField label="Nom colonne 2" value={form.secondLabel} onChange={(v) => onChange({ secondLabel: v })} />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <ColumnSelect label="Colonne 1" columns={columns} value={form.mergeColumnIdA} onChange={(v) => onChange({ mergeColumnIdA: v })} />
      <ColumnSelect label="Colonne 2" columns={columns} value={form.mergeColumnIdB} onChange={(v) => onChange({ mergeColumnIdB: v })} />
      <TextField label="Séparateur" value={form.separator} onChange={(v) => onChange({ separator: v })} className="w-20" />
      <TextField label="Nom de la nouvelle colonne" value={form.mergeLabel} onChange={(v) => onChange({ mergeLabel: v })} />
    </div>
  )
}

function ColumnSelect({
  label,
  columns,
  value,
  onChange,
}: {
  label: string
  columns: SheetColumn[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="form-control">
      <span className="label-text mb-1 text-xs">{label}</span>
      <select className="select select-bordered select-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>
          Choisir
        </option>
        {columns.map((column) => (
          <option key={column.id} value={column.id}>
            {column.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <label className="form-control">
      <span className="label-text mb-1 text-xs">{label}</span>
      <input
        type="text"
        className={`input input-bordered input-sm ${className ?? 'w-40'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
