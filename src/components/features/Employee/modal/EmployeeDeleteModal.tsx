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
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { UI_TEXT } from "@/lib/UI_Text";
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
  const increment = useEmployeeStore((state) => state.increment);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const reason = formData.get("confirm_delete") === "on";

    if (!reason) {
      toast.error(UI_TEXT.EMPLOYEE.DELETE_CONFIRM_FAIL);
      return;
    }

    try {
      await deleteEmployee(employeeId);
      increment();
      toast.success(UI_TEXT.EMPLOYEE.DELETE_SUCCESS);
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
            <DialogTitle>{UI_TEXT.EMPLOYEE.DELETE_TITLE}</DialogTitle>
            <DialogDescription>{UI_TEXT.EMPLOYEE.DELETE_DESCRIPTION}</DialogDescription>
          </DialogHeader>
          <Field orientation="horizontal" className="mt-4 gap-3">
            <Checkbox id="confirm_delete" name="confirm_delete" />
            <FieldContent>
              <FieldLabel htmlFor="confirm_delete">{UI_TEXT.EMPLOYEE.DELETE_CONFIRM}</FieldLabel>
              <FieldDescription>{UI_TEXT.EMPLOYEE.DELETE_RULE}</FieldDescription>
            </FieldContent>
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
