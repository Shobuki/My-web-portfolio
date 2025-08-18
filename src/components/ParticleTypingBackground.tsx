'use client'
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useEffect, useMemo, useState } from 'react';

function useTextPoints(text: string, fontSize = 80) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  useEffect(() => {
    if (!text) { setPoints([]); return; }
    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.fillText(text, 20, 55);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const arr: THREE.Vector3[] = [];
    const density = 4;
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
  animated = true, // NEW: jika false, partikel langsung tampil semua tanpa animasi
}: {
  text: string;
  typing?: boolean;
  color?: string;
  size?: number;
  position?: [number, number, number];
  fade?: number;
  animated?: boolean;
}) {
  const points = useTextPoints(text, 80);
  const mesh = useRef<THREE.Points>(null);
  const [showCount, setShowCount] = useState(0);

  useEffect(() => {
    if (!typing || !animated) {
      setShowCount(points.length); // tampilkan langsung semua
      return;
    }
    setShowCount(0);
    if (!points.length) return;
    let i = 0;
    const interval = setInterval(() => {
      i += Math.max(2, Math.floor(points.length / Math.max(1, text.length * 7)));
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

  return (
    <points ref={mesh} geometry={geometry} position={position}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.93 * fade}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

const TYPING_TEXT = 'print("world")';
const ALFREDO = 'Alfredo';

export default function ParticleTypingBackground() {
  // Alfredo looping anim
  const [alfredoFade, setAlfredoFade] = useState(1);
  // Typing logic
  const [typedIndex, setTypedIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Alfredo fade in/out loop
  useEffect(() => {
    let visible = true;
    setAlfredoFade(1);
    let timeout: NodeJS.Timeout;
    function loop() {
      setAlfredoFade(visible ? 1 : 0.08);
      visible = !visible;
      timeout = setTimeout(loop, visible ? 2200 : 580);
    }
    loop();
    return () => clearTimeout(timeout);
  }, []);

  // Cursor blinking, ONLY SET ONCE!
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Keyboard input: ANY key will show next character
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Backspace") return;
      setTypedIndex(idx => {
        if (idx < TYPING_TEXT.length) return idx + 1;
        return idx;
      });
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Reset otomatis ke awal setelah selesai animasi, delay 1.5s
  useEffect(() => {
    if (typedIndex >= TYPING_TEXT.length) {
      const t = setTimeout(() => setTypedIndex(0), 1700);
      return () => clearTimeout(t);
    }
  }, [typedIndex]);

  const displayTyping = TYPING_TEXT.slice(0, typedIndex) +
    (typedIndex < TYPING_TEXT.length && showCursor ? '|' : '');

  return (
    <Canvas
      camera={{ position: [0, 0, 350], fov: 75 }}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at 40% 25%, #340e1e 0%, #221016 100%)',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'auto',
      }}
      gl={{ antialias: true }}
    >
      {/* Geser ke pojok kiri atas */}
      <ParticlesText
        text={ALFREDO}
        typing={true}
         color="#fff"
        size={10}
        position={[-260, 100, 0]}    // <== X: kiri, Y: atas
        fade={alfredoFade}
        animated={true}
      />
      <ParticlesText
        text={displayTyping}
        typing={true}
        color="#fff0fa"
        size={6.7}
        position={[-240, 35, 0]}     // <== Y bawah dikit dari Alfredo
        fade={1}
        animated={false}
      />
    </Canvas>
  );
}
