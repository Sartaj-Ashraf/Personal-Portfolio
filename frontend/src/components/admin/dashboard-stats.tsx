"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects, useTechStack, useProfile } from "@/hooks/use-portfolio-data"
import { contentAPI } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { FolderOpen, Code, MessageSquare, Eye } from "lucide-react"

export function DashboardStats() {
  const { data: projects } = useProjects()
  const { data: techStack } = useTechStack()
  const { data: profile } = useProfile()

  // Fetch contact queries for admin
  const { data: contactQueries } = useQuery({
    queryKey: ["contact-queries"],
    queryFn: async () => {
      const response = await contentAPI.getContactQueries()
      return response.data
    },
  })

  const stats = [
    {
      title: "Total Projects",
      value: projects?.length || 0,
      description: "Published projects",
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Technologies",
      value: techStack?.length || 0,
      description: "Tech stack items",
      icon: Code,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Messages",
      value: contactQueries?.length || 0,
      description: "Contact inquiries",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Profile Views",
      value: profile?.profileViews || 0,
      description: "Total profile views",
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
