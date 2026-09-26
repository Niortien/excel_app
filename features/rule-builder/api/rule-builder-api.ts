// TODO backend : à remplacer par POST /sheets/:id/rules/preview. Calcul local en attendant.
import type { SheetData } from '@/types/sheet'
import { applyRule } from '../utils/evaluate-rule'
import type { Rule } from '../types'

export async function previewRule(data: SheetData, rule: Rule): Promise<{ data: SheetData; matchCount: number }> {
  return applyRule(data, rule)
}
