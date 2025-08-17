"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { PageHeader } from "@/components/admin/page-header";
import { ExperiencesTable } from "@/components/admin/experiences/experiences-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminExperiencesPage() {
  return (
      <div className="space-y-6">
        <PageHeader
          title="Experiences"
          description="Manage your portfolio experiences"
          action={
            <Button asChild>
              <Link href="/admin/experiences/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Link>
            </Button>
          }
        />
        <ExperiencesTable />
      </div>
  );
}
