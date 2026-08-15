import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Raleway } from 'next/font/google'
import ClientEnhancements from "@/components/ClientEnhancements";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
  display: 'swap'
})
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-raleway',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: "Alfredo Da Gonza | Full-stack Developer",
    template: "%s | Alfredo Da Gonza",
  },
  description: "Full-stack developer portfolio showcasing web applications, automation, and modern product engineering work.",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Alfredo Da Gonza | Full-stack Developer",
    description: "Selected full-stack projects across web applications, automation, and modern tooling.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Alfredo Da Gonza portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alfredo Da Gonza | Full-stack Developer",
    description: "Selected full-stack projects across web applications, automation, and modern tooling.",
    images: ["/opengraph-image"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="bg-primary-black text-text-primary font-raleway overflow-x-hidden">
        <ClientEnhancements />
        {children}
      </body>
    </html>
  )
}
