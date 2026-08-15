'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'

type Glyph = '{}' | '<>' | '0' | '1'
type Layer = 0 | 1 | 2

type RainGlyph = {
  glyph: Glyph
  layer: Layer
  x: number
  y: number
  speed: number
  drift: number
  phase: number
  pushX: number
  pushY: number
}

const GLYPHS: Glyph[] = ['{}', '<>', '0', '1']
const LAYERS = [
  { z: -2.5, scale: 0.44, opacity: 0.16, speed: 0.18 },
  { z: -0.5, scale: 0.6, opacity: 0.28, speed: 0.28 },
  { z: 1.2, scale: 0.78, opacity: 0.42, speed: 0.38 },
] as const

function createGlyphTexture(glyph: Glyph) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256

  const context = canvas.getContext('2d')
  if (!context) return new THREE.Texture()

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#ffb3ad'
  context.font = '700 104px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(glyph, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  return texture
}

function AnimationDriver() {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    let frameId = 0
    let previous = 0
    let active = !document.hidden

    const onVisibilityChange = () => {
      active = !document.hidden
    }

    const tick = (time: number) => {
      if (active && time - previous >= 33) {
        previous = time
        invalidate()
      }
      frameId = requestAnimationFrame(tick)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    frameId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      cancelAnimationFrame(frameId)
    }
  }, [invalidate])

  return null
}

function CodeGlyphLayer({
  glyphs,
  texture,
  opacity,
}: {
  glyphs: RainGlyph[]
  texture: THREE.Texture
  opacity: number
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const pointerRef = useRef(new THREE.Vector2(999, 999))
  const viewportRef = useRef({ width: 1, height: 1 })
  const matrix = useMemo(() => new THREE.Matrix4(), [])
  const position = useMemo(() => new THREE.Vector3(), [])
  const scale = useMemo(() => new THREE.Vector3(), [])
  const quaternion = useMemo(() => new THREE.Quaternion(), [])
  const { gl, viewport } = useThree()

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (!inside) {
        pointerRef.current.set(999, 999)
        return
      }

      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      pointerRef.current.set(
        (x - 0.5) * viewportRef.current.width,
        (0.5 - y) * viewportRef.current.height,
      )
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [gl])

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    viewportRef.current = viewport
    const halfHeight = viewport.height / 2
    const span = viewport.height + 2
    const elapsed = clock.getElapsedTime()

    glyphs.forEach((glyph, index) => {
      const layer = LAYERS[glyph.layer]
      const y = ((((glyph.y - elapsed * glyph.speed) + halfHeight + 1) % span) + span) % span - halfHeight - 1
      const x = glyph.x + Math.sin(elapsed * 0.35 + glyph.phase) * glyph.drift
      const distance = Math.hypot(x - pointerRef.current.x, y - pointerRef.current.y)
      const radius = 1.35
      const force = distance < radius ? ((radius - distance) / radius) ** 2 : 0
      const directionX = distance ? (x - pointerRef.current.x) / distance : 0
      const directionY = distance ? (y - pointerRef.current.y) / distance : 0
      const ease = 1 - Math.exp(-7 * delta)

      glyph.pushX += (directionX * force * 0.8 - glyph.pushX) * ease
      glyph.pushY += (directionY * force * 0.45 - glyph.pushY) * ease

      position.set(x + glyph.pushX, y + glyph.pushY, layer.z)
      scale.setScalar(layer.scale)
      matrix.compose(position, quaternion, scale)
      mesh.setMatrixAt(index, matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, glyphs.length]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}

function CodeRain() {
  const textures = useMemo(
    () => Object.fromEntries(GLYPHS.map((glyph) => [glyph, createGlyphTexture(glyph)])) as Record<Glyph, THREE.Texture>,
    [],
  )
  const glyphs = useMemo<RainGlyph[]>(() => {
    const count = window.innerWidth < 1100 ? 40 : 64

    return Array.from({ length: count }, (_, index) => {
      const layer = (index % LAYERS.length) as Layer
      return {
        glyph: GLYPHS[index % GLYPHS.length],
        layer,
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 12,
        speed: LAYERS[layer].speed * (0.7 + Math.random() * 0.6),
        drift: 0.06 + Math.random() * 0.14,
        phase: Math.random() * Math.PI * 2,
        pushX: 0,
        pushY: 0,
      }
    })
  }, [])
  const groups = useMemo(
    () => GLYPHS.flatMap((glyph) => LAYERS.map((_, layer) => ({
      glyph,
      layer: layer as Layer,
      glyphs: glyphs.filter((item) => item.glyph === glyph && item.layer === layer),
    }))),
    [glyphs],
  )

  useEffect(() => () => Object.values(textures).forEach((texture) => texture.dispose()), [textures])

  return (
    <>
      <AnimationDriver />
      {groups.map(({ glyph, layer, glyphs: items }) => items.length > 0 && (
        <CodeGlyphLayer
          key={`${glyph}-${layer}`}
          glyphs={items}
          texture={textures[glyph]}
          opacity={LAYERS[layer].opacity}
        />
      ))}
    </>
  )
}

export default function ParticleTypingBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden
    >
      <CodeRain />
    </Canvas>
  )
}
