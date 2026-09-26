'use client'

// Barre d'actions rapides qui apparaît uniquement lorsqu'une sélection est active dans le
// tableau. Boutons + champ de saisie en masse -> Client Component.
import { useState } from 'react'
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconClipboardCopy,
  IconCopy,
  IconEraser,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { useSelectionActions } from '../hooks/use-selection-actions'
import { useRowActions } from '../hooks/use-row-actions'
import { SelectionStatsBar } from './SelectionStatsBar'

export function SelectionActionBar() {
  const {
    hasSelection,
    selectionSummary,
    selectedColumnIds,
    copySelection,
    clearContent,
    fillSelection,
    deleteSelectedColumns,
    moveSelectedColumn,
    clearSelection,
  } = useSelectionActions()
  const { canActOnRows, selectedSingleRowIndex, deleteSelectedRows, duplicateSelectedRows, moveSelectedRow } = useRowActions()
  const [fillValue, setFillValue] = useState('')

  if (!hasSelection) return null

  function submitFillValue(event: React.FormEvent) {
    event.preventDefault()
    if (!fillValue.trim()) return
    fillSelection(fillValue)
    setFillValue('')
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-box border border-primary/30 bg-primary/5 px-3 py-2">
      <span className="text-sm font-medium text-base-content">{selectionSummary}</span>

      <form onSubmit={submitFillValue} className="flex items-center gap-1.5">
        <label className="sr-only" htmlFor="selection-fill-value">
          Nouvelle valeur pour la sélection
        </label>
        <input
          id="selection-fill-value"
          type="text"
          value={fillValue}
          onChange={(event) => setFillValue(event.target.value)}
          placeholder="Nouvelle valeur..."
          className="input input-bordered input-xs w-36"
        />
        <button type="submit" className="btn btn-ghost btn-xs gap-1" disabled={!fillValue.trim()}>
          <IconPencil size={14} />
          Appliquer
        </button>
      </form>

      <div className="flex flex-1 flex-wrap justify-end gap-2">
        <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={copySelection}>
          <IconClipboardCopy size={14} />
          Copier
        </button>
        <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={clearContent}>
          <IconEraser size={14} />
          Vider le contenu
        </button>
        {selectedColumnIds.length === 1 && (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-square"
              aria-label="Déplacer la colonne vers la gauche"
              onClick={() => moveSelectedColumn('left')}
            >
              <IconArrowLeft size={14} />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-square"
              aria-label="Déplacer la colonne vers la droite"
              onClick={() => moveSelectedColumn('right')}
            >
              <IconArrowRight size={14} />
            </button>
          </>
        )}
        {selectedColumnIds.length > 0 && (
          <button type="button" className="btn btn-ghost btn-xs gap-1 text-error" onClick={deleteSelectedColumns}>
            <IconTrash size={14} />
            Supprimer {selectedColumnIds.length > 1 ? 'les colonnes' : 'la colonne'}
          </button>
        )}
        {selectedSingleRowIndex !== null && (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-square"
              aria-label="Déplacer la ligne vers le haut"
              onClick={() => moveSelectedRow('up')}
            >
              <IconArrowUp size={14} />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-square"
              aria-label="Déplacer la ligne vers le bas"
              onClick={() => moveSelectedRow('down')}
            >
              <IconArrowDown size={14} />
            </button>
          </>
        )}
        {canActOnRows && (
          <>
            <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={duplicateSelectedRows}>
              <IconCopy size={14} />
              Dupliquer la/les ligne(s)
            </button>
            <button type="button" className="btn btn-ghost btn-xs gap-1 text-error" onClick={deleteSelectedRows}>
              <IconTrash size={14} />
              Supprimer la/les ligne(s)
            </button>
          </>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-square"
          aria-label="Désélectionner"
          onClick={clearSelection}
        >
          <IconX size={14} />
        </button>
      </div>

      <SelectionStatsBar />
    </div>
  )
}
