"use client";

import EmployeeCount from "@/components/features/Employee/EmployeeCount";
import EmployeeDialog from "@/components/features/Employee/EmployeeDialog";
import EmployeeFilter from "@/components/features/Employee/EmployeeFilter";
import EmployeeTable from "@/components/features/Employee/EmployeeTable";

const Page = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <EmployeeCount />
        <div className="flex gap-2">
          <EmployeeDialog />

          <EmployeeFilter />
        </div>
      </div>
      <div className="mt-12">
        <EmployeeTable />
      </div>
    </div>
  );
};

export default Page;
