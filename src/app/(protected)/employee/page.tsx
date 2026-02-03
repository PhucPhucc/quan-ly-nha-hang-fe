"use client";

import EmployeeContainerTable from "@/components/features/Employee/EmployeeContainerTable";
import EmployeeCount from "@/components/features/Employee/EmployeeCount";
import EmployeeDialog from "@/components/features/Employee/EmployeeDialog";
import EmployeeFilter from "@/components/features/Employee/EmployeeFilter";

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
        <EmployeeContainerTable />
      </div>
    </div>
  );
};

export default Page;
