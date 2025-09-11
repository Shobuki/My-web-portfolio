"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import { Navigation } from "swiper/modules"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

gsap.registerPlugin(ScrollTrigger)

type Category =
  | "All"
  | "Web Apps"
  | "Automation & Bots"
  | "AI / ML"
  | "Data & Scraping"
  | "Mobile Apps"
  | "Fun / Misc"

type Project = {
  id: number
  title: string
  description: string
  images?: string[]
  image?: string
  tech: string[]
  color: string
  category: Exclude<Category, "All">
  Link?: string | string[]
}

const CATEGORIES: Category[] = [
  "All",
  "Web Apps",
  "Automation & Bots",
  "AI / ML",
  "Data & Scraping",
  "Mobile Apps",
  "Fun / Misc",
]

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [activeCat, setActiveCat] = useState<Category>("All")

  const projects: Project[] = [
    {
      id: 1,
      title: "Sunflex Store User Website",
      description: "Sunway Trek Masindo website for business",
      images: ["/images/portfolio/sunflexuser.png", "/images/portfolio/sunflexuser2.png"],
      tech: ["React", "Next.js", "Tailwind"],
      color: "from-blue-500 to-cyan-500",
      category: "Web Apps",
    },
    {
      id: 2,
      title: "Sunflex Store Admin Dashboard",
      description:
        "Admin dashboard to manage Sunflex Store with transaction approval and automated email sending",
      image: "/images/portfolio/sunflexadmin.png",
      tech: ["Express.js", "PostgreSQL", "Prisma"],
      color: "from-purple-500 to-pink-500",
      category: "Web Apps",
    },
     {
      id: 3,
      title: "Travel landing page",
      Link:"https://travelikaa.vercel.app/",
      description:
        "Admin dashboard to manage Sunflex Store with transaction approval and automated email sending",
      image: "/images/portfolio/web/travelika.png",
      tech: ["AngularJs", "IndexedDatabase"],
      color: "from-purple-500 to-pink-500",
      category: "Web Apps",
    },
     {
      id: 4,
      title: "Profile landing page",
      Link:"https://shobuki.vercel.app/",
      description:
        "Admin dashboard to manage Sunflex Store with transaction approval and automated email sending",
      image: "/images/portfolio/web/landingpage.png",
      tech: ["Next.js"],
      color: "from-purple-500 to-pink-500",
      category: "Web Apps",
    },
    {
      id: 5,
      title: "WhatsApp Bot Automation",
      description:
        "Automation for WhatsApp messages with mini-games and experiments integrating AI models (IN DEVELOPMENT)",
      images: [
        "/images/portfolio/whatsapp/whatsapp.jpeg",
        "/images/portfolio/whatsapp/whatsapp2.jpeg",
        "/images/portfolio/whatsapp/whatsapp3.jpeg",
        "/images/portfolio/whatsapp/whatsapp4.jpeg",
      ],
      tech: ["Node.js", "JavaScript"],
      color: "from-green-500 to-teal-500",
      category: "Automation & Bots",
    },
    {
      id: 6,
      title: "Healthy Website Calculator",
      description:
        "AI experiment to calculate healthy food + recipes using KNN; integrated with Mistral (Ollama)",
      images: [
        "/images/portfolio/food/1.png",
        "/images/portfolio/food/2.png",
        "/images/portfolio/food/3.png",
        "/images/portfolio/food/4.png",
      ],
      tech: ["Python", "Streamlit", "Uvicorn"],
      color: "from-orange-500 to-red-500",
      category: "AI / ML",
    },
    {
      id: 7,
      title: "Instagram & Twitter Data Scraper",
      description: "Scrape public data from Instagram and Twitter using Node.js + Puppeteer",
      images: ["/images/portfolio/datascraping/data1.png", "/images/portfolio/datascraping/data2.png"],
      tech: ["Node.js"],
      color: "from-indigo-500 to-purple-500",
      category: "Data & Scraping",
    },
    {
      id: 8,
      title: "My Petz App",
      description: "Android app for pet lovers",
      image: "/images/portfolio/mypetz.jpeg",
      tech: ["Kotlin", "Google API Firebase"],
      color: "from-lime-500 to-green-500",
      category: "Mobile Apps",
    },
    {
      id: 9,
      title: "Canggihku App",
      description: "Simple POS Android application",
      image: "/images/portfolio/canggihku.jpeg",
      tech: ["Kotlin", "Google API Firebase"],
      color: "from-lime-500 to-green-500",
      category: "Mobile Apps",
    },
    {
      id: 10,
      title: "Meme Playground",
      description: "A fun little website for memes",
      image: "/images/portfolio/meme.png",
      tech: ["React.js", "Next.js"],
      color: "from-lime-500 to-green-500",
      category: "Fun / Misc",
    },
  ]

  const filtered = useMemo(
    () => (activeCat === "All" ? projects : projects.filter((p) => p.category === activeCat)),
    [activeCat, projects],
  )

  // desktop-only scroll animations to avoid mobile stuck opacity
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              scrollTrigger: {
                trigger: titleRef.current,
                start: "top 85%",
                once: true,
              },
            },
          )

          gsap.fromTo(
            ".project-card",
            { opacity: 0, y: 100, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                once: true,
              },
            },
          )
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // re-animate cards when category changes (desktop only)
  useEffect(() => {
    const mql = typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)") : null
    if (mql?.matches) {
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" },
      )
    }
  }, [activeCat])

  // rely on CSS grid stretching; no JS equalizer to avoid stale heights

  return (
    <section id="projects" ref={sectionRef} className="relative py-8 px-6 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-[#b91c1c] to-[#4c0000] animate-blob opacity-20 blur-3xl rounded-full z-0" />
      <div className="w-full max-w-screen-2xl mx-auto relative z-10">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-light text-center mb-10 md:mb-16">
       <span className="text-white">Featured</span>    <span className="text-red-400">Projects</span>
        </h2>

        {/* Category chips (wrap on mobile) */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition
                  border border-white/10 bg-white/5
                  ${active ? "text-white bg-white/20 shadow" : "text-slate-300 hover:bg-white/10"}`}
                aria-pressed={active}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filtered.map((project) => {
            const hasLink = Boolean(
              project.Link && (Array.isArray(project.Link) ? project.Link.length > 0 : true),
            )
            const href = Array.isArray(project.Link) ? project.Link[0] : project.Link

            const card = (
              <div
                className={`project-card group w/full h-full relative rounded-2xl bg-slate-900/50 backdrop-blur-md border border-[#b91c1c]/40 hover:border-[#b91c1c]/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#b91c1c]/30 overflow-hidden flex flex-col ${
                  hasLink ? "cursor-pointer" : ""
                }`}
              >
                <div className="w-full aspect-[16/9] bg-black flex items-center justify-center relative overflow-hidden">
                  {project.images ? (
                    <Swiper className="w-full h-full" spaceBetween={10} slidesPerView={1} navigation modules={[Navigation]}>
                      {project.images.map((img, index) => (
                        <SwiperSlide key={index} className="!h-full">
                          <Zoom>
                            <div className="flex items-center justify-center w-full h-full">
                              <Image
                                src={img}
                                alt={project.title}
                                width={1200}
                                height={800}
                                className="object-contain max-h-full max-w-full mx-auto my-auto"
                              />
                            </div>
                          </Zoom>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <Zoom>
                      <div className="flex items-center justify-center w-full h-full">
                        <Image
                          src={project.image!}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain max-h-full max-w-full mx-auto my-auto"
                        />
                      </div>
                    </Zoom>
                  )}
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <h3 className="flex-1 min-w-0 pr-2 text-xl font-semibold text-white group-hover:text-[#b91c1c] transition-colors duration-300 whitespace-normal break-words leading-tight">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap">
                        {project.category}
                      </span>
                      {hasLink ? (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30 whitespace-nowrap">
                          click to open
                        </span>
                      ) : (
                        <a
                          href="#contactus"
                          className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 transition whitespace-nowrap"
                        >
                          contact me to see
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
                />
              </div>
            )

            return hasLink && href ? (
              <a key={project.id} href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
                {card}
              </a>
            ) : (
              <div key={project.id} className="h-full">{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
