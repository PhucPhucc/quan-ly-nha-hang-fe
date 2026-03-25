import { Layers, ShoppingCart } from "lucide-react";
import React from "react";
import { shallow } from "zustand/vanilla/shallow";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { OrderType } from "@/types/enums";
import { AreaStatus } from "@/types/Table-Layout";

const SelectAreaTable = () => {
  const activeTab = useOrderBoardStore((s) => s.activeTab);
  const setActiveTab = useOrderBoardStore((s) => s.setActiveTab);

  const areas = useTableStore((s) => s.areas);

  const activeAreas = areas.filter((a) => a.status === AreaStatus.Active);

  const stats = useOrderBoardStore(
    (s) => ({
      total: s.orders.length,
      dineIn: s.orders.filter((o) => o.orderType === OrderType.DineIn).length,
      takeaway: s.orders.filter((o) => o.orderType === OrderType.Takeaway).length,
    }),
    shallow
  );

  return (
    <Select value={activeTab} onValueChange={(value) => setActiveTab(value)}>
      <SelectTrigger className="w-45 rounded-xl">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{UI_TEXT.ORDER.BOARD.DINE_IN_LABEL}</SelectLabel>
          {activeAreas.map((area) => (
            <SelectItem key={area.areaId} value={area.areaId}>
              <Layers className="size-4" />
              <span>{area.name}</span>
              {area.numberOfTables != null && (
                <Badge variant="secondary" className="ml-1 scale-90">
                  {area.numberOfTables}
                </Badge>
              )}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>{UI_TEXT.ORDER.BOARD.TAKEAWAY_LABEL}</SelectLabel>
          <SelectItem value="takeaway">
            <ShoppingCart className="size-4" />
            <span>{UI_TEXT.ORDER.BOARD.TAKEAWAY}</span>
            <Badge variant="secondary" className="ml-1 scale-90">
              {stats.takeaway}
            </Badge>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectAreaTable;
