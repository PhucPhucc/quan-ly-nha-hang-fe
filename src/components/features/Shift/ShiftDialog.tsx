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
            <Button>
              <Plus className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
              <span>{UI_TEXT.SHIFT.ADD_SHIFT}</span>
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[550px] p-0 overflow-hidden border rounded-2xl shadow-2xl bg-background">
        <div className="px-6 py-6 border-b bg-background">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Clock className="size-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {shift ? UI_TEXT.SHIFT.EDIT_SHIFT : UI_TEXT.SHIFT.ADD_NEW}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {shift ? UI_TEXT.SHIFT.EDIT_DESC : UI_TEXT.SHIFT.ADD_DESC}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <ShiftForm initialData={shift} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftDialog;
