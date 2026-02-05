"use client";

import { List, LockKeyhole, Skull, Trash2, UserPen } from "lucide-react";
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
          <Button size="icon" variant="ghost" className="hover:bg-secondary-foreground/20">
            <List />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4">
          <DropdownMenuItem onClick={() => handleEdit("edit")}>
            <UserPen />
            {UI_TEXT.EMPLOYEE.EDIT}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e) => {
              e.currentTarget.blur();
              handleEdit("changeRole");
            }}
          >
            <Skull />
            {UI_TEXT.EMPLOYEE.CHANGE_ROLE}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleEdit("changePassword")}>
            <LockKeyhole />
            {UI_TEXT.EMPLOYEE.CHANGE_PASSWORD}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={() => handleEdit("delete")}>
            <Trash2 />
            {UI_TEXT.EMPLOYEE.DELETE}
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
