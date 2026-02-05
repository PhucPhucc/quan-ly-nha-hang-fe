import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { Employee } from "@/types/Employee";

import AuditLogContainer from "../../AuditLog/AuditLogContainer";
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
      <SheetContent
        className="rounded-l-xl flex flex-col sm:max-w-150 w-full p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-0 mt-2 text-center">
          <SheetTitle className=" text-3xl flex items-center gap-2 justify-center">
            {UI_TEXT.EMPLOYEE.EDIT}
          </SheetTitle>
          <SheetDescription>{UI_TEXT.EMPLOYEE.INFO}</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="info" className="flex-1 flex flex-col mt-4 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">{UI_TEXT.EMPLOYEE.INFO}</TabsTrigger>
            <TabsTrigger value="history">{UI_TEXT.AUDIT_LOG.TITLE}</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex-1 overflow-y-auto pt-4 pb-12">
            {/* form edit employee  */}
            <EmployeeUpdateForm employee={employee} />
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
