import DatePicker from "@/components/shared/DOBPicker";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UI_TEXT } from "@/lib/UI_Text";
import { Employee } from "@/types/Employee";

import SwitchActive from "./SwitchActive";

const EmployeeUpdateForm = ({ employee }: { employee?: Employee | null }) => {
  return (
    <FieldGroup className="px-4 grid grid-cols-2 gap-x-2 gap-y-4">
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

      <DatePicker />

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

      <SwitchActive active={employee?.status} />

      <Field className="col-span-2">
        <Label htmlFor="address">{UI_TEXT.EMPLOYEE.ADDRESS}</Label>
        <Input id="address" name="address" defaultValue={employee?.address || ""} />
      </Field>
    </FieldGroup>
  );
};

export default EmployeeUpdateForm;
