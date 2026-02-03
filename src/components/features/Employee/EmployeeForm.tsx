"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { addEmployee } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { Employee } from "@/types/Employee";

import EmployeeRole from "./EmployeeRole";

const EmployeeForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const incrementRefreshCount = useEmployeeStore((state) => state.increment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const employeeCode = formData.get("employeeCode") as string;

    const employee: Partial<Employee> = {
      employeeCode,
      fullName,
      email,
      role: Number(role),
    };

    try {
      setError("");
      await addEmployee(employee);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return;
    }
    setLoading(false);
    incrementRefreshCount();
    onSuccess();
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
      <div className="text-center bg-primary/30 text-primary font-bold">{error}</div>
      <div className="flex gap-4 justify-end mt-4">
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="hover:bg-secondary-foreground/20">
            {UI_TEXT.BUTTON.CLOSE}
          </Button>
        </DialogClose>

        <Button type="submit" disabled={loading}>
          {UI_TEXT.BUTTON.SUBMIT} {loading && <Spinner />}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
