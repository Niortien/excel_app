import type { Metadata } from 'next'
import { HomeView } from '@/features/import-sheet/components/HomeView'
import { appConfig } from '@/config/app.config'

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
}

// Server Component : page d'accueil, assemble uniquement la vue de haut niveau.
export default function HomePage() {
  return <HomeView />
}
