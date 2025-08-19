"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { ArrowRight } from "lucide-react" // Ikon baru untuk tombol

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // HAPUS: Array skills tidak lagi diperlukan di sini
  // const skills = [ ... ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animasi Section (tetap sama)
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, filter: "blur(10px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Animasi Gambar (tetap sama)
      gsap.fromTo(
        imageRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
          },
        },
      )

      // Animasi Konten (tetap sama)
      gsap.fromTo(
        contentRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
          },
        },
      )

      // HAPUS: Animasi untuk .skill-icon karena sudah tidak ada
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* KIRI: Image + Other Interests */}
          <div ref={imageRef} className="space-y-12">
            {/* Profile Image (tetap sama) */}
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute inset-0 bg-[#b91c1c] rounded-full blur-3xl opacity-20"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#b91c1c]/40 hover:border-[#b91c1c]/80 hover:scale-105 hover:rotate-3 transition-all duration-500">
                <Image src="/images/me.jpeg" alt="Profile" fill className="object-cover" />
              </div>
            </div>

            {/* Other Interests (tetap sama) */}
            <div className="space-y-4 px-4">
              <h3 className="text-xl font-semibold text-white">Other Interests</h3>
              <div className="flex flex-wrap gap-4">
                {["Machine Learning", "Artificial Intelligence", "Sentiment Analysis", "Data Analyst", "Scrum"].map((topic) => (
                  <span
                    key={topic}
                    className="px-4 py-2 rounded-full bg-slate-800 text-sm text-slate-300 border border-slate-600 hover:border-[#b91c1c] hover:bg-[#4b1b1b] transition-all"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KANAN: Konten Narasi + Tombol CTA */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-6">
                About <span className="text-white">Me</span>
              </h2>

              {/* GANTI PARAGRAF LAMA DENGAN YANG INI */}
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                I am a passionate web developer and a dedicated student at <span className="text-white font-semibold">Universitas Bunda Mulia</span>, currently specializing in <span className="text-white font-semibold">Full-Stack Web Development</span>. My journey into coding began with a simple curiosity that has now blossomed into a full-fledged drive to solve complex problems through technology.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                While I enjoy crafting seamless front-end experiences, my deeper interests lie in the robust logic of <span className="text-white font-semibold">Backend Development</span> and the boundless potential of <span className="text-white font-semibold">Artificial Intelligence</span>. I strive to build products that are not only efficient but also intuitive and enjoyable, always eager to learn and embrace new challenges.
              </p>
              {/* BATAS PENGGANTIAN */}

            </div>


          </div>
        </div>
      </div>
    </section>
  )
}