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
import { AreaType } from "@/types/Table-Layout";

import SelectCapacityTable from "./SelectCapacityTable";

interface AddTableDialogProps {
  onCreate: (data: { capacity: number }) => Promise<void>;
  areaType: AreaType;
  existingTableCount: number;
}

export default function AddTableDialog({
  onCreate,
  areaType,
  existingTableCount,
}: AddTableDialogProps) {
  const isVipArea = areaType === AreaType.VIP;
  const [capacity, setCapacity] = useState(isVipArea ? 9 : 2);
  const isVipLimitReached = isVipArea && existingTableCount >= 1;
  const minCapacity = 1;
  const maxCapacity = isVipArea ? undefined : 6;

  const handleSubmit = async () => {
    await onCreate({ capacity });
    setCapacity(6);
  };

  return (
    <div className="relative flex flex-col items-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={isVipLimitReached} className="h-9">
            <Plus className="size-4" />
            {UI_TEXT.TABLE.ADD_TABLE}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{UI_TEXT.TABLE.ADD_TABLE}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <SelectCapacityTable
                capacity={capacity}
                setCapacity={setCapacity}
                minCapacity={minCapacity}
                maxCapacity={maxCapacity}
              />
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
      {isVipLimitReached && (
        <p className="absolute top-full right-0 mt-1 whitespace-nowrap text-[10px] font-medium text-amber-600">
          {UI_TEXT.TABLE.VIP_SINGLE_TABLE_NOTICE}
        </p>
      )}
    </div>
  );
}
