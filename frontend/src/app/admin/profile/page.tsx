"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { ProfileForm } from "@/components/admin/profile/profile-form"

const queryClient = new QueryClient()

export default function AdminProfilePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader title="Profile" description="Manage your personal information and portfolio details" />

          <ProfileForm />
        </div>
      </AdminLayout>
    </QueryClientProvider>
  )
}
