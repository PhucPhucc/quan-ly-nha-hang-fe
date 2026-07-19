"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

import EmployeeForm from "./EmployeeForm";

const EmployeeDialog = () => {
  const [open, setOpen] = useState(false);
  const role = useAuthStore((state) => state.employee?.role);
  const isAdmin = role === EmployeeRole.ADMIN;

  return (
    <Dialog open={isAdmin && open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!isAdmin}>
          <Plus className="size-4" strokeWidth={2.5} />
          <span>{UI_TEXT.EMPLOYEE.ADD}</span>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-3xl text-center font-semibold">
            {UI_TEXT.EMPLOYEE.ADD}
          </DialogTitle>
        </DialogHeader>
        <EmployeeForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
