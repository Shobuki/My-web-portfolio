'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'

function useTextPoints(text: string, fontSize = 80) {
  const [points, setPoints] = useState<THREE.Vector3[]>([])
  useEffect(() => {
    if (!text) { setPoints([]); return }
    const canvas = document.createElement('canvas')
    canvas.width = 650
    canvas.height = 200
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `bold ${fontSize}px monospace`
    ctx.textBaseline = 'top'
    ctx.fillStyle = '#fff'
    ctx.fillText(text, 20, 55)

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const arr: THREE.Vector3[] = []
    const density = 4
    for (let y = 0; y < canvas.height; y += density) {
      for (let x = 0; x < canvas.width; x += density) {
        const i = (y * canvas.width + x) * 4
        if (data.data[i + 3] > 128) {
          arr.push(new THREE.Vector3(
            x - canvas.width / 2,
            canvas.height / 2 - y,
            0
          ))
        }
      }
    }
    setPoints(arr)
  }, [text, fontSize])
  return points
}

function ParticlesText({
  text,
  typing,
  color = '#f3e7fa',
  size = 4.5,
  position = [0, 0, 0] as [number, number, number],
  fade = 1,
  animated = true,
  scale = 1,
  fontSize = 80,
}: {
  text: string
  typing?: boolean
  color?: string
  size?: number
  position?: [number, number, number]
  fade?: number
  animated?: boolean
  scale?: number
  fontSize?: number
}) {
  const points = useTextPoints(text, fontSize)
  const mesh = useRef<THREE.Points>(null)
  const [showCount, setShowCount] = useState(0)

  useEffect(() => {
    if (!typing || !animated) { setShowCount(points.length); return }
    setShowCount(0)
    if (!points.length) return
    let i = 0
    const iv = setInterval(() => {
      i += Math.max(2, Math.floor(points.length / Math.max(1, text.length * 7)))
      setShowCount(Math.min(i, points.length))
      if (i >= points.length) clearInterval(iv)
    }, 22)
    return () => clearInterval(iv)
  }, [points, text, typing, animated])

  const visiblePoints = useMemo(() => points.slice(0, showCount), [points, showCount])
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    if (visiblePoints.length) {
      const pos = new Float32Array(visiblePoints.length * 3)
      visiblePoints.forEach((p, i) => {
        pos[i * 3 + 0] = p.x
        pos[i * 3 + 1] = p.y
        pos[i * 3 + 2] = p.z + (Math.random() - 0.5) * 6
      })
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    }
    return geo
  }, [visiblePoints])

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(clock.getElapsedTime() / 5) * 0.09
      mesh.current.rotation.x = Math.cos(clock.getElapsedTime() / 5) * 0.04
    }
  })

  return (
    <group position={position} scale={scale}>
      <points ref={mesh} geometry={geometry}>
        <pointsMaterial
          size={size}
          color={color}
          transparent
          opacity={0.93 * fade}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}

const TYPING_TEXT = 'print("world")'
const ALFREDO = 'Alfredo'

export default function ParticleTypingBackground() {
  // responsif: baca lebar viewport
  const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // atur posisi/scale berdasarkan breakpoint
  const cfg = useMemo(() => {
    if (vw <= 360) {
      return {
        aPos: [-120, 95, 0] as [number, number, number],
        tPos: [-112, 28, 0] as [number, number, number],
        aScale: 0.55, tScale: 0.55,
        aFont: 64, tFont: 48,
      }
    } else if (vw <= 640) {
      return {
        aPos: [-140, 100, 0] as [number, number, number],
        tPos: [-130, 30, 0] as [number, number, number],
        aScale: 0.68, tScale: 0.68,
        aFont: 72, tFont: 52,
      }
    } else if (vw <= 1024) {
      return {
        aPos: [-200, 100, 0] as [number, number, number],
        tPos: [-188, 34, 0] as [number, number, number],
        aScale: 0.82, tScale: 0.82,
        aFont: 80, tFont: 58,
      }
    }
    // desktop
    return {
      aPos: [-260, 100, 0] as [number, number, number],
      tPos: [-240, 35, 0] as [number, number, number],
      aScale: 1, tScale: 1,
      aFont: 80, tFont: 60,
    }
  }, [vw])

  // alfredo blink
  const [alfredoFade, setAlfredoFade] = useState(1)
  useEffect(() => {
    let visible = true
    let h: ReturnType<typeof setTimeout>
    const loop = () => {
      setAlfredoFade(visible ? 1 : 0.08)
      visible = !visible
      h = setTimeout(loop, visible ? 2200 : 580)
    }
    loop()
    return () => clearTimeout(h)
  }, [])

  // typing
  const [typedIndex, setTypedIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 500)
    return () => clearInterval(blink)
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') return
      setTypedIndex(i => (i < TYPING_TEXT.length ? i + 1 : i))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    if (typedIndex >= TYPING_TEXT.length) {
      const t = setTimeout(() => setTypedIndex(0), 1700)
      return () => clearTimeout(t)
    }
  }, [typedIndex])
  const displayTyping =
    TYPING_TEXT.slice(0, typedIndex) + (typedIndex < TYPING_TEXT.length && showCursor ? '|' : '')

  return (
    <Canvas
      camera={{ position: [0, 0, 350], fov: 75 }}
      dpr={[1, 1.5]}                        // batasi DPR di mobile
      style={{
        position: 'absolute',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at 40% 25%, #340e1e 0%, #221016 100%)',
        zIndex: 0,
        pointerEvents: 'none',              // jangan blok sentuhan/scroll
      }}
      gl={{ antialias: true }}
    >
      <ParticlesText
        text={ALFREDO}
        typing
        color="#ffffff"
        size={10}
        position={cfg.aPos}
        scale={cfg.aScale}
        fontSize={cfg.aFont}
        fade={alfredoFade}
        animated
      />
      <ParticlesText
        text={displayTyping}
        typing
        color="#fff0fa"
        size={6.5}
        position={cfg.tPos}
        scale={cfg.tScale}
        fontSize={cfg.tFont}
        fade={1}
        animated={false}
      />
    </Canvas>
  )
}
