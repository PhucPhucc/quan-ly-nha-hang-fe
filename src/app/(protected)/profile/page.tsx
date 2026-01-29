"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

const ProfilePage = () => {
  // ===== PROFILE STATE =====
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  // ===== UPDATE PROFILE =====
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          fullName,
          phone,
          dob,
          address,
        }),
      });

      if (!res.ok) throw new Error("Update profile failed");

      console.log("✅ Profile updated");
    } catch (err) {
      console.error("❌ Update profile error", err);
    }
  };

  // ===== PASSWORD STATE =====
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  // ===== VALIDATE PASSWORD =====
  const validatePassword = () => {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.current = "Current password is required";
    }

    if (!newPassword) {
      newErrors.new = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.new = "Password must be at least 8 characters";
    } else if (newPassword === currentPassword) {
      newErrors.new = "New password must be different from current password";
    }

    if (!confirmPassword) {
      newErrors.confirm = "Please confirm new password";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== CHANGE PASSWORD =====
  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) throw new Error("Change password failed");

      console.log("✅ Password changed");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      console.error("❌ Change password error", err);
    }
  };

  return (
<<<<<<< HEAD
    <form
      onSubmit={handleSubmit}
      className="border border-primary bg-card rounded-2xl px-6 py-6 shadow-2xl space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-center">My Profile</h1>
        <p className="text-sm text-muted-foreground text-center">
          Manage your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            Personal Information
=======
    <div className="w-full px-6 py-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl space-y-5 rounded-xl border bg-card p-5 shadow-lg"
      >
        {/* Header */}
        <div className="space-y-1 border-b pb-3">
          <h1 className="text-xl font-semibold">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            Update your personal information and security settings
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b
          </p>
        </div>

<<<<<<< HEAD
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            Change Password
          </p>
          <Field className="gap-1">
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
            />
          </Field>
          <FieldGroup>
            <Field className="gap-1">
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input id="newPassword" type="password" />
            </Field>
=======
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT */}
          <section className="lg:col-span-2 rounded-lg border bg-background p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold">Personal Information</h2>

            <FieldGroup className="space-y-2">
              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Full Name
                </FieldLabel>
                <Input
                  className="h-9 text-sm"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Field>
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Email
                </FieldLabel>
                <Input
                  className="h-9 text-sm opacity-70 cursor-not-allowed"
                  value="admin@email.com"
                  disabled
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Phone
                </FieldLabel>
                <Input
                  className="h-9 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Date of Birth
                </FieldLabel>
                <Input
                  className="h-9 text-sm"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </section>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">
            <section className="rounded-lg border bg-background p-4 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold">Additional Info</h2>

              <FieldGroup className="space-y-2">
                <Field>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Address
                  </FieldLabel>
                  <Input
                    className="h-9 text-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Role
                  </FieldLabel>
                  <Input
                    className="h-9 text-sm font-medium opacity-70 cursor-not-allowed"
                    value="ADMIN"
                    disabled
                  />
                </Field>
              </FieldGroup>
            </section>

            {/* SECURITY */}
            <section className="rounded-lg border bg-background p-4 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold">Security</h2>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>

                  <FieldGroup className="space-y-3">
                    {/* Current */}
                    <Field>
                      <FieldLabel className="text-xs text-muted-foreground">
                        Current Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          type={showCurrent ? "text" : "password"}
                          className="pr-10"
                          value={currentPassword}
                          onChange={(e) =>
                            setCurrentPassword(e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.current && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.current}
                        </p>
                      )}
                    </Field>

                    {/* New */}
                    <Field>
                      <FieldLabel className="text-xs text-muted-foreground">
                        New Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          className="pr-10"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.new && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.new}
                        </p>
                      )}
                    </Field>

                    {/* Confirm */}
                    <Field>
                      <FieldLabel className="text-xs text-muted-foreground">
                        Confirm New Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          className="pr-10"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          {showConfirm ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      {errors.confirm && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.confirm}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>

                  <DialogFooter className="mt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleChangePassword}>
                      Update Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </section>
          </div>
        </div>

<<<<<<< HEAD
      <div className="flex justify-end gap-3 border-t pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="hover:bg-primary-hover">
          Save Changes
        </Button>
      </div>
    </form>
=======
        <div className="flex justify-end gap-3 border-t pt-3">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b
  );
};

export default ProfilePage;
