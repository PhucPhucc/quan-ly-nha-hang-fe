import React from "react";

import NavEmployee from "@/components/shared/NavEmployee";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/store/ThemeContext";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <div className="relative">
          <NavEmployee />
          {children}
        </div>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default layout;
