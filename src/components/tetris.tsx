'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

declare global {
  interface Window {
    openTetris?: () => void
    closeTetris?: () => void
  }
}

type Matrix = number[][]
type Piece = { matrix: Matrix; pos: { x: number; y: number }; type: number }

const COLS = 10
const ROWS = 20
const BLOCK = 24

// --- Penambah kecepatan berbasis skor ---
const MAX_LEVEL = 20               // batas level tertinggi
const SCORE_LEVEL_STEP = 800       // tiap 800 poin, level +1

// urutan: I,J,L,O,S,T,Z (index 1..7 dipakai sebagai warna)
const SHAPES: Record<string, Matrix> = {
  I: [[1, 1, 1, 1]],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
}

const TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as const
const COLOR = [
  '#000000',
  '#00ffff', // I
  '#0000ff', // J
  '#ff9900', // L
  '#ffff00', // O
  '#00ff00', // S
  '#aa00ff', // T
  '#ff0000', // Z
]

// utils
function createMatrix(w: number, h: number): Matrix {
  return Array.from({ length: h }, () => Array(w).fill(0))
}
function rotate(m: Matrix, dir: 1 | -1): Matrix {
  const res = m[0].map((_, i) => m.map(r => r[i]))
  return dir === 1 ? res.map(r => r.reverse()) : res.reverse()
}

export default function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nextRef = useRef<HTMLCanvasElement>(null)
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)

  const [board, setBoard] = useState<Matrix>(() => createMatrix(COLS, ROWS))
  const [piece, setPiece] = useState<Piece>(() => spawnRandomPiece())
  const [nextPiece, setNextPiece] = useState<Piece>(() => spawnRandomPiece())

  // Level otomatis dari skor (ambil yang lebih besar dibanding level dari lines)
  const scoreLevel = useMemo(
    () => Math.min(MAX_LEVEL, Math.floor(score / SCORE_LEVEL_STEP) + 1),
    [score]
  )
  useEffect(() => {
    setLevel(prev => (scoreLevel > prev ? scoreLevel : prev))
  }, [scoreLevel])

  // Interval jatuh berdasarkan level
  const dropInterval = useMemo(
    () => Math.max(120, 900 - (level - 1) * 100),
    [level]
  )

  // gunakan number untuk browser timer
  const dropTimer = useRef<number | null>(null)

  // Global open/close
  useEffect(() => {
    window.openTetris = () => { setOpen(true); setRunning(true) }
    window.closeTetris = () => { setRunning(false); setOpen(false) }
    return () => { delete window.openTetris; delete window.closeTetris }
  }, [])

  // Auto drop
  useEffect(() => {
    if (!open || !running) return
    if (dropTimer.current !== null) { window.clearInterval(dropTimer.current); dropTimer.current = null }
    dropTimer.current = window.setInterval(() => softDrop(), dropInterval)
    return () => {
      if (dropTimer.current !== null) { window.clearInterval(dropTimer.current); dropTimer.current = null }
    }
  }, [open, running, dropInterval, board, piece])

  // Keyboard (izinkan P/R/Escape saat pause)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (!running && !['Escape','p','P','r','R'].includes(e.key)) return
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', ' '].includes(e.key)) e.preventDefault()
      switch (e.key) {
        case 'ArrowLeft':  move(-1); break
        case 'ArrowRight': move(1); break
        case 'ArrowDown':  softDrop(); break
        case 'ArrowUp':    rotatePiece(1); break
        case ' ':          hardDrop(); break
        case 'p': case 'P': setRunning(v => !v); break
        case 'r': case 'R': resetGame(); break
        case 'Escape': setRunning(false); setOpen(false); break
      }
    }
    window.addEventListener('keydown', onKey, { passive: false })
    return () => window.removeEventListener('keydown', onKey)
  }, [open, running, board, piece])

  // Draw
  useEffect(() => { drawAll() }, [board, piece, open, nextPiece])

  function drawAll() {
    const canvas = canvasRef.current
    const next = nextRef.current
    if (!canvas || !next) return

    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawMatrix(ctx, board, { x: 0, y: 0 })
    drawMatrix(ctx, piece.matrix, piece.pos, piece.type)

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * BLOCK + 0.5, 0); ctx.lineTo(x * BLOCK + 0.5, ROWS * BLOCK); ctx.stroke() }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * BLOCK + 0.5); ctx.lineTo(COLS * BLOCK, y * BLOCK + 0.5); ctx.stroke() }

    const nctx = next.getContext('2d')!
    nctx.clearRect(0, 0, next.width, next.height)
    nctx.fillStyle = '#111'
    nctx.fillRect(0, 0, next.width, next.height)
    const offset = {
      x: Math.floor((4 - nextPiece.matrix[0].length) / 2),
      y: Math.floor((4 - nextPiece.matrix.length) / 2),
    }
    drawMatrix(nctx, nextPiece.matrix, offset, nextPiece.type, 22)
  }

  function drawMatrix(
    ctx: CanvasRenderingContext2D,
    m: Matrix,
    offset: { x: number; y: number },
    typeOverride?: number,
    blockSize = BLOCK
  ) {
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        const v = m[y][x]
        if (v) {
          const type = typeOverride ?? v
          ctx.fillStyle = COLOR[type]
          ctx.fillRect((x + offset.x) * blockSize, (y + offset.y) * blockSize, blockSize - 1, blockSize - 1)
        }
      }
    }
  }

  // === Game core ===
  function spawnRandomPiece(): Piece {
    const t = TYPES[Math.floor(Math.random() * TYPES.length)]
    const matrix = SHAPES[t].map(row => row.map(v => (v ? TYPES.indexOf(t) + 1 : 0)))
    return { matrix, pos: { x: Math.floor(COLS / 2) - Math.ceil(matrix[0].length / 2), y: 0 }, type: TYPES.indexOf(t) + 1 }
  }

  function collide(b: Matrix, p: Piece): boolean {
    for (let y = 0; y < p.matrix.length; y++) {
      for (let x = 0; x < p.matrix[y].length; x++) {
        if (
          p.matrix[y][x] &&
          (b[y + p.pos.y] === undefined || b[y + p.pos.y][x + p.pos.x] === undefined || b[y + p.pos.y][x + p.pos.x] !== 0)
        ) return true
      }
    }
    return false
  }

  function merge(b: Matrix, p: Piece): Matrix {
    const nb = b.map(r => [...r])
    for (let y = 0; y < p.matrix.length; y++) {
      for (let x = 0; x < p.matrix[y].length; x++) {
        if (p.matrix[y][x]) nb[y + p.pos.y][x + p.pos.x] = p.type
      }
    }
    return nb
  }

  function clearLinesAndScore(b: Matrix) {
    let cleared = 0
    outer: for (let y = b.length - 1; y >= 0; y--) {
      for (let x = 0; x < b[y].length; x++) { if (b[y][x] === 0) continue outer }
      b.splice(y, 1)
      b.unshift(Array(COLS).fill(0))
      cleared++
      y++
    }
    if (cleared) {
      setLines(prev => prev + cleared)
      const add = cleared === 1 ? 40 * level : cleared === 2 ? 100 * level : cleared === 3 ? 300 * level : 1200 * level
      setScore(prev => prev + add)
      // pertahankan logika lama (lines) lalu scoreLevel akan memaksimalkan level-nya
      setLevel(prev => Math.max(prev, Math.min(15, Math.floor((lines + cleared) / 10) + 1)))
    }
  }

  function move(dir: -1 | 1) {
    if (!running) return
    setPiece(prev => {
      const np = { ...prev, pos: { ...prev.pos, x: prev.pos.x + dir } }
      if (collide(board, np)) return prev
      return np
    })
  }

  function rotatePiece(dir: 1 | -1) {
    if (!running) return
    setPiece(prev => {
      const rotated = rotate(prev.matrix, dir)
      let np: Piece = { ...prev, matrix: rotated }
      let offset = 1
      while (collide(board, np)) {
        np = { ...np, pos: { ...np.pos, x: np.pos.x + offset } }
        offset = -(offset + (offset > 0 ? 1 : -1))
        if (Math.abs(offset) > rotated[0].length) return prev
      }
      return np
    })
  }

  function softDrop() {
    if (!running) return
    setPiece(prev => {
      const np = { ...prev, pos: { ...prev.pos, y: prev.pos.y + 1 } }
      if (!collide(board, np)) return np

      const merged = merge(board, prev)
      clearLinesAndScore(merged)
      setBoard(merged)

      const spawned: Piece = {
        ...nextPiece,
        pos: { x: Math.floor(COLS / 2) - Math.ceil(nextPiece.matrix[0].length / 2), y: 0 }
      }
      setNextPiece(spawnRandomPiece())

      if (collide(merged, spawned)) {
        Promise.resolve().then(() => resetGame(true))
        return prev
      }

      return spawned
    })
  }

  function hardDrop() {
    if (!running) return
    let np = { ...piece }
    while (!collide(board, { ...np, pos: { ...np.pos, y: np.pos.y + 1 } })) np.pos.y++
    const merged = merge(board, np)
    setScore(s => s + (ROWS - np.pos.y))
    clearLinesAndScore(merged)
    setBoard(merged)
    const spawned = { ...nextPiece, pos: { x: Math.floor(COLS / 2) - Math.ceil(nextPiece.matrix[0].length / 2), y: 0 } }
    setPiece(spawned)
    setNextPiece(spawnRandomPiece())
    if (collide(merged, spawned)) resetGame(true)
  }

  function resetGame(gameOver = false) {
    setRunning(!gameOver)
    setBoard(createMatrix(COLS, ROWS))
    setPiece(spawnRandomPiece())
    setNextPiece(spawnRandomPiece())
    setScore(0)
    setLines(0)
    setLevel(1)
    if (gameOver) setRunning(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => { setRunning(false); setOpen(false) }} />
      <div className="relative mx-4 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#1a111b] p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-wide">Tetris</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRunning(r => !r)}
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
              title={running ? 'Pause (P)' : 'Resume (P)'}
            >
              {running ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => resetGame(false)}
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
              title="Restart (R)"
            >
              Restart
            </button>
            <button
              onClick={() => { setRunning(false); setOpen(false) }}
              className="rounded-full bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              title="Tutup (Esc)"
            >
              Tutup
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[auto_160px] gap-4 md:gap-6">
          <div className="rounded-xl border border-white/10 bg-black/40 p-2">
            <canvas ref={canvasRef} width={COLS * BLOCK} height={ROWS * BLOCK} className="block rounded-lg" />
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-white">
              <div className="flex items-center justify-between"><span>Score</span><b>{score}</b></div>
              <div className="flex items-center justify-between"><span>Lines</span><b>{lines}</b></div>
              <div className="flex items-center justify-between"><span>Level</span><b>{level}</b></div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-white">
              <div className="mb-2 text-sm opacity-80">Next</div>
              <canvas ref={nextRef} width={4 * 22} height={4 * 22} className="rounded" />
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-white">
              <div className="mb-2 text-sm opacity-80">Controls</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => rotatePiece(1)}
                  disabled={!running}
                  className="rounded bg-white/10 py-2 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Rotate (↑)"
                >⟳</button>

                <button
                  onClick={() => hardDrop()}
                  disabled={!running}
                  className="rounded bg-white/10 py-2 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Hard Drop (Space)"
                >⬇⬇</button>

                <button
                  onClick={() => setRunning(r => !r)}
                  className="rounded bg-white/10 py-2 hover:bg-white/20"
                  title="Pause/Resume (P)"
                >{running ? 'Pause' : 'Play'}</button>

                <button
                  onClick={() => move(-1)}
                  disabled={!running}
                  className="col-span-1 rounded bg-white/10 py-2 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Left (←)"
                >←</button>

                <button
                  onClick={() => softDrop()}
                  disabled={!running}
                  className="col-span-1 rounded bg-white/10 py-2 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Soft Drop (↓)"
                >↓</button>

                <button
                  onClick={() => move(1)}
                  disabled={!running}
                  className="col-span-1 rounded bg-white/10 py-2 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Right (→)"
                >→</button>
              </div>
              <div className="mt-2 text-xs opacity-70">
                Keyboard: ← → (geser), ↑ (rotate), ↓ (soft drop), Space (hard drop), P (pause/resume), R (restart), Esc (tutup)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
