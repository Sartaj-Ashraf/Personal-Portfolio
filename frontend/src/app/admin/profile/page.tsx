"use client";
import { PageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/profile/profile-form";
export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and portfolio details"
      />

      <ProfileForm />
    </div>
  );
}
