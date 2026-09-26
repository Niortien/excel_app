// Server Component : assemble le hero (statique) et deux Client Components autonomes
// (ResumeProjectBanner, RecentProjectsList). Aucun état ni logique propre à ce composant.
import { ImportCallToAction } from './ImportCallToAction'
import { MiniTransformDemo } from './MiniTransformDemo'
import { ResumeProjectBanner } from './ResumeProjectBanner'
import { RecentProjectsList } from './RecentProjectsList'

export function HomeView() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 sm:py-16">
      <ResumeProjectBanner />

      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <ImportCallToAction />
        <MiniTransformDemo />
      </section>

      <section aria-label="Projets récents" className="flex flex-col gap-3 border-t border-base-300 pt-8">
        <h2 className="text-lg font-semibold text-base-content">Projets récents</h2>
        <RecentProjectsList />
      </section>
    </div>
  )
}
