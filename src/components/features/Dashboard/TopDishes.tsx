"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

const dishes = [
  {
    name: "Wagyu Steak",
    orders: 124,
    price: "$240",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop",
  },
  {
    name: "Lobster Pasta",
    orders: 98,
    price: "$180",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=100&h=100&fit=crop",
  },
  {
    name: "Truffle Pizza",
    orders: 85,
    price: "$120",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
  },
];

export function TopDishes() {
  const t = UI_TEXT.DASHBOARD.TOP_DISHES;
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t.TITLE}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {dishes.map((dish, index) => (
          <div key={index} className="flex items-center gap-4 group cursor-pointer">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                src={dish.image}
                alt={dish.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-semibold text-sm">{dish.name}</span>
              <span className="text-muted-foreground text-xs">{t.ORDERS_COUNT(dish.orders)}</span>
            </div>
            <div className="text-sm font-bold text-blue-600">{dish.price}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
