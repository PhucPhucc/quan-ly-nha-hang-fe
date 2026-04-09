"use client";

import { List, LockKeyhole, ShieldCheck, Trash2, UserPen } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UI_TEXT } from "@/lib/UI_Text";
import { Employee } from "@/types/Employee";

import EmployeeChangePassword from "./modal/EmployeeChangePassWord";
import EmployeeChangeRole from "./modal/EmployeeChangeRole";
import EmployeeDeleteModal from "./modal/EmployeeDeleteModal";
import EmployeeUpdateModal from "./modal/EmployeeUpdateModal";

type EmployeeActionState = {
  isEditOpen: boolean;
  modal: "edit" | "changeRole" | "changePassword" | "delete" | null;
};

export default function EmployeeAction({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState<EmployeeActionState>({
    isEditOpen: false,
    modal: null,
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const handleEdit = (newModal: EmployeeActionState["modal"]) => {
    setSelectedEmployee(employee);
    setOpen((prev) => ({
      isEditOpen: prev.isEditOpen ? false : true,
      modal: newModal,
    }));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <List className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 shadow-2xl text-foreground" align="end" sideOffset={8}>
          <DropdownMenuItem onClick={() => handleEdit("edit")}>
            <UserPen className="size-4 " />
            <div className="flex flex-col">
              <span>{UI_TEXT.EMPLOYEE.UPDATE_PROFILE}</span>
              <span className="text-xs">{UI_TEXT.EMPLOYEE.UPDATE_INFO}</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e) => {
              e.currentTarget.blur();
              handleEdit("changeRole");
            }}
          >
            <ShieldCheck className="size-4 " />
            <div className="flex flex-col">
              <span>{UI_TEXT.EMPLOYEE.CHANGE_ROLE}</span>
              <span className="text-xs">{UI_TEXT.EMPLOYEE.CHANGE_ROLE_DESC}</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleEdit("changePassword")}>
            <LockKeyhole className="size-4 " />
            <div className="flex flex-col">
              <span className="text-sm">{UI_TEXT.EMPLOYEE.CHANGE_PASSWORD}</span>
              <span className="text-xs">{UI_TEXT.EMPLOYEE.ACCOUNT_SECURITY}</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5 mx-2" />

          <DropdownMenuItem onClick={() => handleEdit("delete")}>
            <Trash2 className="size-4" />
            <div className="flex flex-col">
              <span className=" text-sm">{UI_TEXT.EMPLOYEE.DELETE}</span>
              <span className="text-xs ">{UI_TEXT.EMPLOYEE.REMOVE_FROM_SYSTEM}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmployeeUpdateModal
        open={open.isEditOpen && open.modal === "edit"}
        onToggle={() => handleEdit(null)}
        employee={selectedEmployee}
      />

      <EmployeeChangeRole
        open={open.isEditOpen && open.modal === "changeRole"}
        onToggle={() => handleEdit(null)}
        employeeCode={selectedEmployee?.employeeCode}
        role={selectedEmployee?.role.toString().toLowerCase()}
      />

      <EmployeeChangePassword
        open={open.isEditOpen && open.modal === "changePassword"}
        onToggle={() => handleEdit(null)}
        employeeId={selectedEmployee?.employeeId || ""}
      />

      <EmployeeDeleteModal
        open={open.isEditOpen && open.modal === "delete"}
        onToggle={() => handleEdit(null)}
        employeeId={selectedEmployee?.employeeId || ""}
      />
    </>
  );
}
