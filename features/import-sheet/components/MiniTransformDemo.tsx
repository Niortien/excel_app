// Server Component : illustration statique du cœur de la proposition de valeur (aucune
// interactivité, aucune donnée réelle) — montrer le produit lui-même plutôt qu'une icône.
// Les deux états forment une vraie séquence (avant → après), ce qui justifie les libellés.
import { IconArrowDown, IconArrowRight } from '@tabler/icons-react'

const messyRows = [
  ['martin dubois', 'lyon', '1200'],
  ['SOPHIE  legrand', '', '890'],
  ['j. Petit', 'Nantes', '  '],
  ['martin dubois', 'lyon', '1200'],
]

const tidyRows = [
  ['Martin Dubois', 'Lyon', '1 200 €'],
  ['Sophie Legrand', '—', '890 €'],
  ['J. Petit', 'Nantes', '—'],
]

export function MiniTransformDemo() {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <MiniTable title="Ce que vous déposez" rows={messyRows} muted />
      <IconArrowRight size={20} className="hidden shrink-0 text-secondary sm:block" aria-hidden />
      <IconArrowDown size={20} className="mx-auto shrink-0 text-secondary sm:hidden" aria-hidden />
      <MiniTable title="Ce que vous récupérez" rows={tidyRows} />
    </div>
  )
}

function MiniTable({ title, rows, muted }: { title: string; rows: string[][]; muted?: boolean }) {
  return (
    <div className="flex-1 overflow-hidden rounded-box border border-base-300 bg-base-100">
      <p className="border-b border-base-300 bg-base-200 px-3 py-1.5 text-xs text-[var(--ink-muted)]">{title}</p>
      <table className="w-full text-xs">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-base-200/50' : undefined}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-3 py-1.5 ${cellIndex === row.length - 1 ? 'text-right font-mono tabular-nums' : ''} ${
                    muted ? 'text-[var(--ink-muted)]' : 'text-base-content'
                  }`}
                >
                  {cell.trim() === '' ? <span className="text-base-content/20">·</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
