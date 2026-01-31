"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { addEmployee } from "@/services/employeeService";
import { Employee } from "@/types/Employee";

import EmployeeRole from "./EmployeeRole";

const EmployeeForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const employeeCode = formData.get("employeeCode") as string;

    const employee: Partial<Employee> = {
      employeeCode,
      fullName,
      email,
      role,
    };

    console.log(employee);
    addEmployee(employee);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="grid grid-cols-1 gap-4">
        <Field>
          <FieldLabel htmlFor="fullName">{UI_TEXT.EMPLOYEE.FULLNAME}</FieldLabel>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder={`Enter ${UI_TEXT.EMPLOYEE.FULLNAME}`}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">{UI_TEXT.EMPLOYEE.EMAIL}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={`Enter ${UI_TEXT.EMPLOYEE.EMAIL}`}
          />
        </Field>

        <EmployeeRole />
      </FieldGroup>

      <div className="flex gap-4 justify-end mt-4">
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="hover:bg-secondary-foreground/20">
            {UI_TEXT.BUTTON.CLOSE}
          </Button>
        </DialogClose>

        <Button type="submit">{UI_TEXT.BUTTON.SUBMIT}</Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
