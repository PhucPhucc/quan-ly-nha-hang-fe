import { Metadata } from "next";
import React from "react";

import RoleGuard from "@/components/shared/RoleGuard";
import { EmployeeRole } from "@/types/Employee";

export const metadata: Metadata = {
  title: "FoodHub KDS Dashboard",
  description: "Kitchen Display System Dashboard for FoodHub",
};

export default function KdsPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[EmployeeRole.CHEFBAR]}>
      <div className="h-full w-full overflow-hidden bg-background text-foreground flex flex-col font-display relative">
        {children}
      </div>
    </RoleGuard>
  );
}
