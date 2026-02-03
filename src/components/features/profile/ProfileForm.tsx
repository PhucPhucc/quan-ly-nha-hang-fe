"use client";

import { useEffect, useState } from "react";

import DOBPicker from "@/components/shared/DOBPicker";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { getMyProfile } from "@/services/profileService";
import { Employee } from "@/types/Employee";

const ProfileForm = () => {
  const [profile, setProfile] = useState<Partial<Employee>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getMyProfile();
      console.log(data);
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!isChanged) return;

    // setError("");
    // setLoading(true);

    // try {
    //   await updateMyProfile({
    //     fullName: fullName.trim(),
    //     phone: phone.trim(),
    //     dob,
    //     address: address.trim(),
    //   });
    // } catch (err) {
    //   setError(getErrorMessage(err));
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="space-y-1 border-b pb-3">
        <h2 className="text-lg font-semibold">{UI_TEXT.PROFILE.TITLE}</h2>
        <p className="text-sm text-muted-foreground">{UI_TEXT.PROFILE.DESCRIPTION}</p>
      </div>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="fullName">{UI_TEXT.EMPLOYEE.FULLNAME}</FieldLabel>
          <Input name="fullName" defaultValue={profile.fullName} />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">{UI_TEXT.EMPLOYEE.PHONE}</FieldLabel>
          <Input name="phone" defaultValue={profile.phone} />
        </Field>

        <DOBPicker dob={profile.dateOfBirth} />

        <Field>
          <FieldLabel htmlFor="address">{UI_TEXT.EMPLOYEE.ADDRESS}</FieldLabel>
          <Input name="address" defaultValue={profile.address} />
        </Field>

        {/* Read-only */}
        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.EMAIL}</FieldLabel>
          <Input defaultValue={profile.email} disabled />
        </Field>

        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.ROLE}</FieldLabel>
          <Input disabled defaultValue={profile.role} />
        </Field>
      </FieldGroup>

      {/* {error && <p className="text-sm text-destructive">{error}</p>} */}

      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button type="reset" variant="outline">
          {UI_TEXT.COMMON.CANCEL}
        </Button>

        <Button type="submit">
          {/* {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.COMMON.SAVE} */}
          Save
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
