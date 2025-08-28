// D:\kodingan\pribadi\src\components\skills.tsx
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiExpress, SiPostgresql, SiPython, SiKotlin, SiGo, SiAngular, SiVuedotjs,
  SiDotnet, SiDocker, SiGit, SiSwagger, SiPostman, SiSelenium, SiJest, SiMocha, SiChai, SiCypress,
} from "react-icons/si";

// ---------- Types
type Category =
  | "Programming Languages"
  | "Frameworks & Libraries"
  | "Web Fundamentals"
  | "API & Architecture"
  | "Tools & Platforms"
  | "Testing & Documentation Tools";

type TabKey = "All" | Category;

interface Skill {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  color: string;       // Tailwind text-* class
  shadowColor: string; // Tailwind shadow-* class
}

// ---------- Small glyphs (for non-brand items)
const Glyph: React.FC<{ glyph: string; className?: string }> = ({ glyph, className }) => (
  <span className={className} role="img" aria-hidden="true">{glyph}</span>
);
const RestIcon: React.FC<{ className?: string }> = ({ className }) => <Glyph glyph="🔗" className={className} />;
const WebSocketIcon: React.FC<{ className?: string }> = ({ className }) => <Glyph glyph="📡" className={className} />;

// ---------- Data
const skillsByCategory: Record<Category, Skill[]> = {
  "Programming Languages": [
    { icon: SiJavascript, name: "JavaScript", color: "text-yellow-400", shadowColor: "shadow-yellow-400/40" },
    { icon: SiTypescript, name: "TypeScript", color: "text-blue-600", shadowColor: "shadow-blue-600/40" },
    { icon: SiPython, name: "Python", color: "text-yellow-300", shadowColor: "shadow-yellow-300/40" },
    { icon: SiKotlin, name: "Kotlin", color: "text-purple-500", shadowColor: "shadow-purple-500/40" },
    { icon: SiGo, name: "Go (Golang)", color: "text-cyan-500", shadowColor: "shadow-cyan-500/40" },
  ],
  "Frameworks & Libraries": [
    { icon: SiReact, name: "React.js", color: "text-sky-400", shadowColor: "shadow-sky-400/40" },
    { icon: SiAngular, name: "Angular", color: "text-red-500", shadowColor: "shadow-red-500/40" },
    { icon: SiVuedotjs, name: "Vue.js", color: "text-emerald-500", shadowColor: "shadow-emerald-500/40" },
    { icon: SiNextdotjs, name: "Next.js", color: "text-neutral-300", shadowColor: "shadow-neutral-300/30" },
    { icon: SiExpress, name: "Express.js", color: "text-neutral-400", shadowColor: "shadow-neutral-400/30" },
    { icon: SiNodedotjs, name: "Node.js", color: "text-green-500", shadowColor: "shadow-green-500/40" },
    { icon: SiDotnet, name: ".NET", color: "text-purple-400", shadowColor: "shadow-purple-400/40" },
  ],
  "Web Fundamentals": [
    { icon: SiHtml5, name: "HTML", color: "text-orange-500", shadowColor: "shadow-orange-500/40" },
    { icon: SiCss3, name: "CSS", color: "text-blue-500", shadowColor: "shadow-blue-500/40" },
    { icon: SiTailwindcss, name: "Tailwind CSS", color: "text-cyan-400", shadowColor: "shadow-cyan-400/40" },
  ],
  "API & Architecture": [
    { icon: RestIcon, name: "REST API", color: "text-indigo-400", shadowColor: "shadow-indigo-400/40" },
    { icon: WebSocketIcon, name: "WebSocket", color: "text-fuchsia-400", shadowColor: "shadow-fuchsia-400/40" },
  ],
  "Tools & Platforms": [
    { icon: SiDocker, name: "Docker", color: "text-blue-500", shadowColor: "shadow-blue-500/40" },
    { icon: SiGit, name: "Git / GitHub", color: "text-orange-600", shadowColor: "shadow-orange-600/40" },
    { icon: SiPostgresql, name: "PostgreSQL", color: "text-blue-400", shadowColor: "shadow-blue-400/40" },
  ],
  "Testing & Documentation Tools": [
    { icon: SiSwagger, name: "Swagger", color: "text-green-500", shadowColor: "shadow-green-500/40" },
    { icon: SiPostman, name: "Postman", color: "text-orange-500", shadowColor: "shadow-orange-500/40" },
    { icon: SiSelenium, name: "Selenium", color: "text-green-600", shadowColor: "shadow-green-600/40" },
    { icon: SiJest, name: "Jest", color: "text-rose-500", shadowColor: "shadow-rose-500/40" },
    { icon: SiMocha, name: "Mocha", color: "text-amber-600", shadowColor: "shadow-amber-600/40" },
    { icon: SiChai, name: "Chai", color: "text-red-600", shadowColor: "shadow-red-600/40" },
    { icon: SiCypress, name: "Cypress", color: "text-neutral-200", shadowColor: "shadow-neutral-200/30" },
  ],
};

// ---------- Small UI
const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-4 md:mb-6">
    <h3 className="text-lg md:text-2xl font-semibold text-neutral-100">{title}</h3>
    {subtitle && <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>}
  </div>
);

interface SkillCardProps extends Skill { compact?: boolean }
const SkillCard: React.FC<SkillCardProps> = ({ icon: Icon, name, color, shadowColor, compact }) => (
  <motion.div
    variants={itemVariants}
    className={`group flex flex-col items-center justify-center ${compact ? "p-4" : "p-5"}
                bg-white/5 rounded-xl border border-white/10 hover:bg-white/10
                hover:-translate-y-1 transition-all duration-200 shadow-lg ${shadowColor}`}
    title={name}
  >
    <Icon className={`${compact ? "w-8 h-8 md:w-10 md:h-10" : "w-10 h-10 md:w-12 md:h-12"} ${color} mb-2 drop-shadow`} />
    <p className={`text-neutral-300 font-medium text-center ${compact ? "text-xs md:text-sm" : "text-sm md:text-base"}`}>
      {name}
    </p>
  </motion.div>
);

// ---------- Animations
const ease = [0.22, 1, 0.36, 1] as const;
const panelVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22, ease } },
};
const gridVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

// ---------- Helper
const toId = (cat: string) => `tab-${cat.toLowerCase().replace(/\s+/g, "-")}`;

const Skills: React.FC = () => {
  const categories = useMemo<Category[]>(
    () => [
      "Programming Languages",
      "Frameworks & Libraries",
      "Web Fundamentals",
      "API & Architecture",
      "Tools & Platforms",
      "Testing & Documentation Tools",
    ],
    []
  );

  const tabs: TabKey[] = useMemo(() => ["All", ...categories], [categories]);
  const [active, setActive] = useState<TabKey>("All");

  const panelId = `panel-${toId(String(active))}`;

  return (
    <motion.section
      id="skills"
      className="py-10 md:py-12 bg-[#221016] rounded-lg border border-white/10"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-100 mb-6 md:mb-8">
          My Skills 🚀
        </h2>


        {/* Segmented tabs (wrap on mobile) with animated active pill */}
        <div role="tablist" aria-label="Skill Categories" className="flex justify-center">
          <div className="relative flex flex-wrap md:flex-nowrap gap-2 p-1 bg-white/5 border border-white/10 rounded-full">
            {tabs.map((cat) => {
              const selected = active === cat;
              const id = toId(String(cat));
              return (
                <button
                  key={String(cat)}
                  id={id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(cat)}
                  className={`relative whitespace-nowrap px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base
                              transition focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60
                              ${selected ? "text-white" : "text-neutral-300 hover:bg-white/10"}`}
                >
                  {selected && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-white/20 shadow"
                      transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated panel */}
        <div className="mt-8 md:mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={String(active)}
              id={panelId}
              role="tabpanel"
              aria-labelledby={toId(String(active))}
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {active === "All" ? (
                <div className="space-y-8 md:space-y-10">
                  {categories.map((cat) => (
                    <section key={cat}>
                      <SectionHeader title={cat} />
                      <motion.div
                        variants={gridVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6"
                      >
                        {skillsByCategory[cat].map((skill) => (
                          <SkillCard key={skill.name} {...skill} compact />
                        ))}
                      </motion.div>
                    </section>
                  ))}
                </div>
              ) : (
                <>
                  <SectionHeader title={active} />
                  <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6"
                  >
                    {skillsByCategory[active].map((skill) => (
                      <SkillCard key={skill.name} {...skill} />
                    ))}
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default Skills;
