import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { orderService } from "@/services/orderService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";

import { Table } from "../TableItem";
import { Feature } from "./DropdownFeature";

export default function CardFeature({
  feature,
  table,
  onClose,
}: {
  feature: Feature;
  table: Table;
  onClose: (feature: Feature | null) => void;
}) {
  const fetchOrders = useOrderBoardStore((s) => s.fetchOrders);
  const apiTable = useTableStore((s) => s.tables.filter((t) => t.tableId !== table.tableId));
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const orderId = table.orderId;
    const newTableId = formData.get("feature") as string;

    if (feature === Feature.MOVE_TABLE) {
      try {
        await orderService.changeTable(orderId as string, newTableId);
        toast.success("Table changed successfully");
      } catch (error) {
        toast.error("Failed to change table. Please try again.");
        console.error("Error occurred while changing table:", error);
      } finally {
        await fetchOrders();
        onClose(null);
      }
    }
  };

  return (
    <Card className="w-md p-2 border-none">
      <form onSubmit={handleSubmit}>
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
        {/* <Separator className="my-4"/> */}
        <div className="p-2">
          <Button type="submit" className="w-full">
            {feature === Feature.MOVE_TABLE && "Move"}
            {feature === Feature.MERGE && "Merge"}
            {feature === Feature.SPLIT && "Split"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
