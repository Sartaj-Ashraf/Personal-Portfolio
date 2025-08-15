"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTechStack } from "@/hooks/use-portfolio-data"
import Image from "next/image"

const categoryColors = {
  Frontend: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Backend: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Database: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  DevOps: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Mobile: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  Testing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Cloud: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "UI/UX": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

const proficiencyLevels = {
  Beginner: { width: "25%", color: "bg-red-500" },
  Intermediate: { width: "50%", color: "bg-yellow-500" },
  Advanced: { width: "75%", color: "bg-blue-500" },
  Expert: { width: "100%", color: "bg-green-500" },
}

export function TechStackSection() {
  const { data: techStack, isLoading } = useTechStack()

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Group tech stack by category
  const groupedTechStack = techStack?.reduce((acc: any, tech: any) => {
    const category = tech.category || "Other"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(tech)
    return acc
  }, {})

  return (
    <section id="tech-stack" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tech Stack</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life. Always learning and exploring new technologies.
          </p>
        </div>

        {/* Featured Technologies */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-foreground mb-8 text-center">Featured Technologies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {techStack
              ?.filter((tech: any) => tech.featured)
              .map((tech: any) => (
                <Card key={tech._id} className="group hover:shadow-md transition-all duration-300 text-center p-4">
                  <CardContent className="p-0 space-y-3">
                    {tech.imageUrl && (
                      <div className="relative w-12 h-12 mx-auto">
                        <Image
                          src={tech.imageUrl || "/placeholder.svg"}
                          alt={tech.title}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{tech.title}</h4>
                      <Badge
                        variant="secondary"
                        className={`text-xs mt-1 ${categoryColors[tech.category as keyof typeof categoryColors] || categoryColors.Other}`}
                      >
                        {tech.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Technologies by Category */}
        <div className="space-y-12">
          {Object.entries(groupedTechStack || {}).map(([category, techs]: [string, any]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-3 ${
                    categoryColors[category as keyof typeof categoryColors]?.includes("blue")
                      ? "bg-blue-500"
                      : categoryColors[category as keyof typeof categoryColors]?.includes("green")
                        ? "bg-green-500"
                        : categoryColors[category as keyof typeof categoryColors]?.includes("purple")
                          ? "bg-purple-500"
                          : categoryColors[category as keyof typeof categoryColors]?.includes("orange")
                            ? "bg-orange-500"
                            : categoryColors[category as keyof typeof categoryColors]?.includes("pink")
                              ? "bg-pink-500"
                              : categoryColors[category as keyof typeof categoryColors]?.includes("yellow")
                                ? "bg-yellow-500"
                                : categoryColors[category as keyof typeof categoryColors]?.includes("indigo")
                                  ? "bg-indigo-500"
                                  : categoryColors[category as keyof typeof categoryColors]?.includes("red")
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                  }`}
                ></span>
                {category}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techs.map((tech: any) => (
                  <Card key={tech._id} className="group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {tech.imageUrl && (
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={tech.imageUrl || "/placeholder.svg"}
                              alt={tech.title}
                              fill
                              className="object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-foreground truncate">{tech.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {tech.proficiencyLevel}
                            </Badge>
                          </div>

                          {/* Proficiency Bar */}
                          <div className="w-full bg-muted rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                proficiencyLevels[tech.proficiencyLevel as keyof typeof proficiencyLevels]?.color ||
                                "bg-gray-500"
                              }`}
                              style={{
                                width:
                                  proficiencyLevels[tech.proficiencyLevel as keyof typeof proficiencyLevels]?.width ||
                                  "25%",
                              }}
                            ></div>
                          </div>

                          {tech.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{tech.description}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
