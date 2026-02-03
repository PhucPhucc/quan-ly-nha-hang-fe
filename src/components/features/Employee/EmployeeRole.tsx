"use client";

import { useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";

const EmployeeRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");

  const handleChangeRole = (value: string) => {
    setSelectedRole(value);

    const roleCodeMap: Record<string, string> = {
      cashier: "C",
      waiter: "W",
      chef: "B",
      manager: "M",
    };

    setEmployeeCode(roleCodeMap[value] || "");
  };

  return (
    <>
      <Field>
        <FieldLabel>{UI_TEXT.ROLE.TITLE}</FieldLabel>
        <Select value={selectedRole} onValueChange={handleChangeRole} name="role">
          <SelectTrigger>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="1">{UI_TEXT.ROLE.MANAGER}</SelectItem>
            <SelectItem value="2">{UI_TEXT.ROLE.CASHIER}</SelectItem>
            <SelectItem value="3">{UI_TEXT.ROLE.WAITER}</SelectItem>
            <SelectItem value="4">{UI_TEXT.ROLE.CHEF}</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="role" value={selectedRole} />
      </Field>

      <Field>
        <FieldLabel htmlFor="employeeCode">{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</FieldLabel>
        <Input
          id="employeeCode"
          name="employeeCode"
          placeholder={`${UI_TEXT.EMPLOYEE.EMPLOYEECODE}`}
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
        />
      </Field>
    </>
  );
};

export default EmployeeRole;
