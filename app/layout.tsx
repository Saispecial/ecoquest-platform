import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AppLayout } from "@/components/layout/app-layout"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "EcoQuest - Gamified Environmental Learning",
  description:
    "Transform environmental education into engaging, real-world sustainable action through gamified challenges, quizzes, and mini-games.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppLayout>{children}</AppLayout>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
