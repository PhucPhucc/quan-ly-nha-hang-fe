"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const ProfilePage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Update profile (ADMIN)");
  };

  return (
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
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT - Personal Information */}
          <section className="lg:col-span-2 rounded-lg border bg-background p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold">Personal Information</h2>

            <FieldGroup className="space-y-2">
              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Full Name
                </FieldLabel>
                <Input className="h-9 text-sm" placeholder="Admin Name" />
              </Field>

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
                <Input className="h-9 text-sm" placeholder="0123456789" />
              </Field>

              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Date of Birth
                </FieldLabel>
                <Input className="h-9 text-sm" type="date" />
              </Field>
            </FieldGroup>
          </section>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">
            {/* Additional Info */}
            <section className="rounded-lg border bg-background p-4 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold">Additional Info</h2>

              <FieldGroup className="space-y-2">
                <Field>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Address
                  </FieldLabel>
                  <Input
                    className="h-9 text-sm"
                    placeholder="123 Street, City"
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

            {/* Security */}
            <section className="rounded-lg border bg-background p-4 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold">Security</h2>

              <FieldGroup className="space-y-2">
                <Field>
                  <FieldLabel className="text-xs text-muted-foreground">
                    New Password
                  </FieldLabel>
                  <Input className="h-9 text-sm" type="password" />
                </Field>

                <Field>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Confirm Password
                  </FieldLabel>
                  <Input className="h-9 text-sm" type="password" />
                </Field>
              </FieldGroup>
            </section>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-3">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
