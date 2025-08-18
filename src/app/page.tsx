// D:\kodingan\pribadi\src\app\page.tsx
'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/about";
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
          className="px-4 py-20 md:px-10 lg:px-20"
        >
          <div className="mx-auto max-w-screen-2xl">
            <AboutSection />
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
