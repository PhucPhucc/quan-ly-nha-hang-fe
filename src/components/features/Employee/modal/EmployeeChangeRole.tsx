import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { changeEmployeeRole } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";

import EmployeeSelectRole from "../EmployeeSelectRole";
const EmployeeChangeRole = ({
  open,
  role,
  employeeCode,
  onToggle,
}: {
  open: boolean;
  role: string | number | undefined;
  employeeCode: string | undefined;
  onToggle: (v: boolean) => void;
}) => {
  const increment = useEmployeeStore((state) => state.increment);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRole = formData.get("role");
    const confirmChange = formData.get("confirm_change");
    const reason = formData.get("reason") as string;

    if (confirmChange !== "on" || !newRole) {
      toast.error(UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.ERROR_CONFIRM_REQUIRED);
      return;
    }
    if (!reason) {
      toast.error(UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.ERROR_REASON_REQUIRED);
      return;
    }

    if (newRole === role) {
      toast.error(UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.ERROR_ROLE_NOT_CHANGED);
      return;
    }

    if (!employeeCode) {
      toast.error(UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.ERROR_INVALID_EMPLOYEE_CODE);
      return;
    }
    try {
      const data = await changeEmployeeRole(
        employeeCode,
        role as string,
        newRole as string,
        reason
      );
      toast.success(UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.SUCCESS);
      increment();
      onToggle(false);
    } catch (error) {
      toast.error(UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.ERROR);
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.TITLE}</DialogTitle>
            <DialogDescription>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.DESCRIPTION}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4 gap-4">
            <Field>
              <Label>{UI_TEXT.ROLE.CURRENT_ROLE}</Label>
              <Input readOnly defaultValue={role} />
            </Field>

            <EmployeeSelectRole />

            <Field>
              <Label htmlFor="reason">{UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.REASON_LABEL}</Label>
              <Textarea
                id="reason"
                name="reason"
                required
                placeholder={UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.REASON_PLACEHOLDER}
              />
            </Field>

            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs text-blue-700">
              <p className="font-medium mb-1">{UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.INFO_TITLE}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.INFO_ITEM_1}</li>
                <li>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.INFO_ITEM_2}</li>
                <li>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.INFO_ITEM_3}</li>
              </ul>
            </div>

            <Field orientation="horizontal" className="gap-2">
              <Checkbox id="confirm_change" name="confirm_change" />
              <FieldContent>
                <FieldLabel htmlFor="confirm_change">
                  {UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.CONFIRM_CHECKBOX_LABEL}
                </FieldLabel>
                <FieldDescription>
                  {UI_TEXT.EMPLOYEE.CHANGE_ROLE_MODAL.CONFIRM_CHECKBOX_DESCRIPTION}
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="reset" variant="outline">
                {UI_TEXT.BUTTON.CLOSE}
              </Button>
            </DialogClose>
            <Button type="submit">{UI_TEXT.BUTTON.SAVE_CHANGES}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeChangeRole;
