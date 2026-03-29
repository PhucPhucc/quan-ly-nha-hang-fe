"use client";

import { useEffect } from "react";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";

export function BrandingDocumentSync() {
  const { data: branding } = useBrandingSettings();

  useEffect(() => {
    if (!branding) {
      return;
    }

    if (branding.appTitle) {
      document.title = branding.appTitle;
    }

    if (branding.language) {
      document.documentElement.lang = branding.language;
    }
  }, [branding]);

  return null;
}
