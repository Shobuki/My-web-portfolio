"use client"

import { ArrowUpRight, BarChart3, Clock3 } from "lucide-react"

const WAKATIME_PROFILE = "https://wakatime.com/@47482a39-16cf-4012-890f-ed3391304634"
const WAKATIME_CHARTS = [
  { label: "Language breakdown", src: "https://wakatime.com/share/@47482a39-16cf-4012-890f-ed3391304634/c47bab6a-2a27-49c5-9ce8-7cad9d04469c.svg" },
  { label: "All-time coding", src: "https://wakatime.com/share/@47482a39-16cf-4012-890f-ed3391304634/6b5c0039-fd6b-45e1-8a55-e8fc7aad2645.svg" },
]

export default function WakaTimeStats() {
  return (
    <section id="wakatime" className="py-10 md:py-12" aria-labelledby="wakatime-title">
      <div className="mx-auto max-w-7xl">
        <article className="rounded-2xl border border-outline-variant bg-surface-high/70 p-5 shadow-lg shadow-primary-black/30 transition duration-300 hover:border-primary hover:shadow-primary-red/15 sm:p-6 motion-reduce:transition-none">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary-red/30 bg-primary-red/10 text-primary"><Clock3 className="h-5 w-5" /></span>
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-red">Coding profile</p><h2 id="wakatime-title" className="mt-1 font-semibold text-text-primary">WakaTime stats</h2><p className="text-sm text-text-secondary">Languages used and total coding time</p></div>
            </div>
            <BarChart3 className="h-5 w-5 text-primary-red" aria-hidden />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {WAKATIME_CHARTS.map((chart) => (
              <figure key={chart.src} className="rounded-xl border border-outline-variant bg-primary-black/50 p-3 sm:p-4">
                <div className="mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-lg bg-primary-black">
                  <img src={chart.src} alt={`WakaTime ${chart.label} chart`} className="h-full w-full object-contain [filter:invert(1)_sepia(.18)_saturate(.72)_hue-rotate(295deg)]" />
                </div>
                <figcaption className="mt-3 text-center text-sm font-medium text-text-secondary">{chart.label}</figcaption>
              </figure>
            ))}
          </div>

          <a href={WAKATIME_PROFILE} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-outline-variant px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-primary hover:bg-surface-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red active:scale-[0.98] motion-reduce:transition-none">View WakaTime <ArrowUpRight className="h-4 w-4" /></a>
        </article>
      </div>
    </section>
  )
}
