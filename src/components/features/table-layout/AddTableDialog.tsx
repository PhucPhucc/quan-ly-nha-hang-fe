"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";

import SelectCapacityTable from "./SelectCapacityTable";

interface AddTableDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreate: (data: { capacity: number }) => Promise<void>;
}

export default function AddTableDialog({ onCreate }: AddTableDialogProps) {
  const [capacity, setCapacity] = useState(4);

  const handleSubmit = async () => {
    await onCreate({ capacity });
    setCapacity(4);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {UI_TEXT.TABLE.ADD_TABLE}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{UI_TEXT.TABLE.ADD_TABLE}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <SelectCapacityTable capacity={capacity} setCapacity={setCapacity} />
            <p className="text-xs italic text-muted-foreground">
              {UI_TEXT.TABLE.DEFAULT_SHAPE_NOTE}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{UI_TEXT.COMMON.CANCEL}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSubmit}>{UI_TEXT.COMMON.SAVE}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
