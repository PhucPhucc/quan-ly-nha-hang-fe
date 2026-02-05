"use client";

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

const t = UI_TEXT.DASHBOARD.RECENT_ORDERS;

const orders = [
  {
    id: "#ORD-7392",
    customer: "Nguyễn Văn A",
    table: "T-04",
    amount: "1.200.000đ",
    status: t.STATUS_COMPLETED,
    time: t.MINS_AGO(10),
  },
  {
    id: "#ORD-7391",
    customer: "Trần Thị B",
    table: "T-12",
    amount: "3.500.000đ",
    status: t.STATUS_PREPARING,
    time: t.MINS_AGO(15),
  },
  {
    id: "#ORD-7390",
    customer: "Lê Văn C",
    table: "T-01",
    amount: "850.000đ",
    status: t.STATUS_PENDING,
    time: t.MINS_AGO(22),
  },
  {
    id: "#ORD-7389",
    customer: "Phạm Minh D",
    table: "T-08",
    amount: "2.100.000đ",
    status: t.STATUS_COMPLETED,
    time: t.MINS_AGO(45),
  },
  {
    id: "#ORD-7388",
    customer: "Hoàng Anh E",
    table: "T-02",
    amount: "1.500.000đ",
    status: t.STATUS_CANCELLED,
    time: t.HOUR_AGO(1),
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case t.STATUS_COMPLETED:
      return "bg-order-completed/10 text-order-completed border-order-completed/20";
    case t.STATUS_PREPARING:
      return "bg-order-cooking/10 text-order-cooking border-order-cooking/20";
    case t.STATUS_PENDING:
      return "bg-order-pending/10 text-order-pending border-order-pending/20";
    case t.STATUS_CANCELLED:
      return "bg-danger/10 text-danger border-danger/20";
    default:
      return "bg-muted text-muted-foreground border-muted-foreground/20";
  }
};

export function RecentOrders() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t.TITLE}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">{t.ORDER_ID}</TableHead>
              <TableHead>{t.CUSTOMER}</TableHead>
              <TableHead>{t.TABLE}</TableHead>
              <TableHead>{t.AMOUNT}</TableHead>
              <TableHead>{t.STATUS}</TableHead>
              <TableHead className="text-right">{t.TIME}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.table}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-xs">
                  {order.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
