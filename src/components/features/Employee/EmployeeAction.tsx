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
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <List className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-2xl p-1.5 shadow-2xl border-slate-100"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuItem
            onClick={() => handleEdit("edit")}
            className="rounded-xl p-2.5 gap-3 cursor-pointer focus:bg-slate-50"
          >
            <div className="bg-blue-50 p-2 rounded-lg">
              <UserPen className="size-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{UI_TEXT.EMPLOYEE.EDIT}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                Cập nhật hồ sơ
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e) => {
              e.currentTarget.blur();
              handleEdit("changeRole");
            }}
            className="rounded-xl p-2.5 gap-3 cursor-pointer focus:bg-slate-50"
          >
            <div className="bg-amber-50 p-2 rounded-lg">
              <Skull className="size-4 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{UI_TEXT.EMPLOYEE.CHANGE_ROLE}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                Gán quyền hạn mới
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleEdit("changePassword")}
            className="rounded-xl p-2.5 gap-3 cursor-pointer focus:bg-slate-50"
          >
            <div className="bg-emerald-50 p-2 rounded-lg">
              <LockKeyhole className="size-4 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{UI_TEXT.EMPLOYEE.CHANGE_PASSWORD}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                Bảo mật tài khoản
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5 mx-2" />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleEdit("delete")}
            className="rounded-xl p-2.5 gap-3 cursor-pointer focus:bg-rose-50"
          >
            <div className="bg-rose-50 p-2 rounded-lg">
              <Trash2 className="size-4 text-rose-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{UI_TEXT.EMPLOYEE.DELETE}</span>
              <span className="text-[10px] text-rose-400 uppercase tracking-tight">
                Gỡ khỏi hệ thống
              </span>
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
