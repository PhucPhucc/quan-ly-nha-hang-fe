import { Minus, Plus } from "lucide-react";
import { ChangeEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

type SelectCapacityTableProps = {
  capacity: number;
  setCapacity: (capacity: number) => void;
  minCapacity?: number;
  maxCapacity?: number;
};

const SelectCapacityTable = ({
  capacity,
  setCapacity,
  minCapacity = 1,
  maxCapacity = 100,
}: SelectCapacityTableProps) => {
  const canDecrement = capacity > minCapacity;
  const canIncrement = maxCapacity === undefined ? true : capacity < maxCapacity;

  const handleSetCapacity = (newCapacity: number) => {
    if (Number.isNaN(newCapacity)) return;

    if (newCapacity < minCapacity) {
      setCapacity(minCapacity);
      return;
    }

    if (maxCapacity !== undefined && newCapacity > maxCapacity) {
      toast.error(UI_TEXT.TABLE.CAPACITY_LIMIT(maxCapacity));
      setCapacity(maxCapacity);
      return;
    }

    setCapacity(newCapacity);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    handleSetCapacity(value);
  };

  return (
    <>
      <label className="block text-sm font-bold text-muted-foreground">
        {UI_TEXT.TABLE.SEAT_COUNT}
      </label>
      <div className="flex items-center border-border border rounded-md">
        <Button
          variant="ghost"
          onClick={() => handleSetCapacity(capacity - 1)}
          size="icon"
          disabled={!canDecrement}
          className="border-r rounded-r-none"
        >
          <Minus />
        </Button>
        <input
          type="number"
          min={minCapacity}
          max={maxCapacity}
          value={capacity}
          onChange={handleInputChange}
          className="flex flex-1 border-none bg-transparent text-center text-lg font-bold outline-none ring-0"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleSetCapacity(capacity + 1)}
          disabled={!canIncrement}
          className="border-l rounded-l-none"
        >
          <Plus />
        </Button>
      </div>
    </>
  );
};

export default SelectCapacityTable;
