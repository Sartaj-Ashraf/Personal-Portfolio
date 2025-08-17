import { ExperienceForm } from "@/components/admin/experiences/experience-form";
import { contentAPI } from "@/lib/api";

export default async function EditExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  const experience = await contentAPI.getExperienceById(params?.id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit Experience</h1>
      <ExperienceForm experience={experience.data.experience} isEdit />
    </div>
  );
}
