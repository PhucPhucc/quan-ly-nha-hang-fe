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

const orders = [
  {
    id: "#ORD-7392",
    customer: "John Doe",
    table: "T-04",
    amount: "$45.00",
    status: "Completed",
    time: "10 mins ago",
  },
  {
    id: "#ORD-7391",
    customer: "Sarah Smith",
    table: "T-12",
    amount: "$128.50",
    status: "Preparing",
    time: "15 mins ago",
  },
  {
    id: "#ORD-7390",
    customer: "Mike Johnson",
    table: "T-01",
    amount: "$32.20",
    status: "Pending",
    time: "22 mins ago",
  },
  {
    id: "#ORD-7389",
    customer: "Emily Brown",
    table: "T-08",
    amount: "$76.00",
    status: "Completed",
    time: "45 mins ago",
  },
  {
    id: "#ORD-7388",
    customer: "David Wilson",
    table: "T-02",
    amount: "$54.00",
    status: "Cancelled",
    time: "1 hour ago",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-order-completed/10 text-order-completed border-order-completed/20";
    case "Preparing":
      return "bg-order-cooking/10 text-order-cooking border-order-cooking/20";
    case "Pending":
      return "bg-order-pending/10 text-order-pending border-order-pending/20";
    case "Cancelled":
      return "bg-danger/10 text-danger border-danger/20";
    default:
      return "bg-muted text-muted-foreground border-muted-foreground/20";
  }
};

export function RecentOrders() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
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
