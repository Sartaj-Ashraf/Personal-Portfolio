"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useProfile } from "@/hooks/use-portfolio-data"
import { MapPin, Building, Calendar } from "lucide-react"

export function AboutSection() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know more about who I am, what I do, and what I'm passionate about.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About Content */}
          <div className="space-y-6">
            <p className="text-lg text-foreground leading-relaxed">
              {profile?.about ||
                "I'm a passionate developer with a love for creating innovative solutions and beautiful user experiences. With expertise in modern web technologies, I enjoy turning complex problems into simple, elegant designs."}
            </p>

            {/* Professional Details */}
            <div className="space-y-3">
              {profile?.company && (
                <div className="flex items-center text-muted-foreground">
                  <Building className="h-5 w-5 mr-3 text-primary" />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                <span>Available for new opportunities</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">{profile?.totalProjects?.length || "10+"}</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">{profile?.totalTechStack?.length || "15+"}</div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">{profile?.profileViews || "1K+"}</div>
                <div className="text-sm text-muted-foreground">Profile Views</div>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">3+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
