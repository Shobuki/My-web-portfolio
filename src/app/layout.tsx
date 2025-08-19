import "./globals.css";
import 'aplayer/dist/APlayer.min.css';
import { Playfair_Display, Raleway } from 'next/font/google'
import MusicPlayer from '@/components/MusicPlayer';
import Tetris from '@/components/tetris';
import LenisProvider from '@/components/LenisProvider'

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

export const metadata = {
  title: 'Alfredo | Personal Portfolio',
  description: 'Portfolio website of Alfredo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="bg-primary-black text-text-primary font-raleway overflow-x-hidden">
        {/* Pasang lebih awal agar window.openTetris cepat siap */}
        <Tetris />
      <LenisProvider />
        {children}

        <MusicPlayer />
      </body>
    </html>
  )
}
