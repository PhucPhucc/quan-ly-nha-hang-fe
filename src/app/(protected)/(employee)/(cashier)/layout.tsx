import React from "react";

import RoleGuard from "@/components/shared/RoleGuard";
import { EmployeeRole } from "@/types/Employee";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard allowedRoles={[EmployeeRole.CASHIER]}>{children}</RoleGuard>;
};

export default layout;
