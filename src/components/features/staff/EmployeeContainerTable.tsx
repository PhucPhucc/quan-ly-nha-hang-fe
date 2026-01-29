"use client";

import { useState } from "react";
import EmployeeTable from "./EmployeeTable";
import EmployeeUpdate from "./EmployeeUpdate";
import { Employee } from "@/types/Employee";

const EmployeeContainerTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const handleEdit = (employee:Employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  return (
    <>
      <EmployeeTable onEdit={handleEdit} />
      <EmployeeUpdate
        open={open}
        onToggle={setOpen}
        employee={selectedEmployee}
      />
    </>
  );
};

export default EmployeeContainerTable;
