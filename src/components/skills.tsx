// D:\kodingan\pribadi\src\components\skills.tsx

import React from "react";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiNextdotjs,
  SiExpress,
  SiPostgresql,
  SiPython,
  SiKotlin,
  SiTailwindcss,
} from "react-icons/si";

// Mendefinisikan tipe untuk setiap item skill
interface Skill {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  color: string;
  shadowColor: string; // Properti untuk efek glow
}

// Daftar skill dengan ikon dan warna yang sesuai
// Warna ikon brand tetap dipertahankan agar mudah dikenali
const skillsData: Skill[] = [
  { icon: SiHtml5, name: "HTML", color: "text-orange-500", shadowColor: "shadow-orange-500/50" },
  { icon: SiCss3, name: "CSS", color: "text-blue-500", shadowColor: "shadow-blue-500/50" },
  { icon: SiJavascript, name: "JavaScript", color: "text-yellow-400", shadowColor: "shadow-yellow-400/50" },
  { icon: SiTypescript, name: "TypeScript", color: "text-blue-600", shadowColor: "shadow-blue-600/50" },
  { icon: SiReact, name: "React", color: "text-sky-400", shadowColor: "shadow-sky-400/50" },
  { icon: SiNextdotjs, name: "Next.js", color: "text-neutral-300", shadowColor: "shadow-neutral-300/50" },
  { icon: SiTailwindcss, name: "Tailwind CSS", color: "text-cyan-400", shadowColor: "shadow-cyan-400/50" },
  { icon: SiNodedotjs, name: "Node.js", color: "text-green-500", shadowColor: "shadow-green-500/50" },
  { icon: SiExpress, name: "Express.js", color: "text-neutral-400", shadowColor: "shadow-neutral-400/50" },
  { icon: SiPostgresql, name: "PostgreSQL", color: "text-blue-400", shadowColor: "shadow-blue-400/50" },
  { icon: SiPython, name: "Python", color: "text-yellow-300", shadowColor: "shadow-yellow-300/50" },
  { icon: SiKotlin, name: "Kotlin", color: "text-purple-500", shadowColor: "shadow-purple-500/50" },
];

const Skills = () => {
  return (
    // Latar belakang diubah agar sesuai dengan tema gelap-ungu/merah dari referensi
    <section id="skills" className="py-10 bg-[#221016] border-white border-1 rounded-lg">
      <div className="mb-5 px-4">
        {/* Warna teks judul disesuaikan agar lebih lembut */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-200 mb-12">
          Keahlian Saya 🚀
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              // Styling kartu diubah menjadi semi-transparan (efek glassmorphism)
              className={`flex flex-col items-center justify-center p-6 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:scale-105 transform transition-all duration-300 shadow-lg ${skill.shadowColor}`}
            >
              <skill.icon className={`w-12 h-12 ${skill.color} mb-3`} />
              {/* Warna teks nama skill disesuaikan */}
              <p className="text-neutral-300 font-semibold text-center">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;