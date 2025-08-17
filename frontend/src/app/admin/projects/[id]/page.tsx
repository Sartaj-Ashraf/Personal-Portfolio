import { ProjectForm } from "@/components/admin/projects/project-form";
import { porjectAPI } from "@/lib/api";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await porjectAPI.getProjectById(params?.id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit Project</h1>
      <ProjectForm project={data} isEdit />
    </div>
  );
}
