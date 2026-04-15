import { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "KeywordLab Studio | AI Pinterest Anahtar Kelime Oluşturucu",
    template: "%s | KeywordLab Studio"
  },
  description: "Pinterest moodboard'larınız için yapay zeka destekli, estetik ve hedeflenmiş anahtar kelimeler oluşturun. Gemini AI ile mükemmel havayı yakalayın.",
  keywords: ["pinterest anahtar kelime", "moodboard oluşturucu", "ai keyword generator", "estetik arama terimleri", "yapay zeka anahtar kelime"],
  authors: [{ name: "rasperon" }],
  creator: "rasperon",
  openGraph: {
    title: "KeywordLab Studio | AI Pinterest Anahtar Kelime Oluşturucu",
    description: "Yapay zeka ile mükemmel Pinterest moodboard'unu oluştur.",
    siteName: "KeywordLab Studio",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeywordLab Studio",
    description: "AI Pinterest Keyword Generator",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
