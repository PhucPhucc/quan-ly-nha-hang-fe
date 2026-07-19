"use client";

import BrandingSettingsForm from "@/components/features/Admin/Settings/BrandingSettingsForm";
import { BrandingDocumentSync } from "@/components/features/branding/BrandingDocumentSync";
import { UI_TEXT } from "@/lib/UI_Text";

export default function AdminBrandingSettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{UI_TEXT.ADMIN.BRAND_CONFIGURATION}</h1>
      <BrandingSettingsForm />
      <BrandingDocumentSync />
    </div>
  );
}
