import ProfileForm from "@/components/features/profile/ProfileForm";
import ChangePasswordDialog from "@/components/features/profile/ChangePasswordDialog";

const ProfilePage = () => {
  return (
    <div className="w-full px-8 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Profile form */}
        <div className="lg:col-span-3">
          <ProfileForm />
        </div>

        {/* Security */}
        <section className="h-fit rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Bảo mật</h2>
          <ChangePasswordDialog />
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
