'use client'

// Vue orchestratrice de /new : porte le hook métier et compose le formulaire à une étape.
// Client Component car interactif (champ contrôlé + soumission).
import { IconTable } from '@tabler/icons-react'
import { PageHeader } from '@/components/PageHeader'
import { useNewSheet } from '../hooks/use-new-sheet'

export function NewSheetView() {
  const { projectName, setProjectName, isCreating, create } = useNewSheet()

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-10">
      <PageHeader
        title="Créer une feuille vierge"
        description="Donnez un nom à votre tableau : vous pourrez ajouter des colonnes et des lignes une fois dans l'espace de travail."
      />

      <form
        onSubmit={(event) => {
          event.preventDefault()
          create()
        }}
        className="flex flex-col gap-4"
      >
        <label className="form-control">
          <span className="label-text mb-1">Nom du projet</span>
          <input
            type="text"
            className="input input-bordered"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Ex : Suivi des clients"
            autoFocus
          />
        </label>

        <button type="submit" className="btn btn-primary w-fit gap-2" disabled={isCreating}>
          <IconTable size={18} />
          {isCreating ? 'Création...' : 'Créer le tableau'}
        </button>
      </form>
    </div>
  )
}
