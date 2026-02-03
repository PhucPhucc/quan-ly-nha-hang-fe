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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditLogContainer from "../AuditLog/AuditLogContainer";

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
      <SheetContent
        className="rounded-l-xl flex flex-col sm:max-w-[600px] w-full"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className=" text-3xl flex items-center gap-2 ">
            {UI_TEXT.EMPLOYEE.EDIT}
            <span>{employee?.status === "active" ? <Lock /> : <Unlock />}</span>
          </SheetTitle>
          <SheetDescription>{UI_TEXT.EMPLOYEE.INFO}</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="info" className="flex-1 flex flex-col mt-4 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="history">Lịch sử hoạt động</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex-1 overflow-y-auto pt-4 pb-12">
            {/* form edit employee  */}
            <EmployeeUpdateForm employee={employee} />

            <div className="mt-8 flex gap-2">
              <Button type="submit" className="flex-1">
                {UI_TEXT.COMMON.SAVE}
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </SheetClose>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-hidden flex flex-col">
            <AuditLogContainer employeeId={employee?.employeeId} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeUpdateModal;
