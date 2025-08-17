
import { PageHeader } from "@/components/admin/page-header"
import { ExperienceForm } from "@/components/admin/experiences/experience-form"

export default function NewExperiencePage() {
  return (
      <div className="space-y-6">
        <PageHeader
          title="Add New Experience"
          description="Create a new experience for your portfolio"
          backHref="/admin/experiences"
        />
        <ExperienceForm />
      </div>
  )
}
