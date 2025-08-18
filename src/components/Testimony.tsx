"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Image from "next/image"

const testimonies = [
  {
    name: "Arini",
    image: "/images/testimoni/testi1.jpeg",
    quote:
      "Scraping data instagram about 7.000 data",
  },
  {
    name: "Risnisa",
    image: "/images/testimoni/testi2.jpeg",
    quote:
      "Scraping data twitter 10.600 data",
  },
]

export default function Testimony() {
  return (
    <section className="py-5 px-6 bg-[#110809] text-white" id="testimony">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-light mb-12">
          My <span className="text-red-400">Clients</span> Say
        </h2>

        <Swiper
          slidesPerView={1}
          spaceBetween={40}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          modules={[Navigation, Pagination, Autoplay]}
        >
          {testimonies.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center gap-0 bg-slate-900/50 backdrop-blur-md border border-[#b91c1c]/40 rounded-2xl p-6 md:p-7 shadow-lg max-w-xl mx-auto">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#b91c1c]/50 shadow-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>

                <p className="text-slate-300 text-lg italic mt-2">{item.quote}</p>
                <p className="text-red-300 font-semibold text-xl">{item.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
