// D:\kodingan\pribadi\src\components\skills.tsx
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2, Radio } from "lucide-react";
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

// ---------- Non-brand icons use the same vector sizing as skill logos
const RestIcon: React.FC<{ className?: string }> = ({ className }) => <Link2 className={className} aria-hidden="true" />;
const WebSocketIcon: React.FC<{ className?: string }> = ({ className }) => <Radio className={className} aria-hidden="true" />;

// ---------- Data
const skillsByCategory: Record<Category, Skill[]> = {
  "Programming Languages": [
    { icon: SiJavascript, name: "JavaScript", color: "text-yellow-400", shadowColor: "shadow-primary-red/20" },
    { icon: SiTypescript, name: "TypeScript", color: "text-blue-600", shadowColor: "shadow-primary-red/20" },
    { icon: SiPython, name: "Python", color: "text-yellow-300", shadowColor: "shadow-primary-red/20" },
    { icon: SiKotlin, name: "Kotlin", color: "text-purple-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiGo, name: "Go (Golang)", color: "text-cyan-500", shadowColor: "shadow-primary-red/20" },
    { icon: ({ className }) => <span className={`${className} flex items-center justify-center font-bold`}>C#</span>, name: "C#", color: "text-purple-500", shadowColor: "shadow-primary-red/20" },
  ],
  "Frameworks & Libraries": [
    { icon: SiReact, name: "React.js", color: "text-sky-400", shadowColor: "shadow-primary-red/20" },
    { icon: SiAngular, name: "Angular", color: "text-red-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiVuedotjs, name: "Vue.js", color: "text-emerald-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiNextdotjs, name: "Next.js", color: "text-neutral-300", shadowColor: "shadow-primary-red/20" },
    { icon: SiExpress, name: "Express.js", color: "text-neutral-400", shadowColor: "shadow-primary-red/20" },
    { icon: SiNodedotjs, name: "Node.js", color: "text-green-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiDotnet, name: ".NET", color: "text-purple-400", shadowColor: "shadow-primary-red/20" },
  ],
  "Web Fundamentals": [
    { icon: SiHtml5, name: "HTML", color: "text-orange-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiCss3, name: "CSS", color: "text-blue-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiTailwindcss, name: "Tailwind CSS", color: "text-cyan-400", shadowColor: "shadow-primary-red/20" },
  ],
  "API & Architecture": [
    { icon: RestIcon, name: "REST API", color: "text-indigo-400", shadowColor: "shadow-primary-red/20" },
    { icon: WebSocketIcon, name: "WebSocket", color: "text-fuchsia-400", shadowColor: "shadow-primary-red/20" },
  ],
  "Tools & Platforms": [
    { icon: SiDocker, name: "Docker", color: "text-blue-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiGit, name: "Git / GitHub", color: "text-orange-600", shadowColor: "shadow-primary-red/20" },
    { icon: SiPostgresql, name: "PostgreSQL", color: "text-blue-400", shadowColor: "shadow-primary-red/20" },
  ],
  "Testing & Documentation Tools": [
    { icon: SiSwagger, name: "Swagger", color: "text-green-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiPostman, name: "Postman", color: "text-orange-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiSelenium, name: "Selenium", color: "text-green-600", shadowColor: "shadow-primary-red/20" },
    { icon: SiJest, name: "Jest", color: "text-rose-500", shadowColor: "shadow-primary-red/20" },
    { icon: SiMocha, name: "Mocha", color: "text-amber-600", shadowColor: "shadow-primary-red/20" },
    { icon: SiChai, name: "Chai", color: "text-red-600", shadowColor: "shadow-primary-red/20" },
    { icon: SiCypress, name: "Cypress", color: "text-neutral-200", shadowColor: "shadow-primary-red/20" },
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
                bg-surface-high/70 rounded-xl border border-outline-variant hover:bg-surface-card
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
      className="py-10 md:py-12 bg-surface-dim rounded-lg border border-outline-variant"
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
          <div className="relative flex flex-wrap md:flex-nowrap gap-2 p-1 bg-surface-high/70 border border-outline-variant rounded-full">
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
                              transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red/60
                              ${selected ? "text-white" : "text-text-secondary hover:bg-surface-card"}`}
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
