"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ExternalLink, FileText, Github, LockKeyhole } from "lucide-react"
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

type Category = "All" | "Web Apps" | "Automation & Bots" | "AI / ML" | "Data & Scraping" | "Mobile Apps" | "Fun / Misc"
type Project = {
  id: number
  title: string
  description: string
  images?: string[]
  image?: string
  tech: string[]
  category: Exclude<Category, "All">
  demo?: string
  github?: string
  caseStudy?: boolean
}

const CATEGORIES: Category[] = ["All", "Web Apps", "Automation & Bots", "AI / ML", "Data & Scraping", "Mobile Apps", "Fun / Misc"]

const projects: Project[] = [
  {
    id: 1,
    title: "Asianet Workforce Management System",
    demo: "https://swfm.asianet.co.id/",
    caseStudy: true,
    description: "An internal workforce platform for work orders, teams, sites, services, uploads, analytics, exports, and connected microservices.",
    images: ["/images/portfolio/asianet/asianet.png", "/images/portfolio/asianet/asianet2.png", "/images/portfolio/asianet/asianet3.png", "/images/portfolio/asianet/asianet4.jpeg", "/images/portfolio/asianet/asianet5.jpeg", "/images/portfolio/asianet/asianet6.jpeg", "/images/portfolio/asianet/asianet7.jpeg"],
    tech: ["Golang", "MySQL", "Redis", "Next.js", "Flutter", "Docker", "AWS"],
    category: "Web Apps",
  },
  { id: 2, title: "Sunflex Store User Website", description: "Business-facing storefront for Sunway Trek Masindo.", images: ["/images/portfolio/sunflexuser.png", "/images/portfolio/sunflexuser2.png"], tech: ["React", "Next.js", "Tailwind"], category: "Web Apps" },
  { id: 3, title: "Sunflex Store Admin Dashboard", description: "Admin dashboard for transaction approval and automated email workflows.", image: "/images/portfolio/sunflexadmin.png", tech: ["Express.js", "PostgreSQL", "Prisma"], category: "Web Apps" },
  { id: 4, title: "Travel Landing Page", demo: "https://travelikaa.vercel.app/", description: "Responsive travel landing page.", image: "/images/portfolio/web/travelika.png", tech: ["AngularJS", "IndexedDB"], category: "Web Apps" },
  { id: 5, title: "Profile Landing Page", demo: "https://shobuki.vercel.app/", description: "Personal profile landing page.", image: "/images/portfolio/web/landingpage.png", tech: ["Next.js"], category: "Web Apps" },
  { id: 6, title: "WhatsApp Bot Automation", description: "WhatsApp automation with mini-games and AI experiments. In development.", images: ["/images/portfolio/whatsapp/whatsapp.jpeg", "/images/portfolio/whatsapp/whatsapp2.jpeg", "/images/portfolio/whatsapp/whatsapp3.jpeg", "/images/portfolio/whatsapp/whatsapp4.jpeg"], tech: ["Node.js", "JavaScript"], category: "Automation & Bots" },
  { id: 7, title: "Healthy Website Calculator", description: "Healthy food and recipe calculator experiment using KNN and local Mistral models.", images: ["/images/portfolio/food/1.png", "/images/portfolio/food/2.png", "/images/portfolio/food/3.png", "/images/portfolio/food/4.png"], tech: ["Python", "Streamlit", "Uvicorn"], category: "AI / ML" },
  { id: 8, title: "Instagram & Twitter Data Scraper", description: "Public-data scraping workflow built with Node.js and Puppeteer.", images: ["/images/portfolio/datascraping/data1.png", "/images/portfolio/datascraping/data2.png"], tech: ["Node.js"], category: "Data & Scraping" },
  { id: 9, title: "My Petz App", description: "Android app for pet lovers.", image: "/images/portfolio/mypetz.jpeg", tech: ["Kotlin", "Google API Firebase"], category: "Mobile Apps" },
  { id: 10, title: "Canggihku App", description: "Simple POS Android application.", image: "/images/portfolio/canggihku.jpeg", tech: ["Kotlin", "Google API Firebase"], category: "Mobile Apps" },
  { id: 11, title: "Meme Playground", description: "Small interactive website for memes.", image: "/images/portfolio/meme.png", tech: ["React.js", "Next.js"], category: "Fun / Misc" },
]

function ProjectMedia({ project, isMobile, onPreview }: { project: Project; isMobile: boolean; onPreview: (src: string) => void }) {
  const images = project.images ?? (project.image ? [project.image] : [])
  const content = images.length > 1 ? (
    <Swiper className="h-full w-full" spaceBetween={8} slidesPerView={1} modules={isMobile ? [Navigation, Pagination] : [Navigation]} pagination={isMobile ? { clickable: true } : false} navigation>
      {images.map((src, index) => (
        <SwiperSlide key={src} className="!h-full">
          <button type="button" onClick={() => onPreview(src)} className="flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red" aria-label={`Preview ${project.title} image ${index + 1}`}>
            <Image src={src} alt={`${project.title} preview ${index + 1}`} width={1200} height={800} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" className="h-full w-full object-contain" />
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  ) : images[0] ? (
    <button type="button" onClick={() => onPreview(images[0])} className="flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red" aria-label={`Preview ${project.title}`}>
      <Image src={images[0]} alt={project.title} width={1200} height={800} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" className="h-full w-full object-contain" />
    </button>
  ) : null

  return (
    <div className="relative aspect-[16/9] overflow-hidden border-b border-outline-variant bg-black/70">
      {isMobile ? content : <Zoom>{content}</Zoom>}
      <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${project.demo ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200" : "border-outline-variant bg-primary-black/80 text-text-secondary"}`}>
          {project.demo ? "Live" : "Private"}
        </span>
        {project.caseStudy && <span className="rounded-full border border-primary-red/35 bg-primary-red/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">Case Study</span>}
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeCat, setActiveCat] = useState<Category>("All")
  const [isMobile, setIsMobile] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const filtered = useMemo(() => activeCat === "All" ? projects : projects.filter((project) => project.category === activeCat), [activeCat])

  useEffect(() => {
    const update = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxSrc(null)
        setSelectedProject(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches
    const context = gsap.context(() => {
      if (mobile) {
        gsap.set(".project-card", { opacity: 1, y: 0, scale: 1 })
        return
      }
      gsap.fromTo(titleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: titleRef.current, start: "top 80%" } })
      gsap.fromTo(".project-card", { opacity: 0, y: 100, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: containerRef.current, start: "top 80%" } })
    }, sectionRef)
    return () => context.revert()
  }, [])

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      gsap.set(".project-card", { opacity: 1, y: 0, scale: 1 })
      return
    }
    gsap.fromTo(".project-card", { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" })
  }, [activeCat])

  return (
    <section id="projects" ref={sectionRef} className="relative py-8 px-6">
      <div className="pointer-events-none absolute -left-32 -top-32 z-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-red to-[#4c0000] opacity-20 blur-3xl" />
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl">
        <h2 ref={titleRef} className="mb-10 text-center text-4xl font-light text-text-primary md:mb-16 md:text-5xl">Featured Projects</h2>
        <div className="mb-8 flex flex-wrap justify-center gap-2" aria-label="Project categories">
          {CATEGORIES.map((category) => {
            const active = activeCat === category
            return <button key={category} type="button" onClick={() => setActiveCat(category)} aria-pressed={active} className={`rounded-full border px-4 py-1.5 text-sm transition motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red active:scale-[0.98] ${active ? "border-primary-red bg-primary-red/15 text-primary shadow shadow-primary-red/20" : "border-outline-variant bg-surface-card/50 text-text-secondary hover:border-primary hover:bg-surface-high"}`}>{category}</button>
          })}
        </div>
        <div ref={containerRef} className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <article key={project.id} className="project-card group flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-high/70 shadow-lg shadow-primary-black/30 transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-primary-red/20 motion-reduce:transform-none motion-reduce:transition-none">
              <ProjectMedia project={project} isMobile={isMobile} onPreview={setLightboxSrc} />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary sm:text-xl">{project.title}</h3>
                  <span className="shrink-0 rounded-full border border-outline-variant bg-surface-card px-2 py-1 text-[10px] text-text-secondary">{project.category}</span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => <span key={tech} className="rounded-full bg-surface-card px-2.5 py-1 text-xs text-text-secondary">{tech}</span>)}
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-outline-variant pt-4">
                  {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary-red px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#b91c1c] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"><ExternalLink className="h-3.5 w-3.5" />Demo</a>}
                  {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant px-3.5 py-2 text-xs font-bold text-text-primary transition hover:border-primary hover:bg-surface-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red active:scale-[0.98]"><Github className="h-3.5 w-3.5" />GitHub</a>}
                  <button type="button" onClick={() => setSelectedProject(project)} className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant px-3.5 py-2 text-xs font-bold text-text-primary transition hover:border-primary hover:bg-surface-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red active:scale-[0.98]"><FileText className="h-3.5 w-3.5" />Detail</button>
                  {!project.demo && <span className="ml-auto inline-flex items-center gap-1 text-xs text-text-secondary"><LockKeyhole className="h-3.5 w-3.5" />Private work</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {lightboxSrc && <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Image preview" onClick={() => setLightboxSrc(null)}>
        <div className="flex justify-end"><button type="button" onClick={() => setLightboxSrc(null)} className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red">Close</button></div>
        <div className="relative flex flex-1 items-center justify-center"><Image src={lightboxSrc} alt="Project preview" width={1600} height={1200} sizes="100vw" className="max-h-full max-w-full object-contain" priority /></div>
      </div>}

      {selectedProject && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="project-detail-title" onClick={() => setSelectedProject(null)}>
        <article className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-outline-variant bg-surface-high p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-red">{selectedProject.caseStudy ? "Case Study" : "Project Detail"}</p><h3 id="project-detail-title" className="mt-2 text-2xl font-bold text-text-primary">{selectedProject.title}</h3></div><button type="button" onClick={() => setSelectedProject(null)} className="rounded-full border border-outline-variant px-3 py-1.5 text-sm text-text-secondary transition hover:border-primary hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red">Close</button></div>
          {(selectedProject.images?.[0] ?? selectedProject.image) && <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl border border-outline-variant bg-black/70"><Image src={selectedProject.images?.[0] ?? selectedProject.image!} alt={selectedProject.title} fill sizes="(max-width: 768px) 100vw, 672px" className="object-contain" /></div>}
          <p className="mt-5 leading-relaxed text-text-secondary">{selectedProject.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">{selectedProject.tech.map((tech) => <span key={tech} className="rounded-full bg-surface-card px-3 py-1.5 text-sm text-text-secondary">{tech}</span>)}</div>
          <div className="mt-6 flex flex-wrap gap-2">{selectedProject.demo && <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary-red px-4 py-2 text-sm font-bold text-white transition hover:bg-[#b91c1c] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"><ExternalLink className="h-4 w-4" />Open Demo</a>}{selectedProject.github && <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant px-4 py-2 text-sm font-bold text-text-primary transition hover:border-primary hover:bg-surface-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red active:scale-[0.98]"><Github className="h-4 w-4" />GitHub</a>}</div>
        </article>
      </div>}
    </section>
  )
}
