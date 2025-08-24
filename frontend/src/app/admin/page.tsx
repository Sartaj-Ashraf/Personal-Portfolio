"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"

const queryClient = new QueryClient()

export default function AdminDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <AdminLayout> */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your portfolio.</p>
          </div>

          {/* Stats */}
          <DashboardStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <QuickActions />
          </div>
        </div>
      {/* </AdminLayout> */}
    </QueryClientProvider>
  )
}
