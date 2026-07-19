"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";

import AccountForm from "./AccountForm";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountDialog = ({ open, onOpenChange }: AccountDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-3xl text-center font-semibold">
            {UI_TEXT.ADMIN.CREATE_NEW_ACCOUNT}
          </DialogTitle>
        </DialogHeader>
        <AccountForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
