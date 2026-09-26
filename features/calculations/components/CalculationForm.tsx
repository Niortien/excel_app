'use client'

// Formulaire du calcul : colonne de gauche, opérateur, puis une colonne OU un nombre fixe à
// droite. Plusieurs champs contrôlés -> Client Component.
import { mathOperatorLabels } from '../types'
import type { Calculation, MathOperator, RightOperandMode } from '../types'
import type { SheetColumn } from '@/types/sheet'

interface CalculationFormProps {
  columns: SheetColumn[]
  calculation: Calculation
  onChange: (patch: Partial<Calculation>) => void
  onRightModeChange: (mode: RightOperandMode) => void
}

export function CalculationForm({ columns, calculation, onChange, onRightModeChange }: CalculationFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="form-control max-w-sm">
        <span className="label-text mb-1">Nom de la nouvelle colonne</span>
        <input
          type="text"
          className="input input-bordered"
          value={calculation.outputColumnName}
          onChange={(e) => onChange({ outputColumnName: e.target.value })}
          placeholder="Ex : Total TTC"
        />
      </label>

      <div className="flex flex-wrap items-end gap-3">
        <label className="form-control">
          <span className="label-text mb-1 text-xs">Colonne</span>
          <select
            className="select select-bordered select-sm"
            value={calculation.leftColumnId}
            onChange={(e) => onChange({ leftColumnId: e.target.value })}
          >
            <option value="" disabled>
              Choisir
            </option>
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text mb-1 text-xs">Opération</span>
          <select
            className="select select-bordered select-sm"
            value={calculation.operator}
            onChange={(e) => onChange({ operator: e.target.value as MathOperator })}
          >
            {Object.entries(mathOperatorLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-base-content/60">Avec</span>
          <div className="join">
            <button
              type="button"
              className={`btn btn-sm join-item ${calculation.rightMode === 'column' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onRightModeChange('column')}
            >
              une colonne
            </button>
            <button
              type="button"
              className={`btn btn-sm join-item ${calculation.rightMode === 'number' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onRightModeChange('number')}
            >
              un nombre
            </button>
          </div>
        </div>

        {calculation.rightMode === 'column' ? (
          <label className="form-control">
            <span className="label-text mb-1 text-xs">Colonne</span>
            <select
              className="select select-bordered select-sm"
              value={calculation.rightColumnId}
              onChange={(e) => onChange({ rightColumnId: e.target.value })}
            >
              <option value="" disabled>
                Choisir
              </option>
              {columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="form-control">
            <span className="label-text mb-1 text-xs">Nombre</span>
            <input
              type="text"
              inputMode="decimal"
              className="input input-bordered input-sm w-28"
              value={calculation.rightValue}
              onChange={(e) => onChange({ rightValue: e.target.value })}
              placeholder="Ex : 1,2"
            />
          </label>
        )}
      </div>
    </div>
  )
}
