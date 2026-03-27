"use client";

import EmployeeActionBar from "@/components/features/Employee/EmployeeActionBar";
import EmployeeDialog from "@/components/features/Employee/EmployeeDialog";
import EmployeeTable from "@/components/features/Employee/EmployeeTable";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
  return (
    <div className="px-4 space-y-6 py-4 animate-in fade-in duration-500">
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden py-4">
        <CardContent className="flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <EmployeeActionBar />
          </div>
          <div className="shrink-0 w-full xl:w-auto">
            <EmployeeDialog />
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 min-h-0 overflow-hidden">
        <EmployeeTable />
      </div>
    </div>
  );
};

export default Page;
