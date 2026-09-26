'use client'

// Affiche le résumé statistique de la sélection (somme, moyenne...) et permet de l'insérer
// comme vraie ligne dans le tableau, au-dessus ou en dessous. État local pour la fonction
// choisie -> Client Component.
import { useState } from 'react'
import { IconColumnInsertLeft, IconColumnInsertRight, IconRowInsertBottom, IconRowInsertTop } from '@tabler/icons-react'
import { formatNumber } from '@/lib/formatters'
import { useSelectionStats } from '../hooks/use-selection-stats'
import { useRowActions } from '../hooks/use-row-actions'
import { useSelectionActions } from '../hooks/use-selection-actions'
import { summaryFunctionLabels, type SummaryFunction } from '../utils/insert-summary-row'

export function SelectionStatsBar() {
  const stats = useSelectionStats()
  const { insertSummary } = useRowActions()
  const { insertSummaryColumn } = useSelectionActions()
  const [selectedFunction, setSelectedFunction] = useState<SummaryFunction>('sum')

  if (!stats) return null

  return (
    <div className="flex w-full flex-wrap items-center gap-3 border-t border-primary/20 pt-2">
      <p className="text-xs text-base-content/60">
        Somme : <span className="font-mono tabular-nums text-base-content">{formatNumber(stats.sum)}</span>
        {' · '}Moyenne :{' '}
        <span className="font-mono tabular-nums text-base-content">{formatNumber(Math.round(stats.average * 100) / 100)}</span>
        {' · '}Nombre : <span className="font-mono tabular-nums text-base-content">{stats.numericCount}</span>
        {' · '}Min : <span className="font-mono tabular-nums text-base-content">{formatNumber(stats.min)}</span>
        {' · '}Max : <span className="font-mono tabular-nums text-base-content">{formatNumber(stats.max)}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <label className="sr-only" htmlFor="summary-function">
          Fonction à insérer
        </label>
        <select
          id="summary-function"
          className="select select-bordered select-xs"
          value={selectedFunction}
          onChange={(event) => setSelectedFunction(event.target.value as SummaryFunction)}
        >
          {Object.entries(summaryFunctionLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={() => insertSummary(selectedFunction, 'above')}>
          <IconRowInsertTop size={14} />
          Au-dessus
        </button>
        <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={() => insertSummary(selectedFunction, 'below')}>
          <IconRowInsertBottom size={14} />
          En dessous
        </button>
        <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={() => insertSummaryColumn(selectedFunction, 'left')}>
          <IconColumnInsertLeft size={14} />
          À gauche
        </button>
        <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={() => insertSummaryColumn(selectedFunction, 'right')}>
          <IconColumnInsertRight size={14} />
          À droite
        </button>
      </div>
    </div>
  )
}
