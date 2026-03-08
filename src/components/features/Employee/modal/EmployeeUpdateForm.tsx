import { useState } from "react";
import { toast } from "sonner";

import DatePicker from "@/components/shared/DOBPicker";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetClose } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { updateEmployee } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { Employee } from "@/types/Employee";

import SwitchActive from "./SwitchActive";

const EmployeeUpdateForm = ({ employee }: { employee?: Employee | null }) => {
  const incrementRefreshCount = useEmployeeStore((state) => state.increment);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const status = formData.get("status") as string;
    const role = formData.get("role") as string;
    const address = formData.get("address") as string;

    const employeeUpdate = {
      employeeId: employee?.employeeId,
      fullName,
      email,
      phone,
      dateOfBirth,
      status,
      address,
      role: role,
    };
    try {
      await updateEmployee(employeeUpdate);
      toast.success(UI_TEXT.EMPLOYEE.UPDATE_SUSCESS);
    } catch (err) {
      setLoading(false);
      toast.error("Update employee failed. " + (err as Error).message);
      return;
    }
    setLoading(false);
    incrementRefreshCount();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="grid grid-cols-2 gap-x-2 gap-y-4 px-0.5">
        <Field>
          <Label>{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</Label>
          <Input
            disabled
            defaultValue={employee?.employeeCode || ""}
            className="cursor-not-allowed"
          />
        </Field>

        <Field>
          <Label htmlFor="fullName">{UI_TEXT.EMPLOYEE.FULLNAME}</Label>
          <Input id="fullName" name="fullName" defaultValue={employee?.fullName || ""} />
        </Field>

        <Field>
          <Label>{UI_TEXT.EMPLOYEE.EMAIL}</Label>
          <Input name="email" defaultValue={employee?.email || ""} />
        </Field>

        <Field>
          <Label htmlFor="phone">{UI_TEXT.EMPLOYEE.PHONE}</Label>
          <Input id="phone" name="phone" defaultValue={employee?.phone || ""} />
        </Field>

        <DatePicker dob={employee?.dateOfBirth} />

        <Field>
          <Label>{UI_TEXT.EMPLOYEE.ROLE}</Label>
          <Input disabled defaultValue={employee?.role || ""} />
        </Field>

        <Field>
          <Label>{UI_TEXT.COMMON.CREATE_AT}</Label>
          <Input disabled defaultValue={employee?.createdAt || ""} />
        </Field>

        <Field>
          <Label>{UI_TEXT.COMMON.UPDATE_AT}</Label>
          <Input disabled defaultValue={employee?.updatedAt || ""} />
        </Field>

        <SwitchActive status={employee?.status} />

        <Field className="col-span-2">
          <Label htmlFor="address">{UI_TEXT.EMPLOYEE.ADDRESS}</Label>
          <Textarea
            id="address"
            name="address"
            placeholder={UI_TEXT.EMPLOYEE.ADDRESS}
            defaultValue={employee?.address || ""}
          />
        </Field>

        <Field orientation="horizontal" className="flex gap-4 mt-2 col-span-2">
          <Button type="submit" className="flex-1/2" disabled={loading}>
            {UI_TEXT.COMMON.SAVE}
            {loading && <Spinner />}
          </Button>
          <SheetClose asChild className="flex-1/2">
            <Button type="button" variant="outline">
              {UI_TEXT.COMMON.CANCEL_EN}
            </Button>
          </SheetClose>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EmployeeUpdateForm;
