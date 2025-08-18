'use client'

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"
import ParticleTypingBackground from "@/components/ParticleTypingBackground"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 }) // boleh diubah lebih cepat
    tl.fromTo(headlineRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }
    )
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    tl.fromTo(ctaRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    )
    return () => { tl.kill(); }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Background 3D Spline */}
      <div className="absolute inset-0 w-full h-full">
        <ParticleTypingBackground />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"></div>

      {/* Centered Content */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
        <h1 ref={headlineRef} className="text-6xl md:text-8xl font-black font-playfair tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-white">
          Alfredo Da Gonza
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mt-4 max-w-2xl text-lg md:text-xl text-gray-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
        >
          I’m a full-stack developer specializing in Node.js, React, and modern web tooling.
          Explore my portfolio and resume to learn more about my work and experience.
        </p>


        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
          <Button
            className="bg-gradient-to-r from-primary-red to-[#e71d36] hover:from-[#e71d36] hover:to-primary-red text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-red-400/25 transition-all duration-300 hover:scale-105 uppercase tracking-wider"
            asChild
          >
            <a href="#projects">View Portfolio</a>
          </Button>

          <Button
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-8 py-4 rounded-full text-lg font-medium shadow-lg transition-all duration-300 hover:scale-105"
            asChild
          >
            <a href="#contactus">
              <Code className="w-5 h-5 mr-2" />
              Contact
            </a>
          </Button>
        </div>

        {/* Social Media Icons */}
        <div className="mt-6 flex justify-center space-x-6">
          <a href="https://www.instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
            <img
              src="/iconsmedia/instagram.webp"
              alt="Instagram"
              className="h-10 w-10 rounded-full border-2 bg-white border-white p-1 hover:opacity-80 transition"
            />
          </a>
          <a href="https://www.linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
            <img
              src="/iconsmedia/linkedin.png"
              alt="LinkedIn"
              className="h-10 w-10 rounded-full border-2 bg-white border-white p-1 hover:opacity-80 transition"
            />
          </a>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <img
              src="/iconsmedia/github.png"
              alt="GitHub"
              className="h-10 w-10 rounded-full border-2 bg-white border-white p-1 hover:opacity-80 transition"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
