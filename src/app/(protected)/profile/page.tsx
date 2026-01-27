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
 
    <div className="flex justify-center w-full px-6 py-8">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-6xl
          space-y-10
          rounded-2xl
          border
          bg-card
          p-10
          shadow-xl
        "
      >
 
        <div className="space-y-2 border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Update your personal information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
   
          <div className="h-full rounded-xl border bg-muted/20 p-8 space-y-6">
            <h2 className="text-lg font-semibold">
              Personal Information
            </h2>

            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" placeholder="John Doe" />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  disabled
                  className="opacity-70 cursor-not-allowed"
                  placeholder="john@email.com"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input id="address" placeholder="123 Street, USA" />
              </Field>
            </FieldGroup>
          </div>

          <div className="h-full rounded-xl border bg-muted/20 p-8 space-y-6">
            <h2 className="text-lg font-semibold">
              Security
            </h2>

            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="newPassword">
                  New Password
                </FieldLabel>
                <Input id="newPassword" type="password" />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input id="confirmPassword" type="password" />
              </Field>
            </FieldGroup>
          </div>
        </div>


        <div className="flex justify-end gap-4 border-t pt-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;




