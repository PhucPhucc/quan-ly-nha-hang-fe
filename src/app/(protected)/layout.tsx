import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import AuthGuard from "@/components/shared/AuthGuard";
import HeaderBar from "@/components/shared/HeaderBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import QueryProvider from "@/providers/QueryProvider";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <AuthGuard>
      <QueryProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="">
            <HeaderBar />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </QueryProvider>
    </AuthGuard>
  );
};

export default layout;
