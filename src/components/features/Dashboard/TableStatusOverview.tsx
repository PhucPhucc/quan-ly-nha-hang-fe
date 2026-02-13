"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { OrderStatus, OrderType } from "@/types/enums";

export function TableStatusOverview() {
  const t = UI_TEXT.DASHBOARD.TABLE_OCCUPANCY;
  const [loading, setLoading] = useState(true);
  const [occupiedTables, setOccupiedTables] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTableStatus = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrders({ pageSize: 100 });
        if (res.isSuccess && res.data) {
          const occupied = new Set(
            res.data.items
              ?.filter(
                (o) =>
                  o.status === OrderStatus.Serving && o.orderType === OrderType.DineIn && o.tableId
              )
              .map((o) => o.tableId as string)
          );
          setOccupiedTables(occupied);
        }
      } catch (error) {
        console.error("Failed to fetch table occupancy", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTableStatus();
  }, []);

  // Since we don't have a Table entity, we'll show a grid of 12 "slots"
  const totalSlots = 12;
  const tables = Array.from({ length: totalSlots }, (_, i) => {
    const tableId = (i + 1).toString().padStart(2, "0");
    // This logic is a bit flawed since real tableIds are Guids,
    // but without a Table entity, we'll just demonstrate the connection.
    const isOccupied = Array.from(occupiedTables).some(
      (id) => id.includes(tableId) || id === tableId
    );
    return {
      id: `T-${tableId}`,
      status: isOccupied ? "occupied" : "free",
    };
  });

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold">{t.TITLE}</CardTitle>
        <div className="flex gap-3 text-xs font-bold uppercase tracking-tighter">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-table-empty"></span>
            <span className="text-muted-foreground">{t.FREE}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-table-inprocess"></span>
            <span className="text-muted-foreground">{t.OCCUPIED}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-4">
          {tables.map((table) => {
            const isOccupied = table.status === "occupied";
            const displayStatus = isOccupied ? t.OCCUPIED : t.FREE;
            return (
              <div
                key={table.id}
                className={`
                flex aspect-square flex-col items-center justify-center rounded-2xl border-2 transition-all hover:scale-105 shadow-sm
                ${
                  isOccupied
                    ? "border-table-inprocess bg-table-inprocess/5 text-table-inprocess"
                    : "border-slate-100 bg-slate-50/50 text-slate-300"
                }
              `}
              >
                <span className="text-sm font-black">{table.id}</span>
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {displayStatus}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
