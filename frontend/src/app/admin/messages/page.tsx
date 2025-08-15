"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { MessagesTable } from "@/components/admin/messages/messages-table"
import { MessageStats } from "@/components/admin/messages/message-stats"

const queryClient = new QueryClient()

export default function AdminMessagesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader title="Messages" description="View and manage contact form submissions" />

          {/* <MessageStats /> */}
          <MessagesTable />
        </div>
      </AdminLayout>
    </QueryClientProvider>
  )
}
