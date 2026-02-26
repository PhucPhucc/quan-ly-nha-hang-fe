import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import HeaderBar from "@/components/shared/HeaderBar";
import RoleGuard from "@/components/shared/RoleGuard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGuard allowedRoles={["Manager"]}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="">
          <HeaderBar />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RoleGuard>
  );
};

export default layout;
