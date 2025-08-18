'use client'
import { useState } from 'react'

declare global { interface Window { openTetris?: () => void } }

export default function Header() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[#472426] shadow-lg text-slate-200"
      style={{ backgroundColor: '#110809' }} // solid, non-transparent
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-10 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-wider font-playfair text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
              Alfredo
            </h1>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
            <a
              href="#about"
              onClick={closeMenu}
              className="text-slate-300 hover:text-primary-red transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red rounded"
            >
              About Me
            </a>
            <a
              href="#projects"
              onClick={closeMenu}
              className="text-slate-300 hover:text-primary-red transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red rounded"
            >
              Portfolio
            </a>
            <a
              href="#contactus"
              onClick={closeMenu}
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

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            <span className="sr-only">Open main menu</span>
            {/* Icon: hamburger / close */}
            {open ? (
              // X icon
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`
          md:hidden overflow-hidden border-t border-[#472426]
          transition-all duration-200 origin-top
          ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
        style={{ backgroundColor: '#110809' }}
        aria-hidden={!open}
      >
        <nav className="px-4 sm:px-6 py-3 flex flex-col gap-2 text-sm uppercase tracking-widest">
          <a
            href="#about"
            onClick={closeMenu}
            className="block rounded px-3 py-2 text-slate-300 hover:text-primary-red hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
          >
            About Me
          </a>
          <a
            href="#projects"
            onClick={closeMenu}
            className="block rounded px-3 py-2 text-slate-300 hover:text-primary-red hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
          >
            Portfolio
          </a>
          <a
            href="#contactus"
            onClick={closeMenu}
            className="block rounded px-3 py-2 text-slate-300 hover:text-primary-red hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
          >
            Contact
          </a>
          <button
            type="button"
            onClick={() => { closeMenu(); window.openTetris?.() }}
            className="text-left rounded px-3 py-2 text-slate-300 hover:text-primary-red hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
            title="Main Tetris"
          >
            Tetris
          </button>
        </nav>
      </div>
    </header>
  )
}
