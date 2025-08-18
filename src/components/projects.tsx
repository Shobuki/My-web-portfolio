"use client"

import { useEffect, useRef } from "react"
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

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const projects = [
    {
      id: 1,
      title: "Sunflex Store User Website",
      description: "Sunway Trek Masindo Website for business",
      images: ["/images/portfolio/sunflexuser.png","/images/portfolio/sunflexuser2.png"],
      tech: ["React", "Next.js", "Tailwind"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Sunflex Store Admin Dashboard",
      description: "Admin dashboard for managing Sunflex Store with transaction approval also automation send email",
      image: "/images/portfolio/sunflexadmin.png",
      tech: ["Express.js", "PostgreSQL", "Prisma"],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Whatsapp Bot Automation",
      description: "My project for automating WhatsApp messages also can play some mini games. I also try to integrate with some AI models. (STILL IN DEVELOPMENT)",
      images: ["/images/portfolio/whatsapp/whatsapp.jpeg","/images/portfolio/whatsapp/whatsapp2.jpeg","/images/portfolio/whatsapp/whatsapp3.jpeg","/images/portfolio/whatsapp/whatsapp4.jpeg"],
      tech: ["Node.js","Javascript"],
      color: "from-green-500 to-teal-500",
    },
    {
      id: 4,
      title: "Healthy Website Calculator",
      description: "Some project for AI testing to calculate healthy food with the recipe. I use KNN classification for this project also integrate with mistral AI model from Ollama",
      images: ["/images/portfolio/food/1.png","/images/portfolio/food/2.png","/images/portfolio/food/3.png","/images/portfolio/food/4.png"],
      tech: ["Python", "Streamlit", "Uvicorn"],
      color: "from-orange-500 to-red-500",
    },
    {
      id: 5,
      title: "Data Scraping Instagram & Twitter",
      description: "Program to scrape data from Instagram and Twitter using Node.js Puppeteer",
      images: ["/images/portfolio/datascraping/data1.png","/images/portfolio/datascraping/data2.png",],
      tech: ["Node.js"],
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: 6,
      title: "My Petz App",
      description: "Android app for pet lovers :D",
      image: "/images/portfolio/mypetz.jpeg",
      tech: ["Kotlin", "Google API Firebase"],
      color: "from-lime-500 to-green-500",
    },
    {
      id: 7,
      title: "Canggihku App",
      description: "Simple POS application for android",
      image: "/images/portfolio/canggihku.jpeg",
      tech: ["Kotlin", "Google API Firebase"],
      color: "from-lime-500 to-green-500",
    },
    {
      id: 8,
      title: "Some random website for meme",
      description: "This is for meme",
      image: "/images/portfolio/meme.png",
      tech: ["React.js", "Next.js"],
      color: "from-lime-500 to-green-500",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className=" py-8 px-6 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-[#b91c1c] to-[#4c0000] animate-blob opacity-20 blur-3xl rounded-full z-0" />
      <div className="w-full max-w-screen-2xl mx-auto relative z-10">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-light text-center mb-16">
          Featured <span className="text-red-400">Projects</span>
        </h2>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card group w-full relative rounded-2xl bg-slate-900/50 backdrop-blur-md border border-[#b91c1c]/40 hover:border-[#b91c1c]/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#b91c1c]/30 overflow-hidden"
            >
              <div className="w-full aspect-[16/9] bg-black flex items-center justify-center relative">
  {project.images ? (
    <Swiper
      className="w-full h-full"
      spaceBetween={10}
      slidesPerView={1}
      navigation
      modules={[Navigation]}
    >
      {project.images.map((img, index) => (
        <SwiperSlide key={index}>
          <Zoom>
            {/* flex-center wrapper, biar pasti gambar di tengah */}
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src={img}
                alt={project.title}
                width={1200}
                height={800}
                className="object-contain max-h-full max-w-full mx-auto my-auto"
                // HAPUS style manual height/width!
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
          src={project.image}
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
                <h3 className="text-xl font-semibold text-white group-hover:text-[#b91c1c] transition-colors duration-300">
                  {project.title}
                </h3>
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

          ))}
        </div>
      </div>
    </section>
  )
}
