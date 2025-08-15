"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import { useProfile } from "@/hooks/use-portfolio-data"
import Image from "next/image"

export function HeroSection() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-pulse">Loading...</div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Profile Image */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <Image
            src={profile?.imageUrl || "/placeholder.svg?height=128&width=128&query=professional developer avatar"}
            alt={profile?.name || "Developer"}
            fill
            className="rounded-full object-cover border-4 border-primary/20"
          />
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Hi, I'm <span className="text-primary">{profile?.name || "Developer"}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            {profile?.jobTitle || "Full Stack Developer"}
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {profile?.bio || "Passionate about creating beautiful, functional, and user-centered digital experiences."}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="px-8 py-3 text-lg">
            View My Work
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
            <Mail className="mr-2 h-5 w-5" />
            Get In Touch
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 pt-8">
          {profile?.social?.github && (
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
          )}
          {profile?.social?.linkedin && (
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  )
}
