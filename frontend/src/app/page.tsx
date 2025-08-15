"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Navigation } from "@/components/portfolio/navigation"
import { HeroSection } from "@/components/portfolio/hero-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { TechStackSection } from "@/components/portfolio/tech-stack-section"
import { ContactSection } from "@/components/portfolio/contact-section"

const queryClient = new QueryClient()

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Navigation />
        <main>
          <section id="home">
            <HeroSection />
          </section>
          <AboutSection />
          <ProjectsSection />
          <TechStackSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <footer className="bg-muted/30 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">© 2024 Portfolio. Built with Next.js and Tailwind CSS.</p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  )
}
