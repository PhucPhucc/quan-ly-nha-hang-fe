"use client";

import { AlertCircle, Box, Loader2, Thermometer } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { inventoryService } from "@/services/inventory.service";
import { InventoryStockAlertItem } from "@/types/Inventory";

export function InventoryAlertWidget() {
  const t = UI_TEXT.DASHBOARD.OPERATIONS;
  const [alerts, setAlerts] = useState<(InventoryStockAlertItem & { isOutOfStock: boolean })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await inventoryService.getInventoryAlerts();
        if (res.isSuccess && res.data) {
          const combined = [
            ...res.data.outOfStockItems.map((item) => ({ ...item, isOutOfStock: true })),
            ...res.data.lowStockItems.map((item) => ({ ...item, isOutOfStock: false })),
          ].slice(0, 5);
          setAlerts(combined);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading && alerts.length === 0) {
    return (
      <Card className="h-full border-none shadow-soft rounded-xl animate-pulse bg-card">
        <CardContent className="h-44 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary/20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none hover:ring-info hover:ring-1 shadow-soft rounded-lg overflow-hidden bg-card transition-shadow hover:shadow-md">
      <CardHeader className="bg-linear-to-br from-info to-info/40 text-primary-foreground pb-6 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-[0.15em] opacity-90">
            {t.INVENTORY_ALERTS}
          </CardTitle>
          <div className="bg-card p-2.5 rounded-full shadow-premium border border-muted/30">
            <Box className="size-6 text-info" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between pt-6 relative -mt-4 bg-card shadow-lg border-t border-white/10 h-full">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest">
            {t.INGREDIENT_STATUS}
          </h4>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-danger/10 rounded-lg border border-danger/20">
            <span className="size-1.5 rounded-full bg-danger animate-pulse" />
            <span className="text-[10px] uppercase font-black text-danger tracking-tighter">
              {t.LOW_STOCK}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed rounded-2xl text-muted-foreground border-muted/30">
              <AlertCircle className="size-8 mx-auto opacity-20 mb-2" />
              <p className="text-xs">{t.STABLE_INVENTORY}</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.ingredientId}
                className={cn(
                  "p-3 rounded-xl flex items-center gap-3 transition-colors border",
                  alert.isOutOfStock
                    ? "bg-danger/5 border-danger/10"
                    : "bg-warning/5 border-warning/10"
                )}
              >
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center",
                    alert.isOutOfStock ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
                  )}
                >
                  <Thermometer className="size-4" />
                </div>
                <div className="flex-1">
                  <h5 className="text-xs font-black text-foreground tracking-tight">
                    {alert.ingredientName}
                  </h5>
                  <p className="text-[9px] text-muted-foreground/80 mt-1 font-bold uppercase tracking-tighter">
                    {alert.isOutOfStock ? t.OUT_OF_STOCK : t.LOW_STOCK}
                    {UI_TEXT.COMMON.COLON}
                    <span className="text-foreground ml-1">
                      {alert.currentStock} {alert.unit}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border",
                      alert.isOutOfStock
                        ? "bg-danger text-danger-foreground border-danger"
                        : "bg-warning text-warning-foreground border-warning"
                    )}
                  >
                    {UI_TEXT.COMMON.MINUS}
                    {Math.round(
                      ((alert.threshold - alert.currentStock) / (alert.threshold || 1)) * 100
                    )}
                    {UI_TEXT.COMMON.PERCENT}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-2 hover:bg-transparent hover:text-primary text-xs font-semibold"
          // className="w-full mt-4 py-3 text-xs font-bold text-muted-foreground hover:text-primary transition-colors border-t border-dashed border-muted">
        >
          <Link href="/manager/inventory">{t.VIEW_DETAILS}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
