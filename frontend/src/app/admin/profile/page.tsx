import { PageHeader } from "@/components/admin/page-header";
import { PersonalDetailsCard } from "@/components/admin/profile/profile-display";
export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and portfolio details"
      />

      <PersonalDetailsCard />
    </div>
  );
}
