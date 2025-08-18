'use client'

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"
import ParticleTypingBackground from "@/components/ParticleTypingBackground"
import Image from "next/image"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.6 })
    tl.fromTo(
      headlineRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out" }
    )
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.5"
    )
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
      "-=0.3"
    )
    return () => { tl.kill() }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="
        relative
        min-h-[100svh]            /* lebih akurat di mobile */
        flex items-center
        px-4 sm:px-6 md:px-10
        pt-24                     /* ruang untuk header fixed */
        pb-10
        overflow-hidden
      "
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(231,29,54,0.10), transparent), radial-gradient(1200px 600px at 90% 20%, rgba(66,103,178,0.10), transparent)"
      }}
    >
      {/* Background 3D: dimatikan di layar kecil untuk performa */}
      <div className="absolute inset-0 hidden sm:block">
        <ParticleTypingBackground />
      </div>

      {/* Overlay halus biar teks kontras */}
      <div className="pointer-events-none absolute inset-0 bg-slate-950/40 sm:bg-slate-950/30 backdrop-blur-[1px]" aria-hidden />

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        <h1
          ref={headlineRef}
          className="
            text-4xl sm:text-6xl md:text-7xl
            font-black font-playfair tracking-tight
            leading-[1.1]
            text-white
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]
            break-words
          "
        >
          Alfredo Da Gonza
        </h1>

        <p
          ref={subtitleRef}
          className="
            mx-auto max-w-[42rem]
            text-base sm:text-lg md:text-xl
            text-gray-200
            drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]
            px-1
          "
        >
          Full-stack developer specializing in Node.js, React, and modern web tooling. Dive into selected projects and credentials to explore recent work and experience.
        </p>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-2"
        >
          <Button
            className="
              w-full sm:w-auto
              bg-gradient-to-r from-primary-red to-[#e71d36]
              hover:from-[#e71d36] hover:to-primary-red
              text-white px-6 sm:px-8 py-3 sm:py-4
              rounded-full text-base sm:text-lg font-bold
              shadow-lg hover:shadow-red-400/25
              transition-all duration-300 hover:scale-105
              uppercase tracking-wider
            "
            asChild
          >
            <a href="#projects">View Portfolio</a>
          </Button>

          <Button
            className="
              w-full sm:w-auto
              bg-white/10 backdrop-blur-md border border-white/20
              text-white hover:bg-white/20 hover:border-white/30
              px-6 sm:px-8 py-3 sm:py-4 rounded-full
              text-base sm:text-lg font-medium shadow-lg
              transition-all duration-300 hover:scale-105
            "
            asChild
          >
            <a href="#contactus" className="inline-flex items-center justify-center">
              <Code className="w-5 h-5 mr-2" />
              Contact
            </a>
          </Button>
        </div>

        {/* Social Media */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-4 sm:gap-6">
          <a
            href="https://www.instagram.com/das_alfredo/"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e71d36] rounded-full"
            aria-label="Instagram"
          >
            <Image
              src="/iconsmedia/instagram.webp"
              alt="Instagram"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border-2 bg-white border-white p-1 hover:opacity-80 transition"
            />
          </a>

          <a
            href="https://www.linkedin.com/in/alfredo-da-gonza/"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e71d36] rounded-full"
            aria-label="LinkedIn"
          >
            <Image
              src="/iconsmedia/linkedin.png"
              alt="LinkedIn"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border-2 bg-white border-white p-1 hover:opacity-80 transition"
            />
          </a>

          <a
            href="https://github.com/Shobuki"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e71d36] rounded-full"
            aria-label="GitHub"
          >
            <Image
              src="/iconsmedia/github.png"
              alt="GitHub"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border-2 bg-white border-white p-1 hover:opacity-80 transition"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
