import React from "react";

import HeaderBar from "@/components/shared/HeaderBar";
import RoleGuard from "@/components/shared/RoleGuard";
import { EmployeeRole } from "@/types/Employee";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGuard allowedRoles={[EmployeeRole.MANAGER]}>
      <div className="flex flex-col overflow-hidden">
        <HeaderBar />
        <main className="min-h-0 flex-1 overflow-auto pb-3">{children}</main>
      </div>
    </RoleGuard>
  );
};

export default layout;
