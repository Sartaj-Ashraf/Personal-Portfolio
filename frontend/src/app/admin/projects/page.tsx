"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { ProjectsTable } from "@/components/admin/projects/projects-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const queryClient = new QueryClient()

export default function AdminProjectsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="Projects"
            description="Manage your portfolio projects"
            action={
              <Button asChild>
                <Link href="/admin/projects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Link>
              </Button>
            }
          />

          <ProjectsTable />
        </div>
      </AdminLayout>
    </QueryClientProvider>
  )
}
