'use client'

// Bouton autonome (aucune sélection requise) pour ajouter une ligne vide en fin de tableau.
import { IconRowInsertBottom } from '@tabler/icons-react'
import { useRowActions } from '../hooks/use-row-actions'

export function AddRowButton() {
  const { addRow } = useRowActions()

  return (
    <button type="button" className="btn btn-outline btn-sm gap-2" onClick={addRow}>
      <IconRowInsertBottom size={16} />
      Ajouter une ligne
    </button>
  )
}
