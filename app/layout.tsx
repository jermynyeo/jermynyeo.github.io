import type { Metadata } from "next"
import "./globals.css"
import { ScrollProgress } from "@/components/ui/scroll-progress"

export const metadata: Metadata = {
  title: "Jermyn Yeo — Data & Platform Engineer",
  description:
    "Portfolio of Jermyn Yeo — data & platform engineer. Building data pipelines, ETL, data governance, and cloud-native backend services.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
