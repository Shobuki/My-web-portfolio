// components/LenisProvider.tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      touchMultiplier: 1.5,
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
