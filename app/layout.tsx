import type React from "react"
// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
import type { Metadata, Viewport } from "next"
import { Amiri, Noto_Sans_Arabic, Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { QuranProvider } from "@/contexts/quran-context"
import { I18nProvider } from "@/lib/i18n"
import "./globals.css"

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
})

const notoArabic = Noto_Sans_Arabic({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "القرآن الكريم | The Glorious Quran",
  description: "تطبيق تفاعلي لقراءة وحفظ القرآن الكريم - Interactive Quran reading and memorization application",
  generator: "v0.app",
  keywords: ["Quran", "القرآن", "Islam", "Memorization", "Hifz", "حفظ"],
  authors: [{ name: "Quran App" }],
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true, // Enable user scaling for accessibility
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${amiri.variable} ${notoArabic.variable} ${geist.variable} font-amiri antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <QuranProvider>{children}</QuranProvider>
          </AuthProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
