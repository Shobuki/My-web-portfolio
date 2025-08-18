'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useEffect, useMemo, useState } from 'react';

function useTextPoints(text: string, fontSize = 80) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  useEffect(() => {
    if (!text) { setPoints([]); return; }
    const canvas = document.createElement('canvas');
    // ukuran kanvas lebih fleksibel (sesuai fontSize)
    const scale = fontSize / 80; // 80 = basis asal
    canvas.width = Math.round(650 * scale);
    canvas.height = Math.round(200 * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.fillText(text, 20 * scale, 55 * scale);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const arr: THREE.Vector3[] = [];
    const density = Math.max(3, Math.round(4 * scale)); // density ikut skala
    for (let y = 0; y < canvas.height; y += density) {
      for (let x = 0; x < canvas.width; x += density) {
        const i = (y * canvas.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          arr.push(new THREE.Vector3(
            x - canvas.width / 2,
            canvas.height / 2 - y,
            0
          ));
        }
      }
    }
    setPoints(arr);
  }, [text, fontSize]);
  return points;
}

function ParticlesText({
  text,
  typing,
  color = "#f3e7fa",
  size = 4.5,
  position = [0, 0, 0],
  fade = 1,
  animated = true,
}: {
  text: string;
  typing?: boolean;
  color?: string;
  size?: number;
  position?: [number, number, number];
  fade?: number;
  animated?: boolean;
}) {
  // ===== Responsif berdasarkan lebar kanvas/fiber =====
  const { size: vp } = useThree();
  const isMobile = vp.width < 768;

  // font lebih kecil di mobile supaya muat
  const points = useTextPoints(text, isMobile ? 58 : 80);

  const mesh = useRef<THREE.Points>(null);
  const [showCount, setShowCount] = useState(0);

  useEffect(() => {
    if (!typing || !animated) {
      setShowCount(points.length);
      return;
    }
    setShowCount(0);
    if (!points.length) return;
    let i = 0;
    const step = Math.max(2, Math.floor(points.length / Math.max(1, text.length * 7)));
    const interval = setInterval(() => {
      i += step;
      setShowCount(Math.min(i, points.length));
      if (i >= points.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [points, text, typing, animated]);

  const visiblePoints = useMemo(() => points.slice(0, showCount), [points, showCount]);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    if (visiblePoints.length > 0) {
      const positions = new Float32Array(visiblePoints.length * 3);
      visiblePoints.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z + (Math.random() - 0.5) * 6;
      });
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
    return geo;
  }, [visiblePoints]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(clock.getElapsedTime() / 5) * 0.09;
      mesh.current.rotation.x = Math.cos(clock.getElapsedTime() / 5) * 0.04;
    }
  });

  // skala & posisi responsif: kecilkan & geser supaya pasti terlihat
  const scale = isMobile ? 0.6 : 1;
  const pos: [number, number, number] = [
    isMobile ? position[0] * 0.55 : position[0],
    isMobile ? position[1] * 0.70 : position[1],
    position[2]
  ];

  return (
    <group position={pos as any} scale={scale}>
      <points ref={mesh} geometry={geometry}>
        <pointsMaterial
          size={size * (isMobile ? 0.8 : 1)}
          color={color}
          transparent
          opacity={0.93 * fade}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

const TYPING_TEXT = 'print("world")';
const ALFREDO = 'Alfredo';

export default function ParticleTypingBackground() {
  // Fix 100vh di mobile: set CSS var --vh
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  // Alfredo looping anim
  const [alfredoFade, setAlfredoFade] = useState(1);
  useEffect(() => {
    let visible = true;
    setAlfredoFade(1);
    let timeout: ReturnType<typeof setTimeout>;
    const loop = () => {
      setAlfredoFade(visible ? 1 : 0.08);
      visible = !visible;
      timeout = setTimeout(loop, visible ? 2200 : 580);
    };
    loop();
    return () => clearTimeout(timeout);
  }, []);

  // Typing logic
  const [typedIndex, setTypedIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') return;
      setTypedIndex(idx => (idx < TYPING_TEXT.length ? idx + 1 : idx));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (typedIndex >= TYPING_TEXT.length) {
      const t = setTimeout(() => setTypedIndex(0), 1700);
      return () => clearTimeout(t);
    }
  }, [typedIndex]);

  const displayTyping =
    TYPING_TEXT.slice(0, typedIndex) + (typedIndex < TYPING_TEXT.length && showCursor ? '|' : '');

  return (
    <Canvas
      camera={{ position: [0, 0, 350], fov: 75 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,                 // di belakang konten
        width: '100vw',
        height: 'calc(var(--vh, 1vh) * 100)', // 100svh fallback
        background: 'radial-gradient(ellipse at 40% 25%, #340e1e 0%, #221016 100%)',
        pointerEvents: 'none',      // jangan blok scroll/klik
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}                  // batasi DPR untuk device high-DPI
    >
      {/* Judul kiri-atas */}
      <ParticlesText
        text={ALFREDO}
        typing
        color="#ffffff"
        size={10}
        position={[-260, 100, 0]}
        fade={alfredoFade}
        animated
      />
      {/* Baris kode di bawahnya */}
      <ParticlesText
        text={displayTyping}
        typing
        color="#fff0fa"
        size={6.7}
        position={[-240, 35, 0]}
        fade={1}
        animated={false}
      />
    </Canvas>
  );
}
