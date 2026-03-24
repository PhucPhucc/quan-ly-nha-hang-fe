"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";
import { Table as ApiTable, TableStatus } from "@/types/Table-Layout";

import TableItem, { Table as TableCard } from "./TableItem";

const isActiveServingOrder = (order: Order) =>
  !!order.tableId && order.status === OrderStatus.Serving;

const TABLE_PLACEHOLDER_COUNT = 8;
const EMPTY_TABLE_MESSAGE = UI_TEXT.ORDER.BOARD.NOT_FOUND;
const CREATE_ORDER_ERROR = UI_TEXT.ORDER.BOARD.CREATE_ORDER_ERROR;
const currencyFormatter = new Intl.NumberFormat("vi-VN");

interface TableListProps {
  areaId: string;
}

const TableList = ({ areaId }: TableListProps) => {
  const orders = useOrderBoardStore((s) => s.orders);
  const fetchOrders = useOrderBoardStore((s) => s.fetchOrders);
  const setActiveView = useOrderBoardStore((s) => s.setActiveView);
  const setSelectedOrderId = useOrderBoardStore((s) => s.setSelectedOrderId);

  const tables = useTableStore((s) => s.tables);
  const isLoading = useTableStore((s) => s.isLoading);
  const fetchTablesByArea = useTableStore((s) => s.fetchTablesByArea);

  const [loadingTableId, setLoadingTableId] = useState<string | null>(null);
  const [orderPickerOpen, setOrderPickerOpen] = useState(false);
  const [pickedTable, setPickedTable] = useState<ApiTable | null>(null);

  useEffect(() => {
    if (areaId) {
      void fetchTablesByArea(areaId);
    }
  }, [areaId, fetchTablesByArea]);

  const sortedTables = tables.toSorted((a, b) => a.tableNumber - b.tableNumber);

  const servingOrdersByTableId = new Map<string, Order[]>();
  orders.filter(isActiveServingOrder).forEach((order) => {
    const tableId = order.tableId as string;
    const current = servingOrdersByTableId.get(tableId) || [];
    servingOrdersByTableId.set(tableId, [...current, order]);
  });

  const handleTableClick = async (table: ApiTable, status: OrderStatus, orderId?: string) => {
    if (status === OrderStatus.Serving && orderId) {
      setSelectedOrderId(orderId);
      return;
    }

    if (status === OrderStatus.Ready) {
      if (loadingTableId !== null) return;

      setLoadingTableId(table.tableId);

      try {
        const res = await orderService.createOrder({
          tableId: table.tableId,
          orderType: OrderType.DineIn,
        });

        if (res.isSuccess) {
          await fetchOrders();

          const newOrderId =
            res.data?.orderId ||
            useOrderBoardStore
              .getState()
              .orders.find((o) => o.tableId === table.tableId && o.status === OrderStatus.Serving)
              ?.orderId;

          if (newOrderId) setSelectedOrderId(newOrderId);

          setActiveView("menu");
        }
      } catch (e: unknown) {
        toast.error(CREATE_ORDER_ERROR);
        console.error(e);
      } finally {
        setLoadingTableId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <>
        {Array.from({ length: TABLE_PLACEHOLDER_COUNT }, (_, index) => (
          <TableItem
            key={`table-loading-${index}`}
            table={{
              tableNumber: index + 1,
              label: "",
              status: OrderStatus.Ready,
              people: 0,
            }}
            isLoading
          />
        ))}
      </>
    );
  }

  if (sortedTables.length === 0) {
    return (
      <p className="col-span-full px-4 text-sm text-muted-foreground">{EMPTY_TABLE_MESSAGE}</p>
    );
  }

  return (
    <>
      {sortedTables.map((table) => {
        const currentOrders = servingOrdersByTableId.get(table.tableId) || [];
        const currentOrder = currentOrders[0];

        const tableData: TableCard = {
          // tableId: table.tableId,
          tableNumber: table.tableNumber,
          label: table.tableCode,
          orderCount: currentOrders.length,
          ...getTableInfo(table, currentOrder),
        };

        const isClickable =
          tableData.status === OrderStatus.Ready || tableData.status === OrderStatus.Serving;

        return (
          <TableItem
            key={table.tableId}
            table={tableData}
            onTableClick={
              isClickable
                ? () => {
                    if (tableData.status !== OrderStatus.Serving) {
                      void handleTableClick(table, tableData.status, currentOrder?.orderId);
                      return;
                    }

                    if (currentOrders.length > 1) {
                      setPickedTable(table);
                      setOrderPickerOpen(true);
                      return;
                    }

                    void handleTableClick(table, tableData.status, currentOrder?.orderId);
                  }
                : undefined
            }
            currentOrderCode={currentOrders.length > 0 ? currentOrder?.orderCode : undefined}
            isLoading={loadingTableId === table.tableId}
          />
        );
      })}
      <Dialog open={orderPickerOpen} onOpenChange={setOrderPickerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {pickedTable?.tableCode || UI_TEXT.ORDER.BOARD.PICK_ORDER_TITLE}
            </DialogTitle>
            <DialogDescription>{UI_TEXT.ORDER.BOARD.PICK_ORDER_DESC}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {(pickedTable ? servingOrdersByTableId.get(pickedTable.tableId) || [] : []).map(
              (order) => (
                <Button
                  key={order.orderId}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => {
                    setSelectedOrderId(order.orderId);
                    setOrderPickerOpen(false);
                  }}
                >
                  <span>{order.orderCode}</span>
                  <span className="text-xs text-muted-foreground">{order.status}</span>
                </Button>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableList;

const getTableInfo = (table: ApiTable, order?: Order): Omit<TableCard, "label" | "tableNumber"> => {
  if (!order) {
    return {
      status: mapTableStatus(table.status),
      people: 0,
    };
  }

  switch (order.status) {
    case OrderStatus.Serving:
      return {
        tableId: table.tableId,
        orderId: order.orderId,
        status: OrderStatus.Serving,
        people: table.capacity,
        price: currencyFormatter.format(getTableBasePrice(order)) + UI_TEXT.COMMON.CURRENCY,
        createdAt: order.createdAt,
      };
    case OrderStatus.Reserved:
      return { status: OrderStatus.Reserved, people: table.capacity };
    case OrderStatus.Ready:
    default:
      return { status: OrderStatus.Ready, people: 0 };
  }
};

const mapTableStatus = (status: TableStatus): OrderStatus => {
  switch (status) {
    case TableStatus.Occupied:
      return OrderStatus.Serving;
    case TableStatus.Reserved:
      return OrderStatus.Reserved;
    case TableStatus.OutOfService:
      return OrderStatus.OutOfService;
    case TableStatus.Available:
    default:
      return OrderStatus.Ready;
  }
};

const getTableBasePrice = (order: Order) => {
  if (order.subTotal && order.subTotal > 0) {
    return order.subTotal;
  }

  const vatRate = order.vatRate ?? 0;
  const discountAmount = order.discountAmount ?? 0;
  const hasVatOrDiscount = (order.vatAmount ?? 0) > 0 || discountAmount > 0;

  if (hasVatOrDiscount && vatRate >= 0) {
    return Math.max(order.totalAmount / (1 + vatRate) + discountAmount, 0);
  }

  return Math.max(order.totalAmount, 0);
};
