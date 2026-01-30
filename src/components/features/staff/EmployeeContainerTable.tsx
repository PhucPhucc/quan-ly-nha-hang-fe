"use client";

import { useState } from "react";
import EmployeeTable from "./EmployeeTable";
import { Employee } from "@/types/Employee";
import EmployeeUpdateModal from "./EmployeeUpdateModal";

const EmployeeContainerTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  return (
    <>
      <EmployeeTable onEdit={handleEdit} />
      <EmployeeUpdateModal
        open={open}
        onToggle={setOpen}
        employee={selectedEmployee}
      />
    </>
  );
};

export default EmployeeContainerTable;
