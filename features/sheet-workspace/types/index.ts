export type WorkspaceSectionId = 'calculate' | 'clean' | 'lookup' | 'pivot' | 'rules' | 'charts' | 'export'

export interface WorkspaceSectionDefinition {
  id: WorkspaceSectionId
  label: string
  description: string
}
