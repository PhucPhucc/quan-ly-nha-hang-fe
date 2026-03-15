import React from "react";

import NavEmployee from "@/components/shared/NavEmployee";
import QueryProvider from "@/providers/QueryProvider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <div className="relative">
        <NavEmployee />
        {children}
      </div>
    </QueryProvider>
  );
};

export default layout;
