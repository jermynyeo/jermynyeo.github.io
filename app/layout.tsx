import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CommandPalette } from "@/components/ui/command-palette"
import { EasterEggs } from "@/components/easter-eggs"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { site } from "@/content/site"
import { theme } from "@/content/theme"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.title,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      jobTitle: site.jobTitle,
      email: `mailto:${site.email}`,
      url: site.url,
      address: {
        "@type": "PostalAddress",
        addressCountry: "SG",
        addressLocality: site.location,
      },
      worksFor: { "@type": "Organization", name: site.employer },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: site.alumniOf,
      },
      sameAs: [...site.sameAs],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.title,
      description: site.description,
      publisher: { "@id": `${site.url}/#person` },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={site.lang} className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {theme.scrollProgress.enabled && <ScrollProgress />}
        <CommandPalette />
        <EasterEggs />
        {children}
      </body>
    </html>
  )
}
