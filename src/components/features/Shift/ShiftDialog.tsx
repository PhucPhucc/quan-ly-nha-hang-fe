"use client";

import { Clock, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";
import { Shift } from "@/types/Shift";

import ShiftForm from "./ShiftForm";

interface ShiftDialogProps {
  shift?: Shift;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ShiftDialog = ({
  shift,
  trigger,
  onSuccess,
  open: externalOpen,
  onOpenChange: setExternalOpen,
}: ShiftDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const handleOpenChange = (val: boolean) => {
    if (isControlled && setExternalOpen) {
      setExternalOpen(val);
    } else {
      setInternalOpen(val);
    }
  };

  const handleSuccess = () => {
    handleOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger !== null && !isControlled && (
        <DialogTrigger asChild>
          {trigger || (
            <Button className="bg-[#cc0000] hover:bg-[#aa0000] shadow-md shadow-red-100 gap-2.5 px-6 font-semibold uppercase tracking-wider text-[11px] h-11 w-full md:w-auto transition-all active:scale-95 border-none">
              <div className="flex items-center justify-center size-5 bg-white/20 rounded-lg">
                <Plus className="size-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span>{UI_TEXT.SHIFT.ADD_SHIFT}</span>
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[550px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="bg-slate-50/50 px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-50 rounded-2xl">
              <Clock className="size-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {shift ? UI_TEXT.SHIFT.EDIT_SHIFT : UI_TEXT.SHIFT.ADD_NEW}
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                {shift ? UI_TEXT.SHIFT.EDIT_DESC : UI_TEXT.SHIFT.ADD_DESC}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-2">
          <ShiftForm initialData={shift} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftDialog;
