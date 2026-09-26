// TODO backend : à brancher sur PATCH /sheets/:id une fois le backend NestJS disponible.
// Aujourd'hui la feuille active vit uniquement dans la session du navigateur (store Zustand
// chargé lors de l'import), cette fonction ne fait donc que renommer le projet en session.
export async function renameSheetProject(_projectId: string, name: string): Promise<{ name: string }> {
  return { name: name.trim() }
}
