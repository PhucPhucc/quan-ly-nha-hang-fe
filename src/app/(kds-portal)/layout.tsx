import { Metadata } from "next";
import React from "react";

import { KDSQuickNav } from "@/components/features/kds/KDSQuickNav";
import AuthGuard from "@/components/shared/AuthGuard";

export const metadata: Metadata = {
  title: "FoodHub KDS Dashboard",
  description: "Kitchen Display System Dashboard for FoodHub",
};

export default function KdsPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col font-display relative">
        {children}
        <KDSQuickNav />
      </div>
    </AuthGuard>
  );
}
