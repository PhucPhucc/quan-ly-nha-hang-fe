"use client";

import { useEffect, useState } from "react";

import DOBPicker from "@/components/shared/DOBPicker";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { getMyProfile, updateMyProfile } from "@/services/profileService";
import { Employee } from "@/types/Employee";

const ProfileForm = () => {
  const [profile, setProfile] = useState<Partial<Employee>>({});
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const res = await getMyProfile();
      if (res.data) {
        setProfile(res.data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      address: formData.get("address") as string,
    };

    console.log(updatedProfile);
    await updateMyProfile(updatedProfile);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setIsDirty(true)}
      className="space-y-4 rounded-xl border bg-card p-5 shadow-sm"
    >
      <div className="space-y-1 border-b pb-3">
        <h2 className="text-lg font-semibold">{UI_TEXT.PROFILE.TITLE}</h2>
        <p className="text-sm text-muted-foreground">{UI_TEXT.PROFILE.DESCRIPTION}</p>
      </div>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Read-only */}
        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</FieldLabel>
          <Input disabled defaultValue={profile.employeeCode} />
        </Field>

        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.ROLE}</FieldLabel>
          <Input disabled defaultValue={profile.role} />
        </Field>

        {/* editable */}
        <Field>
          <FieldLabel htmlFor="fullName">{UI_TEXT.EMPLOYEE.FULLNAME}</FieldLabel>
          <Input name="fullName" id="fullName" defaultValue={profile.fullName} required />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">{UI_TEXT.EMPLOYEE.EMAIL}</FieldLabel>
          <Input name="email" id="email" type="email" defaultValue={profile.email} required />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">{UI_TEXT.EMPLOYEE.PHONE}</FieldLabel>
          <Input name="phone" type="number" id="phone" defaultValue={profile.phone} />
        </Field>

        <DOBPicker dob={profile.dateOfBirth} />

        <Field className="col-span-2">
          <FieldLabel htmlFor="address">{UI_TEXT.EMPLOYEE.ADDRESS}</FieldLabel>
          <Input name="address" id="address" defaultValue={profile.address} />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-2 border-t-2">
        <Button type="reset" variant="outline" onClick={() => setIsDirty(false)}>
          {UI_TEXT.COMMON.RESET}
        </Button>

        <Button type="submit" disabled={!isDirty || loading}>
          {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.COMMON.SAVE}
          {loading && <Spinner />}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
