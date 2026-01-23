import { AppSidebar } from "@/components/app-sidebar";
import HeaderBar from "@/components/shared/HeaderBar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <HeaderBar />
        <div className='flex flex-1 flex-col gap-4 m-4 pt-0'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
