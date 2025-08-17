import { PageHeader } from "@/components/admin/page-header"
import { ProfileForm } from "@/components/admin/profile/profile-form"

export default function NewProfilePage() {
  return (
      <div className="space-y-6">
        <PageHeader
          title="Add Your Profile"
          description="Create a new profile for your portfolio"
          backHref="/admin/profile/new"
        />
        <ProfileForm />
      </div>
  )
}
