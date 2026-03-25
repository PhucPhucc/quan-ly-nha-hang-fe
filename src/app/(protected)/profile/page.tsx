"use client";

import { ShieldCheck, User } from "lucide-react";

import ChangePasswordDialog from "@/components/features/profile/ChangePasswordDialog";
import ProfileForm from "@/components/features/profile/ProfileForm";
import { UI_TEXT } from "@/lib/UI_Text";

const ProfilePage = () => {
  return (
    <div className="flex w-full flex-col">
      {/* Header Banner Section */}
      <div className="relative h-56 w-full bg-slate-50 px-8 pt-6 border-b shadow-sm">
        {/* Background Decorative patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="absolute -bottom-16 left-8 flex items-end gap-6 pb-2">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-background bg-slate-100 shadow-xl transition-all duration-300 hover:scale-105">
            <User className="h-16 w-16 text-slate-400" />
          </div>
          <div className="mb-2 space-y-1">
            <h1 className="text-2xl font-bold text-foreground">{UI_TEXT.PROFILE.TITLE}</h1>
            <p className="text-sm text-muted-foreground">{UI_TEXT.PROFILE.DESCRIPTION}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 px-8 pb-10 pt-24 lg:grid-cols-12">
        {/* Left Column: Form Info */}
        <div className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-[2rem] border bg-card p-1 shadow-sm">
            <div className="rounded-[1.9rem] bg-background p-8">
              <ProfileForm />
            </div>
          </div>
        </div>

        {/* Right Column: Security & Actions */}
        <div className="space-y-6 lg:col-span-4">
          {/* Security Card */}
          <section className="group relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="absolute -right-4 -top-4 size-24 rounded-full bg-success/5 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-success/10 p-2.5">
                  <ShieldCheck className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-bold tracking-tight text-foreground">
                  {UI_TEXT.EMPLOYEE.ACCOUNT_SECURITY}
                </h3>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {UI_TEXT.PROFILE.SECURITY_DESC}
              </p>

              <ChangePasswordDialog />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
