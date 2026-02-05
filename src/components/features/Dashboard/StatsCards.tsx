"use client";

import { DollarSign, ShoppingCart, Users, Utensils } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

export function StatsCards() {
  const t = UI_TEXT.DASHBOARD.STATS;
  const stats = [
    {
      title: t.REVENUE,
      value: "$24,580.00",
      description: t.REVENUE_DESC("+12.5%"),
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: t.ORDERS,
      value: "456",
      description: t.ORDERS_DESC("+5.2%"),
      icon: ShoppingCart,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      title: t.TABLES,
      value: "18 / 25",
      description: t.TABLES_DESC("72%"),
      icon: Utensils,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: t.STAFF,
      value: "12",
      description: t.STAFF_DESC(4, 8),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
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
