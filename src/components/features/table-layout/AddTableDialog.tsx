"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";

interface AddTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { capacity: number }) => Promise<void>;
}

export default function AddTableDialog({ open, onOpenChange, onCreate }: AddTableDialogProps) {
  const [capacity, setCapacity] = useState(4);

  const handleSubmit = async () => {
    await onCreate({ capacity });
    onOpenChange(false);
    setCapacity(4);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.TABLE.ADD_TABLE}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600">
              {UI_TEXT.TABLE.SEAT_COUNT}
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setCapacity((v) => Math.max(1, v - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-l border border-gray-300 hover:bg-gray-50"
              >
                −
              </button>
              <div className="flex h-10 flex-1 items-center justify-center border-y border-gray-300 text-lg font-bold">
                {capacity}
              </div>
              <button
                onClick={() => setCapacity((v) => v + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-r border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <p className="text-[9px] italic text-gray-400">* Bàn mặc định hình chữ nhật</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {UI_TEXT.COMMON.CANCEL}
          </Button>
          <Button onClick={handleSubmit}>{UI_TEXT.COMMON.SAVE}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
