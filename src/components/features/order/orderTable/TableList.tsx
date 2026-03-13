"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { orderService } from "@/services/orderService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";
import { Table as ApiTable, TableStatus } from "@/types/Table-Layout";

import TableItem, { Table as TableCard } from "./TableItem";

const TABLE_PLACEHOLDER_COUNT = 8;
const EMPTY_TABLE_MESSAGE = "Chưa có bàn nào";
const CREATE_ORDER_ERROR = "Tạo order thất bại";
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

  useEffect(() => {
    if (areaId) {
      void fetchTablesByArea(areaId);
    }
  }, [areaId, fetchTablesByArea]);

  const sortedTables = tables.toSorted((a, b) => a.tableNumber - b.tableNumber);

  const activeOrderByTableId = new Map(
    orders
      .filter((order) => order.tableId && order.status !== OrderStatus.Completed)
      .map((order) => [order.tableId as string, order])
  );

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
              .orders.find((o) => o.tableId === table.tableId && o.status !== OrderStatus.Completed)
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
        const currentOrder = activeOrderByTableId.get(table.tableId);

        const tableData: TableCard = {
          tableNumber: table.tableNumber,
          label: table.tableCode,
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
                ? () => handleTableClick(table, tableData.status, currentOrder?.orderId)
                : undefined
            }
            currentOrderCode={currentOrder?.orderCode}
            isLoading={loadingTableId === table.tableId}
          />
        );
      })}
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
        status: OrderStatus.Serving,
        people: table.capacity,
        price: order.totalAmount ? currencyFormatter.format(order.totalAmount) + "đ" : "0đ",
        createdAt: order.createdAt,
      };
    case OrderStatus.Reserved:
      return { status: OrderStatus.Reserved, people: table.capacity };
    case OrderStatus.Cleaning:
      return { status: OrderStatus.Cleaning, people: 0 };
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
    case TableStatus.Cleaning:
      return OrderStatus.Cleaning;
    case TableStatus.OutOfService:
      return OrderStatus.OutOfService;
    case TableStatus.Available:
    default:
      return OrderStatus.Ready;
  }
};
