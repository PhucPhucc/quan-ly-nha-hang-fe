"use client";

import { DollarSign, Loader2, ShoppingCart, Users, Utensils } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import * as employeeService from "@/services/employeeService";
import { orderService } from "@/services/orderService";
import { OrderStatus } from "@/types/enums";
import { Order } from "@/types/Order";

export function StatsCards() {
  const t = UI_TEXT.DASHBOARD.STATS;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    revenue: 0,
    ordersCount: 0,
    tablesInUse: 0,
    staffCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [ordersRes, employeesRes] = await Promise.all([
          orderService.getOrders({ pageSize: 1000 }), // Get many to calculate revenue. Better if BE provides this.
          employeeService.getEmployees(),
        ]);

        let revenue = 0;
        let tablesInUse = 0;
        let ordersCount = 0;

        if (ordersRes.isSuccess && ordersRes.data) {
          ordersCount = ordersRes.data.totalCount || 0;
          revenue =
            ordersRes.data.items?.reduce((acc: number, order: Order) => {
              if (order.status === OrderStatus.Completed) return acc + order.totalAmount;
              return acc;
            }, 0) || 0;

          tablesInUse = new Set(
            ordersRes.data.items
              ?.filter((o: Order) => o.status === OrderStatus.Serving && o.tableId)
              .map((o: Order) => o.tableId)
          ).size;
        }

        setData({
          revenue,
          ordersCount,
          tablesInUse,
          staffCount: employeesRes.isSuccess ? employeesRes.data?.totalCount || 0 : 0,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: t.REVENUE,
      value: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        data.revenue
      ),
      description: t.REVENUE_DESC("+0%"),
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: t.ORDERS,
      value: data.ordersCount.toString(),
      description: t.ORDERS_DESC("+0%"),
      icon: ShoppingCart,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      title: t.TABLES,
      value: `${data.tablesInUse} / ??`,
      description: t.TABLES_DESC(`${data.tablesInUse > 0 ? "Bận" : "Trống"}`),
      icon: Utensils,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: t.STAFF,
      value: data.staffCount.toString(),
      description: t.STAFF_DESC(0, data.staffCount),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["l1", "l2", "l3", "l4"].map((key) => (
          <Card key={key} className="h-32 flex items-center justify-center border-none shadow-md">
            <Loader2 className="animate-spin text-primary opacity-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
