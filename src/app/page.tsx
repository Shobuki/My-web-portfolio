'use client'

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

const Footer = dynamic(() => import("@/components/Footer"));
const AboutSection = dynamic(() => import("@/components/about"));
const Skills = dynamic(() => import("@/components/skills"));
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

function DeferredSection({
  children,
  className,
  rootMargin = "250px 0px",
}: {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
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
      {isVisible ? children : <SectionPlaceholder className={className} />}
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
          style={{ background: "var(--primary-black, #110809)" }}
          className="px-0 sm:px-4 md:px-10 lg:px-20"
        >
          <div className="mx-auto max-w-none lg:max-w-screen-2xl">
            <DeferredSection className="min-h-[420px]">
              <AboutSection />
            </DeferredSection>
            <DeferredSection className="min-h-[420px]">
              <Skills />
            </DeferredSection>
            <DeferredSection className="min-h-[720px]" rootMargin="350px 0px">
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
    </div>
  );
}
