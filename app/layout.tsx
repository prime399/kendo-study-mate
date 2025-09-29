import "@progress/kendo-theme-default/dist/all.css"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import ConvexClientProvider from "@/components/convex-client-provider"
import { cn } from "@/lib/utils"
import { ensureKendoLicense } from "@/lib/kendo-license"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"

ensureKendoLicense()

export const metadata: Metadata = {
  title: "StudyMate",
  description:
    "Compete with friends, join study groups, and track your progress to become a top student.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background font-sans antialiased",
            GeistSans.variable,
          )}
        >
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Analytics />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
