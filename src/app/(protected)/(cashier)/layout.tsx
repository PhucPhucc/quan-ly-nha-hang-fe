import React from "react";

import RoleGuard from "@/components/shared/RoleGuard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard allowedRoles={["Cashier"]}>{children}</RoleGuard>;
};

export default layout;
