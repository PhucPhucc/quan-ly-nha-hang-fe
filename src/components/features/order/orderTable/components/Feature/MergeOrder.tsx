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

import { isMergeCandidateOrder } from "../../orderTable.utils";
import { Table } from "../../TableItem";

const MergeOrder = ({ table }: { table: Table }) => {
  const orderCurrent = useOrderBoardStore((s) => s.orders.find((o) => o.orderId === table.orderId));
  const orderList = useOrderBoardStore((s) =>
    s.orders.filter((o) => isMergeCandidateOrder(o, table.orderId))
  );

  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      <Field>
        <Label htmlFor="mergeSource">{UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE_LABEL}</Label>
        <Input id="mergeSource" value={orderCurrent?.orderCode} readOnly className="text-[10px]" />
      </Field>
      <Field>
        <Label htmlFor="targetOrderId">
          {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE_DESTINATION}
        </Label>
        <Select name="targetOrderId" required>
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
