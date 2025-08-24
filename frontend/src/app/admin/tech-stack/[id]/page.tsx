import { UpdateTechStackForm } from "@/components/admin/tech-stack/update-tech-stack-form";
import { techStackAPI } from "@/lib/api";

export default async function EditTechStackPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await techStackAPI.getTechStackById(params?.id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit Technology</h1>
      <UpdateTechStackForm tech={data?.techStack} />
    </div>
  );
}
