'use client'

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChatWidget from "@/components/ChatWidget";

const Footer = dynamic(() => import("@/components/Footer"));
const AboutSection = dynamic(() => import("@/components/about"));
const WakaTimeStats = dynamic(() => import("@/components/WakaTimeStats"));
const DeveloperMetrics = dynamic(() => import("@/components/DeveloperMetrics"));
const Skills = dynamic(() => import("@/components/skills"));
const Experience = dynamic(() => import("@/components/experience"));
const Projects = dynamic(() => import("@/components/projects"));
const Testimony = dynamic(() => import("@/components/Testimony"));
const ContactUs = dynamic(() => import("@/components/contactus"));

function SectionPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`w-full animate-pulse rounded-3xl border border-white/5 bg-white/[0.03] ${className}`}
    />
  );
}

function MetricsPlaceholder() {
  return (
    <div aria-hidden className="grid gap-5 py-10 lg:grid-cols-[0.8fr_1.2fr]">
      {[0, 1].map((item) => (
        <div key={item} className="space-y-5 rounded-2xl border border-outline-variant bg-surface-high/70 p-6">
          <div className="h-11 w-48 animate-pulse rounded-xl bg-surface-card" />
          <div className="h-24 animate-pulse rounded-xl bg-surface-card" />
          <div className="h-9 w-32 animate-pulse rounded-full bg-surface-card" />
        </div>
      ))}
    </div>
  );
}

function ProjectsPlaceholder() {
  return (
    <div aria-hidden className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-high/70">
          <div className="aspect-[16/9] animate-pulse bg-surface-card" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-3/4 animate-pulse rounded bg-surface-card" />
            <div className="h-3 w-full animate-pulse rounded bg-surface-card" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-surface-card" />
            <div className="flex gap-2 pt-2"><div className="h-7 w-20 animate-pulse rounded-full bg-surface-card" /><div className="h-7 w-16 animate-pulse rounded-full bg-surface-card" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DeferredSection({
  children,
  className,
  rootMargin = "250px 0px",
  placeholder,
}: {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  placeholder?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : placeholder ?? <SectionPlaceholder className={className} />}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-primary-black text-text-primary">
      <Header />
      <main className="flex-1">
        <Hero />
        <div
          style={{ background: "var(--primary-black)" }}
          className="px-0 sm:px-4 md:px-10 lg:px-20"
        >
          <div className="mx-auto max-w-none lg:max-w-screen-2xl">
            <DeferredSection className="min-h-[420px]">
              <AboutSection />
            </DeferredSection>
            <DeferredSection rootMargin="300px 0px" placeholder={<MetricsPlaceholder />}>
              <WakaTimeStats />
            </DeferredSection>
            <DeferredSection rootMargin="300px 0px" placeholder={<MetricsPlaceholder />}>
              <DeveloperMetrics />
            </DeferredSection>
            <DeferredSection className="min-h-[420px]">
              <Skills />
            </DeferredSection>
            <DeferredSection className="min-h-[420px]">
              <Experience />
            </DeferredSection>
            <DeferredSection rootMargin="350px 0px" placeholder={<ProjectsPlaceholder />}>
              <Projects />
            </DeferredSection>
            <DeferredSection className="min-h-[420px]">
              <Testimony />
            </DeferredSection>
            <DeferredSection className="min-h-[420px]">
              <ContactUs />
            </DeferredSection>
          </div>
        </div>
      </main>
      <DeferredSection className="min-h-[320px]">
        <Footer />
      </DeferredSection>
      <ChatWidget />
    </div>
  );
}
