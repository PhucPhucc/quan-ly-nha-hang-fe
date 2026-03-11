import React from "react";

import NavEmployee from "@/components/shared/NavEmployee";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <NavEmployee />
      {children}
    </div>
  );
};

export default layout;
