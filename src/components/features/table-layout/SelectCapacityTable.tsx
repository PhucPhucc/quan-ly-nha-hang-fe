import { Minus, Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

type SelectCapacityTableProps = {
  capacity: number;
  setCapacity: (capacity: number) => void;
};

const SelectCapacityTable = ({ capacity, setCapacity }: SelectCapacityTableProps) => {
  const handleCapacityChange = (newCapacity: number) => {
    if (newCapacity < 1 || newCapacity > 6) {
      toast.error(UI_TEXT.TABLE.CAPACITY_LIMIT);
      return;
    }
    setCapacity(newCapacity);
  };

  return (
    <>
      <label className="block text-sm font-bold text-muted-foreground">
        {UI_TEXT.TABLE.SEAT_COUNT}
      </label>
      <div className="flex items-center border-border border rounded-md">
        <Button
          variant="ghost"
          onClick={() => handleCapacityChange(capacity - 1)}
          size="icon"
          className="border-r rounded-r-none"
        >
          <Minus />
        </Button>
        <div className="flex flex-1 items-center justify-center text-lg font-bold">{capacity}</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCapacityChange(capacity + 1)}
          className="border-l rounded-l-none"
        >
          <Plus />
        </Button>
      </div>
    </>
  );
};

export default SelectCapacityTable;
