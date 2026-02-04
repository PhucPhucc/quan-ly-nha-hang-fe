"use client";

import { DollarSign, ShoppingCart, Users, Utensils } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$24,580.00",
      description: "+12.5% from last month",
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "New Orders",
      value: "456",
      description: "+5.2% from yesterday",
      icon: ShoppingCart,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      title: "Active Tables",
      value: "18 / 25",
      description: "72% occupancy rate",
      icon: Utensils,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Staff On Duty",
      value: "12",
      description: "4 chefs, 8 waiters",
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
