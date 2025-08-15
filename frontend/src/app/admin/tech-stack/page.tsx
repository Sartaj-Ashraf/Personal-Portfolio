"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { TechStackTable } from "@/components/admin/tech-stack/tech-stack-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const queryClient = new QueryClient()

export default function AdminTechStackPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="Tech Stack"
            description="Manage your technologies and skills"
            action={
              <Button asChild>
                <Link href="/admin/tech-stack/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Technology
                </Link>
              </Button>
            }
          />

          <TechStackTable />
        </div>
      </AdminLayout>
    </QueryClientProvider>
  )
}
