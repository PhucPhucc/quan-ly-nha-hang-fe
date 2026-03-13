"use client";

import EmployeeActionBar from "@/components/features/Employee/EmployeeActionBar";
import EmployeeDialog from "@/components/features/Employee/EmployeeDialog";
import EmployeeTable from "@/components/features/Employee/EmployeeTable";

const Page = () => {
  return (
    <div className="flex flex-col gap-6 py-4 px-4 h-full">
      {/* Action Header */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 w-full">
          <EmployeeActionBar />
        </div>
        <div className="shrink-0 w-full xl:w-auto">
          <EmployeeDialog />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <EmployeeTable />
      </div>
    </div>
  );
};

export default Page;
