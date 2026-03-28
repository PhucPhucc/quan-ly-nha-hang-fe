"use client";

import { useEffect } from "react";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";

export function KdsBrandingMarker() {
  const { data: branding } = useBrandingSettings();

  useEffect(() => {
    if (branding?.kdsTitle) {
      document.title = branding.kdsTitle;
    }
  }, [branding]);

  return <div className="sr-only">{branding?.kdsTitle ?? "KDS Dashboard"}</div>;
}
