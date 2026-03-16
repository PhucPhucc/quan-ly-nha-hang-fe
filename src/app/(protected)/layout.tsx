import React from "react";

import AuthGuard from "@/components/shared/AuthGuard";
import { ThemeProvider } from "@/store/ThemeContext";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ThemeProvider>
      <AuthGuard>{children}</AuthGuard>
    </ThemeProvider>
  );
};

export default layout;
