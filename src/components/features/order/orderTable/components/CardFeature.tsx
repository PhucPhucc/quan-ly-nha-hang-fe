import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { OrderItemStatus, OrderStatus } from "@/types/enums";
import { TableStatus } from "@/types/Table-Layout";

import { Table } from "../TableItem";
import { Feature } from "./DropdownFeature";
import ChangeTable from "./Feature/ChangeTable";
import MergeOrder from "./Feature/MergeOrder";

type SplitItem = {
  orderItemId: string;
  name: string;
  maxQuantity: number;
  quantity: number;
  status: OrderItemStatus;
  note?: string;
};

type SplitDestinationMode = "existing-order" | "new-table";

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
  const orders = useOrderBoardStore((s) => s.orders);
  const selectedAreaId = useTableStore((s) => s.selectedAreaId);
  const fetchTablesByArea = useTableStore((s) => s.fetchTablesByArea);
  const tables = useTableStore((s) => s.tables);

  const sourceOrder = orders.find((o) => o.orderId === table.orderId);
  const candidateTables = tables.filter((t) => t.tableId !== table.tableId);
  const servingTargetOrders = candidateTables
    .map((candidateTable) => {
      const targetOrder = orders.find(
        (order) => order.tableId === candidateTable.tableId && order.status === OrderStatus.Serving
      );
      if (!targetOrder) return null;

      return {
        tableId: candidateTable.tableId,
        orderId: targetOrder.orderId,
        orderCode: targetOrder.orderCode,
      };
    })
    .filter(Boolean);
  const availableTargetTables = candidateTables.filter(
    (candidateTable) => candidateTable.status === TableStatus.Available
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSplitItems, setLoadingSplitItems] = useState(false);
  const [splitItems, setSplitItems] = useState<SplitItem[]>([]);
  const [splitDestinationMode, setSplitDestinationMode] =
    useState<SplitDestinationMode>("new-table");
  const [splitDestinationOrderId, setSplitDestinationOrderId] = useState("");
  const [splitDestinationTableId, setSplitDestinationTableId] = useState("");

  const hasSelectedSplitItems = splitItems.some((item) => item.quantity > 0);
  const splitSelectedLines = splitItems.filter((item) => item.quantity > 0).length;
  const splitSelectedQuantity = splitItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const loadOrderItems = async () => {
      if (feature !== Feature.SPLIT || !table.orderId) return;

      setLoadingSplitItems(true);
      try {
        const res = await orderService.getOrderById(table.orderId);
        if (res.isSuccess && res.data) {
          const items = res.data.orderItems.map((item) => ({
            orderItemId: item.orderItemId,
            name: item.itemNameSnapshot,
            maxQuantity: item.quantity,
            quantity: 0,
            status: item.status,
            note: item.itemNote,
          }));
          setSplitItems(items);
        }
      } catch (error) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_FETCH_ITEMS_ERROR);
        console.error("Load order items failed", error);
      } finally {
        setLoadingSplitItems(false);
      }
    };

    loadOrderItems();
  }, [feature, table.orderId]);

  useEffect(() => {
    if (feature !== Feature.SPLIT) return;

    setSplitDestinationMode(servingTargetOrders.length > 0 ? "existing-order" : "new-table");
    setSplitDestinationOrderId("");
    setSplitDestinationTableId("");
  }, [feature, servingTargetOrders.length, table.orderId]);

  const updateQuantity = (orderItemId: string, value: number) => {
    setSplitItems((prev) =>
      prev.map((item) => {
        if (item.orderItemId !== orderItemId) return item;
        const next = Math.max(0, Math.min(item.maxQuantity, Math.floor(value)));
        return { ...item, quantity: next };
      })
    );
  };

  const refreshBoardData = async () => {
    await fetchOrders();
    if (selectedAreaId) {
      await fetchTablesByArea(selectedAreaId);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const orderId = table.orderId;
    const targetTableId = formData.get("targetTableId") as string;
    const targetOrderId = formData.get("targetOrderId") as string;

    if (feature === Feature.MERGE) {
      if (!orderId) {
        toast.error("Không tìm thấy order của bàn này");
        return;
      }

      if (!targetOrderId) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE_SECOND_ORDER_REQUIRED);
        return;
      }

      if (orderId === targetOrderId) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE_DUPLICATE_ERROR);
        return;
      }

      setIsSubmitting(true);
      try {
        await orderService.mergeOrders(orderId, targetOrderId);
        toast.success(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE_SUCCESS);
      } catch (error) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE_ERROR);
        console.error("Error occurred while merging order:", error);
      } finally {
        setIsSubmitting(false);
        await refreshBoardData();
        onClose(null);
      }
      return;
    }

    if (feature === Feature.SPLIT) {
      if (!orderId) {
        toast.error("Không tìm thấy order của bàn này");
        return;
      }

      const itemsToSplit = splitItems
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          orderItemId: item.orderItemId,
          quantityToSplit: item.quantity,
        }));

      if (itemsToSplit.length === 0) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_REQUIRED_QTY);
        return;
      }

      if (splitDestinationMode === "existing-order" && !splitDestinationOrderId) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_REQUIRED_DESTINATION_ORDER);
        return;
      }

      if (splitDestinationMode === "new-table" && !splitDestinationTableId) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_REQUIRED_DESTINATION_TABLE);
        return;
      }

      setIsSubmitting(true);
      try {
        await orderService.splitOrder(orderId, {
          destinationOrderId:
            splitDestinationMode === "existing-order" ? splitDestinationOrderId : undefined,
          destinationTableId:
            splitDestinationMode === "new-table" ? splitDestinationTableId : undefined,
          itemsToSplit,
        });
        toast.success(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_SUCCESS);
      } catch (error) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_ERROR);
        console.error("Error occurred while splitting order:", error);
      } finally {
        setIsSubmitting(false);
        await refreshBoardData();
        onClose(null);
      }
      return;
    }

    if (feature === Feature.MOVE_TABLE) {
      if (!orderId) {
        toast.error("Không tìm thấy order của bàn này");
        return;
      }

      if (!targetTableId) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE_DESTINATION_REQUIRED);
        return;
      }

      setIsSubmitting(true);
      try {
        await orderService.changeTable(orderId, targetTableId);
        toast.success(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE_SUCCESS);
      } catch (error) {
        toast.error(UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE_ERROR);
        console.error("Error occurred while changing table:", error);
      } finally {
        setIsSubmitting(false);
        await refreshBoardData();
        onClose(null);
      }
    }

    await fetchOrders();
    if (selectedAreaId) {
      await fetchTablesByArea(selectedAreaId);
    }
    onClose(null);
  };

  return (
    <Card className="w-full border-none p-2 shadow-none">
      <form onSubmit={handleSubmit}>
        {feature === Feature.MOVE_TABLE && <ChangeTable table={table} />}

        {feature === Feature.MERGE && <MergeOrder table={table} />}

        {feature === Feature.SPLIT && (
          <div className="space-y-4 px-1 py-2">
            <div className="rounded-2xl border bg-muted/20 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_ORIGIN}
                  </p>
                  <p className="text-sm font-semibold">{sourceOrder?.orderCode || table.label}</p>
                </div>
                <Badge variant="outline">
                  {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_SUMMARY(
                    splitSelectedLines,
                    splitSelectedQuantity
                  )}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">
                  {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_DESTINATION_LABEL}
                </p>
                <p className="text-xs text-muted-foreground">
                  {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_DESTINATION_DESC}
                </p>
              </div>

              <Tabs
                value={splitDestinationMode}
                onValueChange={(value) => {
                  const nextMode = value as SplitDestinationMode;
                  setSplitDestinationMode(nextMode);
                  setSplitDestinationOrderId("");
                  setSplitDestinationTableId("");
                }}
                className="w-full"
              >
                <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl bg-muted/40 p-1">
                  <TabsTrigger
                    value="existing-order"
                    disabled={servingTargetOrders.length === 0}
                    asChild
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_MODE_EXISTING}
                    </Button>
                  </TabsTrigger>
                  <TabsTrigger
                    value="new-table"
                    disabled={availableTargetTables.length === 0}
                    asChild
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_MODE_NEW}
                    </Button>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {splitDestinationMode === "existing-order" ? (
                <Field>
                  <Label htmlFor="splitDestinationOrder">
                    {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_DESTINATION_ORDER}
                  </Label>
                  <Select
                    value={splitDestinationOrderId}
                    onValueChange={setSplitDestinationOrderId}
                  >
                    <SelectTrigger id="splitDestinationOrder">
                      <SelectValue
                        placeholder={
                          UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_DESTINATION_ORDER_PLACEHOLDER
                        }
                      />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {servingTargetOrders.map((item) => (
                        <SelectItem key={item!.orderId} value={item!.orderId}>
                          {item!.orderCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              ) : (
                <Field>
                  <Label htmlFor="splitDestinationTable">
                    {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_DESTINATION_TABLE}
                  </Label>
                  <Select
                    value={splitDestinationTableId}
                    onValueChange={setSplitDestinationTableId}
                  >
                    <SelectTrigger id="splitDestinationTable">
                      <SelectValue
                        placeholder={
                          UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_DESTINATION_TABLE_PLACEHOLDER
                        }
                      />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {availableTargetTables.map((targetTable) => (
                        <SelectItem key={targetTable.tableId} value={targetTable.tableId}>
                          {targetTable.tableCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLITED_ITEMS_LABEL}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLITED_ITEMS_DESC}
                  </p>
                </div>
                {hasSelectedSplitItems && (
                  <Badge variant="success">
                    {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_SELECTED_COUNT(
                      splitSelectedQuantity
                    )}
                  </Badge>
                )}
              </div>

              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {loadingSplitItems && (
                  <p className="text-xs text-muted-foreground">
                    {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_LOADING_ITEMS}
                  </p>
                )}
                {!loadingSplitItems && splitItems.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_EMPTY_ITEMS}
                  </p>
                )}
                {splitItems.map((item) => {
                  const movable = isSplitItemMovable(item.status);

                  return (
                    <div
                      key={item.orderItemId}
                      className="flex items-center gap-3 rounded-2xl border bg-background p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Label className="truncate text-sm font-semibold">{item.name}</Label>
                          <Badge variant={getSplitItemBadgeVariant(item.status)}>
                            {getSplitItemStatusLabel(item.status)}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_ITEM_QTY_LABEL}{" "}
                          {item.maxQuantity}
                        </p>
                        {item.note && (
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_ITEM_NOTE_LABEL} {item.note}
                          </p>
                        )}
                        {!movable && (
                          <p className="mt-1 text-xs text-destructive">
                            {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_ITEM_COMPLETED_ERROR}
                          </p>
                        )}
                      </div>
                      <Input
                        type="number"
                        min={0}
                        max={item.maxQuantity}
                        value={item.quantity}
                        disabled={!movable}
                        className="w-20 text-center"
                        onChange={(event) =>
                          updateQuantity(item.orderItemId, Number(event.target.value))
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          // <SplitOrder table={table} splitItems={splitItems} onSplit={setSplitItems} />
        )}

        <div className="p-2">
          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting
              // (feature === Feature.SPLIT && (loadingSplitItems || !hasSelectedSplitItems))
            }
          >
            {isSubmitting && UI_TEXT.ORDER.CURRENT.PROCESSING}
            {!isSubmitting &&
              feature === Feature.MOVE_TABLE &&
              UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE}
            {!isSubmitting &&
              feature === Feature.MERGE &&
              UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE}
            {!isSubmitting &&
              feature === Feature.SPLIT &&
              (splitDestinationMode === "new-table"
                ? UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_ACTION_NEW
                : UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT_ACTION_EXISTING)}
          </Button>
        </div>
      </form>
    </Card>
  );
}

const getSplitItemStatusLabel = (status: OrderItemStatus) => {
  switch (status) {
    case OrderItemStatus.Preparing:
      return UI_TEXT.ORDER.CURRENT.STATUS_PREP;
    case OrderItemStatus.Cooking:
      return UI_TEXT.ORDER.CURRENT.STATUS_COOKING;
    case OrderItemStatus.Ready:
      return UI_TEXT.ORDER.CURRENT.STATUS_READY;
    case OrderItemStatus.Cancelled:
      return UI_TEXT.ORDER.CURRENT.STATUS_CANCELLED;
    case OrderItemStatus.Rejected:
      return UI_TEXT.ORDER.CURRENT.STATUS_REJECTED;
    case OrderItemStatus.Completed:
    default:
      return UI_TEXT.ORDER.CURRENT.STATUS_DONE;
  }
};

const getSplitItemBadgeVariant = (
  status: OrderItemStatus
): "secondary" | "success" | "warning" | "destructive" | "outline" => {
  switch (status) {
    case OrderItemStatus.Ready:
      return "success";
    case OrderItemStatus.Cooking:
      return "warning";
    case OrderItemStatus.Cancelled:
    case OrderItemStatus.Rejected:
      return "destructive";
    case OrderItemStatus.Completed:
      return "outline";
    case OrderItemStatus.Preparing:
    default:
      return "secondary";
  }
};

const isSplitItemMovable = (status: OrderItemStatus) => status !== OrderItemStatus.Completed;
