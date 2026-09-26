import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { appConfig, themeConfig } from "@/config/app.config";
import "./globals.css";

// Une seule famille pour tout le texte et les titres (la hiérarchie vient du poids/de la
// taille, pas d'une deuxième police) ; la mono est réservée aux valeurs numériques des
// cellules du tableur, pour que les chiffres s'alignent comme dans un vrai tableur.
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const dataFont = IBM_Plex_Mono({
  variable: "--font-data",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme={themeConfig.default}
      className={`${displayFont.variable} ${dataFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
