import { Filter } from "lucide-react";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { filterEmployee, getEmployees } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";

const EmployeeFilter = () => {
  const setEmployees = useEmployeeStore((state) => state.setEmployees);

  const handleSelectedRole = async (value: string) => {
    if (value === "all") {
      const res = await getEmployees();
      if (res.data) {
        setEmployees(res.data.items || []);
      }
      return;
    }
    const res = await filterEmployee(Number(value));
    if (res.data) {
      setEmployees(res.data.items || []);
    }
  };

  return (
    <Select onValueChange={handleSelectedRole}>
      <SelectTrigger className="flex w-auto items-center gap-2 px-2 md:w-26">
        <Filter className="md:hidden h-4 w-4" />

        <span className="hidden md:inline">
          <SelectValue placeholder={UI_TEXT.COMMON.FILTER} />
        </span>
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectItem value="all">{UI_TEXT.COMMON.ALL}</SelectItem>
        <SelectItem value="1">{UI_TEXT.ROLE.MANAGER}</SelectItem>

        <SelectItem value="2">{UI_TEXT.ROLE.CASHIER}</SelectItem>

        <SelectItem value="3">{UI_TEXT.ROLE.WAITER}</SelectItem>
        <SelectItem value="4">{UI_TEXT.ROLE.CHEF}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default EmployeeFilter;
