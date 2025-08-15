"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { ProjectForm } from "@/components/admin/projects/project-form"

const queryClient = new QueryClient()

export default function NewProjectPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="Add New Project"
            description="Create a new project for your portfolio"
            backHref="/admin/projects"
          />

          <ProjectForm />
        </div>
      </AdminLayout>
    </QueryClientProvider>
  )
}
