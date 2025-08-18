"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { Code, Palette, Zap, Globe, Database, Smartphone } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)

  const skills = [
  { icon: Code, name: "HTML/CSS", color: "text-orange-400" },
  { icon: Zap, name: "JavaScript", color: "text-yellow-400" },
  { icon: Globe, name: "React", color: "text-blue-400" },
  { icon: Database, name: "Node.js", color: "text-green-400" },
    { icon: Code, name: "TypeScript", color: "text-blue-500" },
  { icon: Smartphone, name: "Next.js", color: "text-slate-400" },
    { icon: Code, name: "Express.js", color: "text-lime-400" },
  { icon: Database, name: "PostgreSQL", color: "text-blue-300" },
  { icon: Code, name: "Python", color: "text-yellow-200" },
  // added
  { icon: Code, name: "Kotlin", color: "text-indigo-400" },
];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade in
      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          filter: "blur(10px)",
        },
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

      // Image animation
      gsap.fromTo(
        imageRef.current,
        {
          x: -100,
          opacity: 0,
        },
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

      // Content animation
      gsap.fromTo(
        contentRef.current,
        {
          x: 100,
          opacity: 0,
        },
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

      // Skills stagger animation
      gsap.fromTo(
        ".skill-icon",
        {
          opacity: 0,
          scale: 0.5,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 80%",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* KIRI: Image + Other Interests */}
          <div ref={imageRef} className="space-y-12">
            {/* Profile Image */}
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute inset-0 bg-[#b91c1c] rounded-full blur-3xl opacity-20"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#b91c1c]/40 hover:border-[#b91c1c]/80 hover:scale-105 hover:rotate-3 transition-all duration-500">
                <Image src="/images/me.jpeg" alt="Profile" fill className="object-cover" />
              </div>
            </div>

            {/* Other Interests */}
            <div className="space-y-4 px-4">
              <h3 className="text-xl font-semibold text-white">Other Interests</h3>
              <div className="flex flex-wrap gap-4">
                {["Machine Learning", "Artificial Intelligence", "Sentiment Analysis", "Data Analyst","Scrum"].map((topic) => (
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

          {/* KANAN: Content + Skills */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-6">
                About <span className="text-white">Me</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                I'm a passionate web developer with expertise in creating immersive digital experiences...
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                With a keen eye for design and a deep understanding of user experience...
              </p>
            </div>

            {/* Skills Grid */}
            <div ref={skillsRef} className="grid grid-cols-3 gap-6">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="skill-icon group p-4 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-[#b91c1c]/50 hover:bg-[#4b1b1b]/50 transition-all duration-300 hover:scale-105"
                >
                  <skill.icon
                    className={`w-8 h-8 ${skill.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                  />
                  <p className="text-sm text-slate-300">{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
