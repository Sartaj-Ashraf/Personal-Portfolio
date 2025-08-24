"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PageHeader } from "@/components/admin/page-header";
import { CreateTechStackForm } from "@/components/admin/tech-stack/tech-stack-form";

const queryClient = new QueryClient();

export default function NewTechStackPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="space-y-6">
        <PageHeader
          title="Add New Technology"
          description="Add a new technology to your tech stack"
          backHref="/admin/tech-stack"
        />
        <CreateTechStackForm />
      </div>
    </QueryClientProvider>
  );
}
