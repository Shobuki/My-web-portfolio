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
    <section className="py-5 px-6 bg-primary-black text-white" id="testimony">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-light mb-12">
          My <span className="text-text-primary">Clients</span> Say
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
              <div className="flex flex-col items-center gap-0 bg-surface-high/70 backdrop-blur-md border border-outline-variant rounded-2xl p-6 md:p-7 shadow-lg shadow-primary-black/40 max-w-xl mx-auto">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-primary-red/50 shadow-md shadow-primary-black/40">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>

                <p className="text-text-secondary text-lg italic mt-2">{item.quote}</p>
                <p className="text-text-primary font-semibold text-xl">{item.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
