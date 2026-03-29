import { Metadata } from "next";
import React from "react";

import { KdsBrandingMarker } from "@/components/features/branding/KdsBrandingMarker";
import RoleGuard from "@/components/shared/RoleGuard";
import { fetchBrandingSettingsServer } from "@/lib/branding-metadata";
import { EmployeeRole } from "@/types/Employee";

const defaultMetadata: Metadata = {
  title: "FoodHub KDS Dashboard",
  description: "Kitchen Display System Dashboard for FoodHub",
};

export async function generateMetadata(): Promise<Metadata> {
  const branding = await fetchBrandingSettingsServer();

  return {
    title: branding?.kdsTitle || defaultMetadata.title,
    description: defaultMetadata.description,
  };
}

export default function KdsPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[EmployeeRole.CHEFBAR]}>
      <div className="h-full w-full overflow-hidden bg-background text-foreground flex flex-col font-display relative">
        <KdsBrandingMarker />
        {children}
      </div>
    </RoleGuard>
  );
}
