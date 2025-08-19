// D:\kodingan\pribadi\src\app\page.tsx
'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/about";
import Skills from "@/components/skills"
import Projects from "@/components/projects";
import Testimony from "@/components/Testimony";
import ContactUs from "@/components/contactus";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-primary-black text-text-primary">
      <Header />
      <main className="flex-1">
        <Hero />
        <div
          style={{ background: 'var(--primary-black, #110809)' }}
          className="px-0 sm:px-4 md:px-10 lg:px-20"   // ← mobile tanpa padding
        >
          <div className="mx-auto max-w-none lg:max-w-screen-2xl">  {/* ← mobile full width */}
            <AboutSection />
            <Skills />
            <Projects />
            <Testimony />
            <ContactUs />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
