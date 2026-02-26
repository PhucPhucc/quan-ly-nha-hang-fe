import React from "react";

import AuthGuard from "@/components/shared/AuthGuard";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default layout;
