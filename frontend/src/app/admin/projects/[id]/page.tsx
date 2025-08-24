import { EditProjectForm } from "@/components/admin/projects/update-project-form";
import { porjectAPI } from "@/lib/api";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await porjectAPI.getProjectById(params?.id);
  console.log({data});

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit Project</h1>
      <EditProjectForm project={data?.data} />
    </div>
  );
}
