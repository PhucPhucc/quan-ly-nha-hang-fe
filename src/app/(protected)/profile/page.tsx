"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const ProfilePage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Update profile");
  };

  return (
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
          </p>

          <FieldGroup>
            <Field className="gap-1">
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" placeholder="John Doe" />
            </Field>

            <Field className="gap-1">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                disabled
                placeholder="john@email.com"
              />
            </Field>

            <Field className="gap-1">
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input id="address" placeholder="123 Street, USA" />
            </Field>
          </FieldGroup>
        </div>

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

            <Field className="gap-1">
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input id="confirmPassword" type="password" />
            </Field>
          </FieldGroup>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="hover:bg-primary-hover">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfilePage;
