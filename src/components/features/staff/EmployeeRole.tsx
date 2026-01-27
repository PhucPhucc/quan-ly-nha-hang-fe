import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const EmployeeRole = () => {
  return (
    <>
      <Field>
        <FieldLabel>Role of Staff</FieldLabel>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Role' />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectItem value='manager'>Manager</SelectItem>
            <SelectItem value='cashier'>Cashier</SelectItem>
            <SelectItem value='waiter'>Waiter</SelectItem>
            <SelectItem value='chef'>Chef</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor='employeeCode'>EmployeeCode</FieldLabel>
        <Input
          id='employeeCode'
          name='employeeCode'
          placeholder='Enter EmployeeCode'
        />
      </Field>
    </>
  );
};

export default EmployeeRole;
