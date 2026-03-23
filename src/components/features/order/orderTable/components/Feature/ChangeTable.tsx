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
import { useTableStore } from "@/store/useTableStore";
import { TableStatus } from "@/types/Table-Layout";

import { Table } from "../../TableItem";

const ChangeTable = ({ table }: { table: Table }) => {
  const apiTable = useTableStore((s) =>
    s.tables.filter((t) => t.tableId !== table.tableId || t.status === TableStatus.Available)
  );

  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      <Field>
        <Label htmlFor="sourceOrderId">
          {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE_ORIGIN}
        </Label>
        <Input id="sourceOrderId" value={table.label} readOnly className="text-[10px]" />
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
            {apiTable.map((t) => (
              <SelectItem key={t.tableId} value={t.tableId}>
                {t.tableCode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
};

export default ChangeTable;
