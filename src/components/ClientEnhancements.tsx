'use client'

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), { ssr: false })
const Tetris = dynamic(() => import("@/components/tetris"), { ssr: false })
const LenisProvider = dynamic(() => import("@/components/LenisProvider"), { ssr: false })

export default function ClientEnhancements() {
  const [showCoreEnhancements, setShowCoreEnhancements] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)

  useEffect(() => {
    setShowCoreEnhancements(true)

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setShowMusicPlayer(true), { timeout: 1500 })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = window.setTimeout(() => setShowMusicPlayer(true), 800)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <>
      {showCoreEnhancements ? <Tetris /> : null}
      {showCoreEnhancements ? <LenisProvider /> : null}
      {showMusicPlayer ? <MusicPlayer /> : null}
    </>
  )
}
