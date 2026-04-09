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
import { getErrorMessage } from "@/lib/error";
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
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRole = formData.get("role");
    const confirmChange = formData.get("confirm_changes");
    const reason = formData.get("reason") as string;

    if (confirmChange !== "on" || !newRole) {
      toast.error(UI_TEXT.EMPLOYEE.CONFIRM_REQUIRED);
      return;
    }
    if (!reason) {
      toast.error(UI_TEXT.EMPLOYEE.REASON_REQUIRED);
      return;
    }

    if (newRole === role) {
      toast.error(UI_TEXT.EMPLOYEE.ROLE_MISMATCH);
      return;
    }

    if (!employeeCode) {
      toast.error(UI_TEXT.EMPLOYEE.INVALID_CODE);
      return;
    }
    try {
      await changeEmployeeRole(employeeCode, role as string, newRole as string, reason);
      toast.success(UI_TEXT.EMPLOYEE.CHANGE_SUCCESS);
      fetchEmployees();
      onToggle(false);
    } catch (error) {
      toast.error(getErrorMessage(error) || UI_TEXT.EMPLOYEE.CHANGE_FAILED);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_TITLE}</DialogTitle>
            <DialogDescription>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_DESC_FULL}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4 gap-4">
            <Field>
              <Label>{UI_TEXT.ROLE.CURRENT_ROLE}</Label>
              <Input readOnly defaultValue={role} />
            </Field>

            <EmployeeSelectRole />

            <Field>
              <FieldLabel htmlFor="reason">{UI_TEXT.EMPLOYEE.REASON}</FieldLabel>
              <FieldContent>
                <Textarea
                  id="reason"
                  name="reason"
                  required
                  placeholder={UI_TEXT.EMPLOYEE.REASON_PLACEHOLDER}
                />
              </FieldContent>
            </Field>

            <div className="bg-yellow-100 rounded-md p-4 text-yellow-800 text-sm">
              <p className="font-semibold">{UI_TEXT.EMPLOYEE.INFO_TITLE}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{UI_TEXT.EMPLOYEE.INFO_1}</li>
                <li>{UI_TEXT.EMPLOYEE.INFO_2}</li>
                <li>
                  {UI_TEXT.EMPLOYEE.INFO_3}
                  <span className="font-medium">{UI_TEXT.AUTH.EMAIL}</span>
                  {UI_TEXT.COMMON.DOT}
                </li>
              </ul>
            </div>

            <Field orientation="horizontal" className="shadow-none border-none p-0 mt-4">
              <Checkbox id="confirm_changes" name="confirm_changes" />
              <FieldContent>
                <FieldLabel htmlFor="confirm_changes">
                  {UI_TEXT.EMPLOYEE.CONFIRM_CHANGE_ROLE}
                </FieldLabel>
                <FieldDescription>{UI_TEXT.EMPLOYEE.AGREE_TERMS}</FieldDescription>
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
