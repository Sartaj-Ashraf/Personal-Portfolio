"use client";
import { PageHeader } from "@/components/admin/page-header";
import { CreateProjectForm } from "@/components/admin/projects/create-project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Project"
        description="Create a new project for your portfolio"
        backHref="/admin/projects"
      />
      <CreateProjectForm />
    </div>
  );
}
