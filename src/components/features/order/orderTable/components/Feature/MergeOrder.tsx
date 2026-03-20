import React from "react";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { OrderType } from "@/types/enums";

import { Table } from "../../TableItem";

const MergeOrder = ({ table }: { table: Table }) => {
  const orderCurrent = useOrderBoardStore((s) => s.orders.find((o) => o.orderId === table.orderId));
  const orderList = useOrderBoardStore((s) =>
    s.orders.filter((o) => o.orderId !== table.orderId && o.orderType !== OrderType.Takeaway)
  );

  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      <Field>
        <Label htmlFor="firstOrderCode">{UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE_LABEL}</Label>
        <Input
          id="firstOrderCode"
          value={orderCurrent?.orderCode}
          readOnly
          className="text-[10px]"
        />
      </Field>
      <Field>
        <Label htmlFor="destinyOrderId">
          {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE_DESTINATION}
        </Label>
        <Select name="feature">
          <SelectTrigger>
            <SelectValue placeholder="Select an order" />
          </SelectTrigger>
          <SelectContent position="popper">
            {orderList.map((o) => (
              <SelectItem key={o.orderId} value={o.orderId}>
                {o.orderCode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
};

export default MergeOrder;
