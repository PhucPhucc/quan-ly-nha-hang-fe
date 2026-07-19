"use client";

import KdsSettingsForm from "@/components/features/Admin/Settings/Kds/KdsSettingsForm";
import { UI_TEXT } from "@/lib/UI_Text";

export default function AdminKdsSettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{UI_TEXT.ADMIN.KDS_CONFIGURATION}</h1>
      <KdsSettingsForm />
    </div>
  );
}
