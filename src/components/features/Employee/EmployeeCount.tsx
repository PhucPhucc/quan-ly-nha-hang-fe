import { Users } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { useEmployeeStore } from "@/store/useEmployeeStore";

const EmployeeCount = () => {
  const count = useEmployeeStore((state) => state.employees.length);

  const title = `${UI_TEXT.EMPLOYEE.TITLE} (${count})`;
  return (
    <div className="flex items-center space-x-2">
      <Users className="h-5 w-5 text-muted-foreground" />
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
};
export default EmployeeCount;
