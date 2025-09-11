// components/LenisProvider.tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider() {
  useEffect(() => {
    // Disable Lenis on small screens to avoid scroll lock on mobile
    if (typeof window !== 'undefined') {
      const isSmall = window.matchMedia('(max-width: 767px)').matches
      if (isSmall) return
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.25,
      orientation: 'vertical',
    })

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return null
}
