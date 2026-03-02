"use client";

import { useState } from "react";
import { toast } from "sonner";

import { orderService } from "@/services/orderService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

import TableItem, { Table } from "./TableItem";

const TableList = () => {
  const orders = useOrderBoardStore((s) => s.orders);
  const fetchOrders = useOrderBoardStore((s) => s.fetchOrders);
  const setActiveView = useOrderBoardStore((s) => s.setActiveView);
  const setSelectedOrderId = useOrderBoardStore((s) => s.setSelectedOrderId);
  const [loadingTable, setLoadingTable] = useState<number | null>(null);

  const handleTableClick = async (tableNumber: number, status: OrderStatus, orderId?: string) => {
    if (status === OrderStatus.Serving && orderId) {
      setSelectedOrderId(orderId);
      return;
    }

    if (status === OrderStatus.Ready) {
      if (loadingTable !== null) return;
      const tableId = "00000000-0000-0000-0000-00000000000" + tableNumber.toString();
      setLoadingTable(tableNumber);
      try {
        const res = await orderService.createOrder({
          tableId,
          orderType: OrderType.DineIn,
        });

        if (res.isSuccess) {
          await fetchOrders();
          const newOrder = useOrderBoardStore
            .getState()
            .orders.find((o) => o.tableId?.endsWith(tableId) && o.status !== OrderStatus.Completed);
          if (newOrder) {
            setSelectedOrderId(newOrder.orderId);
          }
          setActiveView("menu");
        }
      } catch (e: unknown) {
        toast.error("Tạo order thất bại");
        console.error(e);
      } finally {
        setLoadingTable(null);
      }
    }
  };

  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const tableNumber = i + 1;
        const tableId = tableNumber.toString().padStart(2, "0");

        const currentOrder = orders.find(
          (o) => o.tableId?.endsWith(tableId) && o.status !== OrderStatus.Completed
        );

        const tableData: Table = {
          tableNumber,
          label: `Bàn ${tableId}`,
          ...getTableInfo(currentOrder),
        } as Table;

        const isClickable =
          tableData.status === OrderStatus.Ready || tableData.status === OrderStatus.Serving;

        return (
          <TableItem
            key={tableNumber}
            table={tableData}
            onTableClick={
              isClickable
                ? () => handleTableClick(tableNumber, tableData.status, currentOrder?.orderId)
                : undefined
            }
            isLoading={loadingTable === tableNumber}
          />
        );
      })}
    </>
  );
};

export default TableList;

const getTableInfo = (order?: Order) => {
  if (!order) {
    return { status: OrderStatus.Ready, people: 0 };
  }

  switch (order.status) {
    case OrderStatus.Serving:
      return {
        status: OrderStatus.Serving,
        people: 4,
        price: order.totalAmount
          ? new Intl.NumberFormat("vi-VN").format(order.totalAmount) + "đ"
          : "0đ",
        createdAt: order.createdAt,
      };
    case OrderStatus.Reserved:
      return { status: OrderStatus.Reserved, people: 0 };
    case OrderStatus.Cleaning:
      return { status: OrderStatus.Cleaning, people: 0 };
    case OrderStatus.Ready:
    default:
      return { status: OrderStatus.Ready, people: 0 };
  }
};
