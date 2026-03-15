import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import HeaderBar from "@/components/shared/HeaderBar";
import RoleGuard from "@/components/shared/RoleGuard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import QueryProvider from "@/providers/QueryProvider";
import { EmployeeRole } from "@/types/Employee";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGuard allowedRoles={[EmployeeRole.MANAGER]}>
      <QueryProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="">
            <HeaderBar />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </QueryProvider>
    </RoleGuard>
  );
};

export default layout;
