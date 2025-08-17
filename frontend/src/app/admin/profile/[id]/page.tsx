import { ProfileForm } from "@/components/admin/profile/profile-form";
import { profileAPI } from "@/lib/api";

export default async function EditProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await profileAPI.getProfileById(params?.id);
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <ProfileForm profile={profile.data.profile} isEdit />
    </div>
  );
}
