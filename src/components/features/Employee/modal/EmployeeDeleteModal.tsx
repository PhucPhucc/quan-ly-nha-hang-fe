import { Trash2 } from "lucide-react"; // Added Trash2 import
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
import { Field } from "@/components/ui/field"; // Removed FieldContent, FieldDescription, FieldLabel as they are not used
import { UI_TEXT } from "@/lib/UI_Text"; // Removed duplicate import
import { deleteEmployee } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";

const EmployeeDeleteModal = ({
  open,
  employeeId,
  onToggle,
}: {
  open: boolean;
  employeeId: string;
  onToggle: (v: boolean) => void;
}) => {
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const reason = formData.get("confirm_delete") === "on";

    if (!reason) {
      toast.error("Vui lòng xác nhận xóa nhân viên.");
      return;
    }

    try {
      await deleteEmployee(employeeId);
      fetchEmployees();
      toast.success(UI_TEXT.EMPLOYEE.DELETE_SUSCESS);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
    }
  };

  return (
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-red-500" />
              {UI_TEXT.EMPLOYEE.DELETE_EMPLOYEE}
            </DialogTitle>
            <DialogDescription>{UI_TEXT.EMPLOYEE.DELETE_CONFIRM}</DialogDescription>
          </DialogHeader>
          <Field orientation="horizontal" className="mt-4 gap-3">
            <Checkbox id="confirm_delete" name="confirm_delete" />
            <div className="space-y-1">
              <span className="text-sm font-semibold">{UI_TEXT.EMPLOYEE.CONFIRM_DELETE}</span>
              <p className="text-xs text-muted-foreground">
                {UI_TEXT.EMPLOYEE.CONFIRM_DELETE_DESC ||
                  "Bang việc xóa nhân viên, họ sẽ mất quyền truy cập vào hệ thống."}
              </p>
            </div>
          </Field>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="reset" variant="outline">
                {UI_TEXT.BUTTON.CLOSE}
              </Button>
            </DialogClose>
            <Button type="submit">{UI_TEXT.BUTTON.DELETE}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDeleteModal;
