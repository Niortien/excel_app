'use client'

// Liste à cocher des actions de nettoyage disponibles. Interactif -> Client Component.
import { ExcelEquivalentHint } from '@/components/ExcelEquivalentHint'
import type { CleaningActionDefinition, CleaningActionId } from '../types'

export function CleaningActionsChecklist({
  actions,
  selectedActions,
  onToggle,
}: {
  actions: CleaningActionDefinition[]
  selectedActions: CleaningActionId[]
  onToggle: (actionId: CleaningActionId) => void
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold text-base-content">Que voulez-vous corriger ?</legend>
      {actions.map((action) => (
        <label
          key={action.id}
          className="flex cursor-pointer items-center gap-2 rounded-box border border-base-300 px-3 py-2.5"
        >
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={selectedActions.includes(action.id)}
            onChange={() => onToggle(action.id)}
          />
          <span className="flex flex-1 items-center gap-1.5 text-sm text-base-content">
            {action.label}
            <ExcelEquivalentHint text={action.excelEquivalent} />
          </span>
        </label>
      ))}
    </fieldset>
  )
}
