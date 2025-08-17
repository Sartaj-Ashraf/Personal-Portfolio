"use client"


import { PageHeader } from "@/components/admin/page-header"
import { MessagesTable } from "@/components/admin/messages/messages-table"
import { MessageStats } from "@/components/admin/messages/message-stats"

export default function AdminMessagesPage() {
  return (

        <div className="space-y-6">
          <PageHeader title="Messages" description="View and manage contact form submissions" />

          {/* <MessageStats /> */}
          <MessagesTable />
        </div>

  )
}
