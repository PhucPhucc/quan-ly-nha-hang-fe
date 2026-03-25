"use client";

import {
  Contact,
  CreditCard,
  Hash,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import DOBPicker from "@/components/shared/DOBPicker";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { getMyProfile, updateMyProfile } from "@/services/profileService";
import { useAuthStore } from "@/store/useAuthStore";

const SectionTitle = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
  <div className="mb-4 flex items-center gap-2">
    <div className="flex size-8 items-center justify-center rounded-lg bg-secondary">
      <Icon className="size-4 text-secondary-foreground" />
    </div>
    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
  </div>
);

const ProfileForm = () => {
  const { employee, setEmployee } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const res = await getMyProfile();
      if (res.data) {
        setEmployee(res.data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [setEmployee]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      address: formData.get("address") as string,
    };

    try {
      await updateMyProfile(updatedProfile);
      setEmployee({ ...employee, ...updatedProfile });
      toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(UI_TEXT.COMMON.UPDATE_ERROR);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="space-y-10">
      {/* Account Info Section */}
      <section>
        <SectionTitle icon={CreditCard} title={UI_TEXT.PROFILE.ACCOUNT_INFO} />
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</FieldLabel>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                disabled
                defaultValue={employee?.employeeCode}
                className="rounded-xl border-dashed bg-muted/30 pl-10"
              />
            </div>
          </Field>

          <Field>
            <FieldLabel>{UI_TEXT.EMPLOYEE.ROLE}</FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                disabled
                defaultValue={employee?.role}
                className="rounded-xl border-dashed bg-muted/30 pl-10"
              />
            </div>
          </Field>
        </FieldGroup>
      </section>

      {/* Personal Info Section */}
      <section>
        <SectionTitle icon={Contact} title={UI_TEXT.PROFILE.PERSONAL_INFO} />
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="fullName">{UI_TEXT.EMPLOYEE.FULLNAME}</FieldLabel>
            <div className="group relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
              <Input
                name="fullName"
                id="fullName"
                defaultValue={employee?.fullName}
                required
                className="rounded-xl pl-10 focus:ring-slate-900/10 focus:border-slate-300"
              />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">{UI_TEXT.EMPLOYEE.EMAIL}</FieldLabel>
            <div className="group relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
              <Input
                name="email"
                id="email"
                type="email"
                defaultValue={employee?.email}
                required
                className="rounded-xl pl-10 focus:ring-slate-900/10 focus:border-slate-300"
              />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">{UI_TEXT.EMPLOYEE.PHONE}</FieldLabel>
            <div className="group relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
              <Input
                name="phone"
                type="number"
                id="phone"
                defaultValue={employee?.phone}
                className="rounded-xl pl-10 focus:ring-slate-900/10 focus:border-slate-300"
              />
            </div>
          </Field>

          <div className="group relative">
            <DOBPicker dob={employee?.dateOfBirth} />
          </div>

          <Field className="col-span-2">
            <FieldLabel htmlFor="address">{UI_TEXT.EMPLOYEE.ADDRESS}</FieldLabel>
            <div className="group relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
              <Input
                name="address"
                id="address"
                defaultValue={employee?.address}
                className="rounded-xl pl-10 focus:ring-slate-900/10 focus:border-slate-300"
              />
            </div>
          </Field>
        </FieldGroup>
      </section>

      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="reset"
          variant="ghost"
          onClick={() => setIsDirty(false)}
          className="rounded-xl px-6 hover:bg-slate-100"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {UI_TEXT.COMMON.RESET}
        </Button>

        <Button
          type="submit"
          disabled={!isDirty || loading}
          className="rounded-xl bg-slate-900 px-8 shadow-sm hover:bg-slate-800 transition-all text-white"
        >
          {loading ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
          {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.COMMON.SAVE}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
