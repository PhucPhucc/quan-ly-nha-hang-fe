"use client";

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

const t = UI_TEXT.DASHBOARD.RECENT_ORDERS;

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Completed:
      return t.STATUS_COMPLETED;
    case OrderStatus.Serving:
      return UI_TEXT.TABLE.SERVING;
    case OrderStatus.Cancelled:
      return t.STATUS_CANCELLED;
    default:
      return t.STATUS_PENDING;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Completed:
      return "bg-order-completed/10 text-order-completed border-order-completed/20";
    case OrderStatus.Cancelled:
      return "bg-danger/10 text-danger border-danger/20";
    case OrderStatus.Serving:
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-order-pending/10 text-order-pending border-order-pending/20";
  }
};

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrders({ pageSize: 5 });
        if (res.isSuccess && res.data) {
          setOrders(res.data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">{t.TITLE}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t.TITLE}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">{t.ORDER_ID}</TableHead>
              <TableHead>{t.TABLE}</TableHead>
              <TableHead>{t.AMOUNT}</TableHead>
              <TableHead>{t.STATUS}</TableHead>
              <TableHead className="text-right">{t.TIME}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.orderId}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium text-xs">
                    {UI_TEXT.COMMON.HASH}
                    {order.orderCode}
                  </TableCell>
                  <TableCell className="text-xs">
                    {order.orderType === OrderType.Takeaway
                      ? UI_TEXT.ORDER.CURRENT.TAKEAWAY
                      : UI_TEXT.TABLE.TABLE_NUMBER(parseInt(order.tableId?.slice(-2) || "0"))}
                  </TableCell>
                  <TableCell className="font-bold text-primary text-xs">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right text-[10px]">
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {UI_TEXT.ORDER.CURRENT.EMPTY || "Chưa có đơn hàng nào"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
