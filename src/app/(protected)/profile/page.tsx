import ProfileForm from "@/components/features/profile/ProfileForm";
import ChangePasswordDialog from "@/components/features/profile/ChangePasswordDialog";

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      <ProfileForm />
      <ChangePasswordDialog />
    </div>
  );
}
