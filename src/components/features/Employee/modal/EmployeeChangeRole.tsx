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
import { ROLEMAP } from "@/types/Employee";

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
      toast.error("Vui lòng xác nhận thay đổi vai trò");
      return;
    }

    if (!reason) {
      toast.error("Vui lòng nhập lý do thay đổi vai trò");
      return;
    }

    if (Number(newRole) === ROLEMAP[role as keyof typeof ROLEMAP]) {
      toast.error("Vai trò mới phải khác vai trò hiện tại");
      return;
    }

    if (!employeeCode) {
      toast.error("Mã nhân viên không hợp lệ hoac không tồn tại");
      return;
    }
    try {
      const data = await changeEmployeeRole(
        employeeCode,
        ROLEMAP[role as keyof typeof ROLEMAP],
        Number(newRole),
        reason
      );
      toast.success("Thay đổi vai trò thành công");
      increment();
      onToggle(false);
    } catch (error) {
      toast.error("Thay đổi vai trò thất bại");
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Viec thay doi role cua nhan vien se cap cho nhan vien mot tai khoan moi va tai khoan
              cu se bi vo hieu hoa.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4 gap-4">
            <Field>
              <Label>{UI_TEXT.ROLE.CURRENT_ROLE}</Label>
              <Input readOnly defaultValue={role} />
            </Field>

            <EmployeeSelectRole />

            <Field>
              <Label htmlFor="reason">Lý do thay đổi</Label>
              <Textarea
                id="reason"
                name="reason"
                required
                placeholder="Nhập lý do thăng chức, chuyển bộ phận..."
              />
            </Field>

            <Field orientation="horizontal" className="gap-2">
              <Checkbox id="confirm_change" name="confirm_change" />
              <FieldContent>
                <FieldLabel htmlFor="confirm_change">Xác nhận thay đổi vai trò</FieldLabel>
                <FieldDescription>
                  Bằng cách nhấp vào hộp kiểm này, tai khoản cũ sẽ bị vô hiệu hóa.
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
