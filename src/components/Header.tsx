'use client'
import Link from "next/link";

declare global { interface Window { openTetris?: () => void } }

export default function Header() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[#472426] shadow-lg text-slate-200 mix-blend-normal"
      style={{ backgroundColor: '#110809' }} // solid, non-transparent
    >
      <div className="mx-auto max-w-screen-2xl px-10 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-primary-red drop-shadow" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.41 6.59c-1.39-1.39-3.75-1.16-5.41.5l1.42 1.42c.63-.63 1.58-.8 2.59-.28l-3.9 3.9c-.52 1.01-.79 2.03-.28 2.59l1.42 1.42c1.66 1.66 3.92 1.89 5.41.5 1.5-1.39 1.8-3.65.5-5.41z" fill="currentColor"></path>
            </svg>
            <h2 className="text-xl font-bold tracking-wider font-playfair text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
              Alfredo
            </h2>
          </div>

          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
            <a
              href="#about"
              className="text-slate-300 hover:text-primary-red transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red rounded"
            >
              About Me
            </a>
            <a
              href="#projects"
              className="text-slate-300 hover:text-primary-red transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red rounded"
            >
              Portfolio
            </a>
            <a
              href="#contactus"
              className="text-slate-300 hover:text-primary-red transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red rounded"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => window.openTetris?.()}
              className="text-slate-300 hover:text-primary-red transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red rounded"
              title="Main Tetris"
            >
              Tetris
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
