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
        <Button className="bg-[#cc0000] hover:bg-[#aa0000] shadow-md shadow-red-100 gap-2.5 px-6 font-semibold rounded-2xl uppercase tracking-wider text-[11px] h-11 w-full md:w-auto transition-all active:scale-95 border-none">
          <div className="flex items-center justify-center size-5 bg-white/20 rounded-lg">
            <Plus className="size-3.5 text-white" strokeWidth={2.5} />
          </div>
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
