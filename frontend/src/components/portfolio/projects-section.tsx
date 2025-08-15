"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProjects } from "@/hooks/use-portfolio-data"
import { ExternalLink, Github, Calendar } from "lucide-react"
import Image from "next/image"

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects()

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are some of the projects I've worked on recently. Each one represents a unique challenge and learning
            experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project: any) => (
            <Card key={project._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Project Image */}
              {project.projectImages?.[0] && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.projectImages[0].url || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{project.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 3).map((tech: any, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech.title || `Tech ${index + 1}`}
                    </Badge>
                  ))}
                  {project.techStack?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.techStack.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Features */}
                {project.features?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {project.features.slice(0, 2).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Project Links */}
                <div className="flex gap-2 pt-4">
                  {project.githubRepo && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.githubRepo} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveDemo && (
                    <Button size="sm" asChild>
                      <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>

                {/* Project Timeline */}
                {project.startDate && (
                  <div className="flex items-center text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(project.startDate).toLocaleDateString()}
                    {project.endDate && <span> - {new Date(project.endDate).toLocaleDateString()}</span>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
