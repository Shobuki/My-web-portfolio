// D:\kodingan\My-web-portfolio\src\components\experience.tsx
import React from "react";
import { motion } from "framer-motion";
import { SiGo, SiMysql, SiDocker, SiAmazonwebservices, SiGit } from "react-icons/si";

// ---------- Types
interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  logo?: string;
  description: string;
  highlights: string[];
  techStack: { icon: React.ComponentType<{ className?: string }>; name: string; color: string }[];
}

// ---------- Data
const experiences: ExperienceItem[] = [
  {
    company: "PT. Asianet Media Teknologi",
    role: "Backend Developer",
    period: "September 2025 – December 2025",
    description:
      "Developed and maintained backend services for enterprise work order management systems, focusing on API development, cloud infrastructure, and microservice architecture.",
    highlights: [
      "Managed the Work Order lifecycle program, including status transitions, technician validation, rescheduling, rebooking, and cancellations.",
      "Developed and maintained secure APIs for mobile and web platforms using Golang and MySQL.",
      "Designed AWS infrastructure for high availability, including Load Balancer architecture and Disaster Recovery strategy.",
      "Built microservice integrations and automated workflows improving process reliability.",
      "Deployed services in Docker and collaborated using Git-based workflows (branching, rebasing, CI).",
    ],
    techStack: [
      { icon: SiGo, name: "Golang", color: "text-cyan-500" },
      { icon: SiMysql, name: "MySQL", color: "text-blue-500" },
      { icon: SiDocker, name: "Docker", color: "text-sky-500" },
      { icon: SiAmazonwebservices, name: "AWS", color: "text-orange-400" },
      { icon: SiGit, name: "Git", color: "text-orange-600" },
    ],
  },
];

// ---------- Animations
const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.25, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// ---------- Component
const ExperienceCard: React.FC<{ item: ExperienceItem }> = ({ item }) => (
  <motion.article
    variants={itemVariants}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8
               hover:bg-white/[0.07] transition-colors duration-300 shadow-lg shadow-black/20"
  >
    {/* Accent line */}
    <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-fuchsia-500 to-indigo-500" />

    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-neutral-100">{item.role}</h3>
        <p className="text-lg text-fuchsia-400 font-semibold mt-0.5">{item.company}</p>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1.5 text-sm text-neutral-400 bg-white/5 border border-white/10 rounded-full px-3 py-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {item.period}
      </span>
    </div>

    {/* Description */}
    <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-5">{item.description}</p>

    {/* Highlights */}
    <ul className="space-y-2.5 mb-5">
      {item.highlights.map((h, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-neutral-300">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-fuchsia-500 shrink-0" />
          {h}
        </li>
      ))}
    </ul>

    {/* Tech stack pills */}
    <div className="flex flex-wrap gap-2">
      {item.techStack.map((t) => (
        <span
          key={t.name}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
                     bg-white/5 border border-white/10 text-neutral-300"
        >
          <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
          {t.name}
        </span>
      ))}
    </div>
  </motion.article>
);

const Experience: React.FC = () => (
  <motion.section
    id="experience"
    className="py-10 md:py-12 bg-[#1a0f15] rounded-lg border border-white/10"
    initial={{ opacity: 0, y: 24, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease }}
  >
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-100 mb-2">
        Work Experience 💼
      </h2>
      <p className="text-center text-neutral-500 text-sm md:text-base mb-8 md:mb-10">
        Companies I&apos;ve worked with
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-6"
      >
        {experiences.map((exp) => (
          <ExperienceCard key={exp.company} item={exp} />
        ))}
      </motion.div>
    </div>
  </motion.section>
);

export default Experience;
