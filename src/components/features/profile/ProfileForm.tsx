"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { updateMyProfile } from "@/services/profileService";

type ProfileFormProps = {
  initialData?: {
    fullName?: string;
    phone?: string;
    dob?: string;
    address?: string;
    email?: string;
    role?: string;
  };
};

const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setFullName(initialData.fullName ?? "");
    setPhone(initialData.phone ?? "");
    setDob(initialData.dob ?? "");
    setAddress(initialData.address ?? "");
  }, [initialData]);

  const isChanged = useMemo(() => {
    return (
      fullName !== (initialData?.fullName ?? "") ||
      phone !== (initialData?.phone ?? "") ||
      dob !== (initialData?.dob ?? "") ||
      address !== (initialData?.address ?? "")
    );
  }, [fullName, phone, dob, address, initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isChanged) return;

    setError("");
    setLoading(true);

    try {
      await updateMyProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        dob,
        address: address.trim(),
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!initialData) return;
    setFullName(initialData.fullName ?? "");
    setPhone(initialData.phone ?? "");
    setDob(initialData.dob ?? "");
    setAddress(initialData.address ?? "");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="space-y-1 border-b pb-3">
        <h2 className="text-lg font-semibold">{UI_TEXT.PROFILE.TITLE}</h2>
        <p className="text-sm text-muted-foreground">{UI_TEXT.PROFILE.DESCRIPTION}</p>
      </div>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.FULLNAME}</FieldLabel>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Field>

        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.PHONE}</FieldLabel>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>

        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.DOB}</FieldLabel>
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </Field>

        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.ADDRESS}</FieldLabel>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>

        {/* Read-only */}
        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.EMAIL}</FieldLabel>
          <Input value={initialData?.email ?? ""} disabled />
        </Field>

        <Field>
          <FieldLabel>{UI_TEXT.EMPLOYEE.ROLE}</FieldLabel>
          <Input value={initialData?.role ?? ""} disabled />
        </Field>
      </FieldGroup>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
          {UI_TEXT.COMMON.CANCEL}
        </Button>

        <Button type="submit" disabled={loading || !isChanged}>
          {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.COMMON.SAVE}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
