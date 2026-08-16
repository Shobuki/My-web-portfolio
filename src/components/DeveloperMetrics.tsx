import { Activity, ArrowUpRight, Github } from "lucide-react"

const GITHUB_PROFILE = "https://github.com/Shobuki"
const GITHUB_GRAPH = "https://ghchart.rshah.org/ff6b6b/Shobuki"

export default function DeveloperMetrics() {
  return (
    <section id="github-activity" className="py-10 md:py-12" aria-labelledby="github-activity-title">
      <div className="mx-auto max-w-7xl">
        <article className="rounded-2xl border border-outline-variant bg-surface-high/70 p-5 shadow-lg shadow-primary-black/30 transition duration-300 hover:border-primary hover:shadow-primary-red/15 sm:p-6 motion-reduce:transition-none">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary-red/30 bg-primary-red/10 text-primary"><Github className="h-5 w-5" /></span>
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-red">Open source activity</p><h2 id="github-activity-title" className="mt-1 font-semibold text-text-primary">GitHub contributions</h2><p className="text-sm text-text-secondary">Public activity by <span className="text-primary">@Shobuki</span></p></div>
            </div>
            <Activity className="h-5 w-5 text-primary-red" aria-hidden />
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-outline-variant bg-primary-black/50 p-4">
            <img src={GITHUB_GRAPH} alt="GitHub contribution activity graph for Shobuki" width={720} height={120} className="min-w-[620px] max-w-none brightness-125 contrast-125" />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-text-secondary">Contribution activity reflects GitHub&apos;s public graph.</p><a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-outline-variant px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-primary hover:bg-surface-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red active:scale-[0.98] motion-reduce:transition-none">Open GitHub <ArrowUpRight className="h-4 w-4" /></a></div>
        </article>
      </div>
    </section>
  )
}
