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

import EmployeeForm from "./EmployeeForm";

const EmployeeDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span className="hidden sm:inline">{UI_TEXT.EMPLOYEE.ADD}</span>
          <span className="sm:hidden">
            <Plus />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-semibold mb-6">
            {UI_TEXT.EMPLOYEE.ADD}
          </DialogTitle>
        </DialogHeader>
        <EmployeeForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
