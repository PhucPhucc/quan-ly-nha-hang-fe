"use client";

import React from "react";

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MenuItem } from "@/types/Menu";

interface SelectionDialogHeaderProps {
  menuItem: MenuItem | null;
}

export const SelectionDialogHeader: React.FC<SelectionDialogHeaderProps> = ({ menuItem }) => {
  return (
    <DialogHeader className="p-4 border-b bg-slate-50 shrink-0">
      <DialogTitle className="text-lg font-bold">{menuItem?.name}</DialogTitle>
      <DialogDescription className="text-xs">{menuItem?.description}</DialogDescription>
    </DialogHeader>
  );
};
