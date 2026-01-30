"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";
import { UI_TEXT } from "@/lib/UI_Text";
import { Plus } from "lucide-react";

const EmployeeDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <span className='hidden sm:inline'>{UI_TEXT.EMPLOYEE.ADD}</span>
          <span className='sm:hidden'>
            <Plus />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-3xl text-center font-semibold mb-6'>
            {UI_TEXT.EMPLOYEE.ADD}
          </DialogTitle>
        </DialogHeader>
        <EmployeeForm />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
