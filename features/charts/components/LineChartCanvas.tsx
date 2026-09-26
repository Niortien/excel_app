'use client'

// Graphique en courbe (SVG) : une seule série donc une seule teinte, ligne 2px, points
// >=8px avec anneau de surface, survol affichant l'étiquette + la valeur du point.
import { useState } from 'react'
import { formatNumber } from '@/lib/formatters'
import type { ChartSeriesPoint } from '../types'

const WIDTH = 640
const HEIGHT = 240
const PADDING_X = 16
const PADDING_Y = 24
const MAX_VISIBLE_POINTS = 16

export function LineChartCanvas({ series, valueLabel }: { series: ChartSeriesPoint[]; valueLabel: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const points = series.slice(0, MAX_VISIBLE_POINTS)
  const maxValue = Math.max(...points.map((p) => p.value), 1)
  const stepX = points.length > 1 ? (WIDTH - PADDING_X * 2) / (points.length - 1) : 0

  const coordinates = points.map((point, index) => ({
    ...point,
    x: PADDING_X + index * stepX,
    y: HEIGHT - PADDING_Y - (point.value / maxValue) * (HEIGHT - PADDING_Y * 2),
  }))

  const linePath = coordinates.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ')
  const gridLineYs = [0.25, 0.5, 0.75, 1].map((fraction) => HEIGHT - PADDING_Y - fraction * (HEIGHT - PADDING_Y * 2))

  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Graphique en courbe montrant l'évolution de ${valueLabel} sur ${points.length} points`}
        className="w-full"
      >
        {gridLineYs.map((y) => (
          <line key={y} x1={0} x2={WIDTH} y1={y} y2={y} stroke="var(--chart-gridline)" strokeWidth={1} />
        ))}

        <path d={linePath} fill="none" stroke="var(--chart-sequential)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {coordinates.map((c, index) => (
          <g key={c.label} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
            <circle cx={c.x} cy={c.y} r={12} fill="transparent" />
            <circle
              cx={c.x}
              cy={c.y}
              r={4}
              fill="var(--chart-sequential)"
              stroke="var(--chart-surface)"
              strokeWidth={2}
            />
            {hoveredIndex === index && (
              <text
                x={c.x}
                y={c.y - 12}
                textAnchor="middle"
                fontSize={11}
                fill="var(--chart-ink-primary)"
              >
                {formatNumber(Math.round(c.value * 100) / 100)}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-xs text-[var(--chart-ink-muted)]">
        <span title={coordinates[0]?.label}>{coordinates[0]?.label}</span>
        {coordinates.length > 1 && (
          <span title={coordinates[coordinates.length - 1]?.label}>{coordinates[coordinates.length - 1]?.label}</span>
        )}
      </div>
    </div>
  )
}
