import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { changeEmployeePassword } from "@/services/employeeService";

import SwitchChangePassword from "./SwitchChangePassword";

const EmployeeChangePassword = ({
  open,
  employeeId,
  onToggle,
}: {
  open: boolean;
  employeeId: string;
  onToggle: (v: boolean) => void;
}) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const reason = formData.get("reason") as string;
    const newPassword = formData.get("password") as string;

    if (!employeeId) {
      toast.error("Ma nhan vien khong hop le");
      return;
    }

    if (!reason) {
      toast.error("Vui long dien ly do thay doi mat khau");
      return;
    }
    console.log(employeeId);
    try {
      await changeEmployeePassword(employeeId, reason, newPassword);
      toast.success("Thay doi mat khau thanh cong");
      onToggle(false);
    } catch {
      toast.error("Thay doi mat khau that bai");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.EMPLOYEE.CHANGE_PASSWORD}</DialogTitle>
            <DialogDescription>{UI_TEXT.EMPLOYEE.CHANGE_PASSWORD_DESC}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4 gap-4">
            <Field>
              <Label htmlFor="reason">{UI_TEXT.EMPLOYEE.CHANGE_PASSWORD_REASON}</Label>
              <Textarea id="reason" name="reason" />
            </Field>
            <SwitchChangePassword />
          </FieldGroup>
          <DialogFooter className="mt-4">
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

export default EmployeeChangePassword;
