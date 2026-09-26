'use client'

// Ligne "Si [colonne] [opérateur] [valeur]". Plusieurs <select>/<input> -> Client Component.
import { ruleOperatorLabels, operatorsRequiringValue, type Rule, type RuleOperator } from '../types'
import type { SheetColumn } from '@/types/sheet'

export function ConditionRow({
  columns,
  rule,
  onChange,
}: {
  columns: SheetColumn[]
  rule: Rule
  onChange: (patch: Partial<Rule>) => void
}) {
  const needsValue = operatorsRequiringValue.includes(rule.operator)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="badge badge-primary">Si</span>
      <select
        className="select select-bordered select-sm"
        value={rule.conditionColumnId}
        onChange={(e) => onChange({ conditionColumnId: e.target.value })}
      >
        {columns.map((column) => (
          <option key={column.id} value={column.id}>
            {column.label}
          </option>
        ))}
      </select>
      <select
        className="select select-bordered select-sm"
        value={rule.operator}
        onChange={(e) => onChange({ operator: e.target.value as RuleOperator })}
      >
        {Object.entries(ruleOperatorLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {needsValue && (
        <input
          type="text"
          className="input input-bordered input-sm w-40"
          placeholder="Valeur"
          value={rule.comparisonValue}
          onChange={(e) => onChange({ comparisonValue: e.target.value })}
        />
      )}
    </div>
  )
}
