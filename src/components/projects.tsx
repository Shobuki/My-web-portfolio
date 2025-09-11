"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination } from "swiper/modules"
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
  const [isMobile, setIsMobile] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const update = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Tutup lightbox via Escape
  useEffect(() => {
    if (!lightboxSrc) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxSrc(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxSrc])

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

  // existing scroll animations + small filter re-animation
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
    const ctx = gsap.context(() => {
      // Title fade on scroll for md+ only
      if (!isMobile) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
            },
          },
        )

        // Cards reveal on scroll for md+ only
        gsap.fromTo(
          ".project-card",
          { opacity: 0, y: 100, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            },
          },
        )
      } else {
        // Ensure visible on mobile in case ScrollTrigger doesn't run
        gsap.set(".project-card", { opacity: 1, y: 0, scale: 1 })
      }
    })
    return () => ctx.revert()
  }, [])

  // re-animate cards when category changes
  useEffect(() => {
    const isMobileEnv = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
    if (isMobileEnv) {
      gsap.set('.project-card', { opacity: 1, y: 0, scale: 1 })
    } else {
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" },
      )
    }
  }, [activeCat])

  // rely on CSS grid stretching; no JS equalizer to avoid stale heights

  return (
    <section id="projects" ref={sectionRef} className="py-8 px-6">
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

        <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-stretch">
          {filtered.map((project) => {
            const hasLink = Boolean(
              project.Link && (Array.isArray(project.Link) ? project.Link.length > 0 : true),
            )
            const href = Array.isArray(project.Link) ? project.Link[0] : project.Link

            const card = (
              <div
                className={`project-card group w-full h-full relative rounded-2xl bg-slate-900/50 backdrop-blur-md border border-[#b91c1c]/40 hover:border-[#b91c1c]/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#b91c1c]/30 overflow-hidden flex flex-col ${
                  hasLink ? "cursor-pointer" : ""
                }`}
              >
                {/* Media area: on mobile, stack images vertically without Swiper/Zoom */}
                {isMobile ? (
                  <div className="w-full bg-black/80 p-2 rounded-t-2xl">
                    {project.images && project.images.length > 1 ? (
                      <div className="w-full h-56 sm:h-64">
                        <Swiper
                          className="w-full h-full"
                          spaceBetween={8}
                          slidesPerView={1}
                          modules={[Navigation, Pagination]}
                          pagination={{ clickable: true }}
                          navigation
                          preventClicks
                          preventClicksPropagation
                        >
                          {project.images.map((img, idx) => (
                            <SwiperSlide key={idx} className="!h-full">
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLightboxSrc(img) }}
                                className="w-full h-full flex items-center justify-center"
                                title="Lihat gambar"
                              >
                                <Image
                                  src={img}
                                  alt={`${project.title} ${idx + 1}`}
                                  width={1200}
                                  height={800}
                                  sizes="100vw"
                                  loading="lazy"
                                  className="max-h-full max-w-full object-contain"
                                />
                              </button>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLightboxSrc((project.images?.[0] ?? project.image)!) }}
                        className="w-full rounded-md overflow-hidden bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        title="Lihat gambar"
                      >
                        <div className="w-full h-56 sm:h-64 flex items-center justify-center">
                          <Image
                            src={(project.images?.[0] ?? project.image)!}
                            alt={project.title}
                            width={1200}
                            height={800}
                            sizes="100vw"
                            loading="lazy"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
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
                )}

                <div className="p-4 sm:p-6 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3 min-w-0">
                    <h3 className="flex-1 min-w-0 text-base sm:text-lg md:text-xl font-semibold text-white group-hover:text-[#b91c1c] transition-colors duration-300 leading-snug line-clamp-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap flex-shrink-0">
                      <span className="text-[11px] px-2 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap">
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
                  <p className="text-slate-400 text-[12px] sm:text-sm md:text-[15px] leading-relaxed break-words">{project.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
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
      {/* Lightbox sederhana untuk mobile */}
      {isMobile && lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-end p-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxSrc(null) }}
              className="px-3 py-1.5 rounded-md bg-white/10 text-white border border-white/20"
              aria-label="Tutup"
            >
              Tutup
            </button>
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <Image
                src={lightboxSrc}
                alt="Preview"
                width={1600}
                height={1200}
                sizes="100vw"
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
