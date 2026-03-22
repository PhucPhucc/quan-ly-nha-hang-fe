import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { orderService } from "@/services/orderService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";

import { Table } from "../TableItem";
import { Feature } from "./DropdownFeature";
import ChangeTable from "./Feature/ChangeTable";
import MergeOrder from "./Feature/MergeOrder";

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
  const fetchTablesByArea = useTableStore((s) => s.fetchTablesByArea);
  const selectedAreaId = useTableStore((s) => s.selectedAreaId);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (feature === Feature.MOVE_TABLE) {
      try {
        const orderId = table.orderId;
        const newTableId = formData.get("feature") as string;
        await orderService.changeTable(orderId as string, newTableId);
        toast.success("Table changed successfully");
      } catch (error) {
        toast.error("Failed to change table. Please try again.");
        console.error("Error occurred while changing table:", error);
      }
    }

    if (feature === Feature.MERGE) {
      try {
        const sourceOrderId = table.orderId;
        const destinyOrderId = formData.get("feature") as string;
        await orderService.mergeOrders(sourceOrderId as string, destinyOrderId);
        toast.success("Orders merged successfully");
      } catch (error) {
        toast.error("Failed to merge orders. Please try again.");
        console.error("Error occurred while merging orders:", error);
      }
    }

    await fetchOrders();
    if (selectedAreaId) {
      await fetchTablesByArea(selectedAreaId);
    }
    onClose(null);
  };

  return (
    <Card className="w-md p-2 border-none bg-background px-0">
      <form onSubmit={handleSubmit}>
        {feature === Feature.MERGE && <MergeOrder table={table} />}
        {feature === Feature.MOVE_TABLE && <ChangeTable table={table} />}
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
