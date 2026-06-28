import type { Metadata } from "next"
import "./globals.css"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { site } from "@/content/site"
import { theme } from "@/content/theme"

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={site.lang}>
      <body>
        {theme.scrollProgress.enabled && <ScrollProgress />}
        {children}
      </body>
    </html>
  )
}
