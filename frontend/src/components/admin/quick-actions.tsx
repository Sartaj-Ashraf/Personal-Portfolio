"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, Eye } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "New Project",
      description: "Add a new project to your portfolio",
      href: "/admin/projects/new",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Add Technology",
      description: "Add a new technology to your stack",
      href: "/admin/tech-stack/new",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "View Portfolio",
      description: "See how your portfolio looks",
      href: "/",
      icon: Eye,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Update Profile",
      description: "Edit your profile information",
      href: "/admin/profile",
      icon: Settings,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button key={action.title} asChild variant="outline" className="h-auto p-4 justify-start bg-transparent">
              <Link href={action.href}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg text-white ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
