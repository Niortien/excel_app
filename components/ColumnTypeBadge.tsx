// Purement présentationnel (icône + libellé), sans état ni gestionnaire d'événement.
// Reste un Server Component à part entière ; s'il est composé dans un arbre Client
// (ex: SmartTable) il est simplement inclus dans le bundle client sans que cela pose problème.
import {
  IconAbc,
  IconCalendar,
  IconCheckbox,
  IconCoin,
  IconMail,
  IconNumber,
  IconPercentage,
  type TablerIcon,
} from '@tabler/icons-react'
import { columnTypeCatalog } from '@/lib/column-types'
import type { ColumnDataType } from '@/types/sheet'

const iconByType: Record<ColumnDataType, TablerIcon> = {
  text: IconAbc,
  number: IconNumber,
  date: IconCalendar,
  boolean: IconCheckbox,
  currency: IconCoin,
  percentage: IconPercentage,
  email: IconMail,
}

export function ColumnTypeBadge({ type }: { type: ColumnDataType }) {
  const definition = columnTypeCatalog[type]
  const Icon = iconByType[type]

  return (
    <span className="badge badge-ghost gap-1 whitespace-nowrap text-xs font-normal">
      <Icon size={13} />
      {definition.label}
    </span>
  )
}
