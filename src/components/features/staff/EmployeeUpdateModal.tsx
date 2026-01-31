import { Lock, Unlock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UI_TEXT } from "@/lib/UI_Text";
import { Employee } from "@/types/Employee";

import EmployeeUpdateForm from "./EmployeeUpdateForm";
const EmployeeUpdateModal = ({
  open,
  employee,
  onToggle,
}: {
  open: boolean;
  employee?: Employee | null;
  onToggle: (v: boolean) => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={onToggle}>
      <SheetContent className="rounded-l-xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle className=" text-3xl flex items-center gap-2 ">
            {UI_TEXT.EMPLOYEE.EDIT}
            <span>{employee?.status === "active" ? <Lock /> : <Unlock />}</span>
          </SheetTitle>
          <SheetDescription>{UI_TEXT.EMPLOYEE.INFO}</SheetDescription>
        </SheetHeader>
        {/* form edit employee  */}
        <EmployeeUpdateForm employee={employee} />

        <SheetFooter>
          <Button type="submit">{UI_TEXT.COMMON.SAVE}</Button>
          <SheetClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeUpdateModal;
