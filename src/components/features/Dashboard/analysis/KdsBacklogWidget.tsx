"use client";

import { ChefHat, Loader2, Pause, Play, Timer } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UI_TEXT } from "@/lib/UI_Text";
import { useKdsStore } from "@/store/useKdsStore";

export function KdsBacklogWidget() {
  const t = UI_TEXT.DASHBOARD.OPERATIONS;
  const { activeItems, queueItems, fetchKdsData } = useKdsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchKdsData();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchKdsData]);

  const waitingCount = queueItems.length;
  const preparingCount = activeItems.length;

  const delayedCount = activeItems.filter((i) => {
    const createdTime = new Date(i.createdAt).getTime();
    const now = new Date().getTime();
    return now - createdTime > 20 * 60 * 1000;
  }).length;

  const total = waitingCount + preparingCount;
  const preparingPercentage = total > 0 ? (preparingCount / total) * 100 : 0;

  if (loading && total === 0) {
    return (
      <Card className="h-full border border-muted/60 bg-white">
        <CardContent className="h-44 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary/20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border border-muted/60 shadow-none rounded-xl overflow-hidden bg-white pb-5">
      <CardHeader className="bg-primary/90 pb-6 pt-5 border-b border-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-[0.15em] text-foreground/70">
            {t.KDS_BACKLOG}
          </CardTitle>
          <div className="bg-white p-2.5 rounded-2xl shadow-premium border border-muted/30">
            <ChefHat className="size-4.5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-end justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold tracking-tighter text-foreground">
              {total}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t.PROCESSING_ITEMS(total)}
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-amber-600">{waitingCount}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground/90">
                {t.WAITING}
              </span>
            </div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-sm font-black text-primary">{preparingCount}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground/90">
                {t.PREPARING}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground/80">
              <span>{t.PREPARING_PROGRESS}</span>
              <span className="text-primary font-black bg-primary/10 px-1.5 py-0.5 rounded-sm">
                {Math.round(preparingPercentage)}
                {UI_TEXT.COMMON.PERCENT}
              </span>
            </div>
            <Progress
              value={preparingPercentage}
              className="h-2 rounded-full overflow-hidden bg-muted/80 shadow-inner"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-amber-100/40 p-3 rounded-2xl border border-amber-300/40 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Pause className="size-4 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black leading-none text-amber-900">
                  {t.ITEMS_COUNT(waitingCount)}
                </span>
                <span className="text-[8px] opacity-70 uppercase font-black tracking-wider mt-1.5 text-amber-700/80">
                  {t.WAITING}
                </span>
              </div>
            </div>
            <div className="flex-1 bg-primary/10 p-3 rounded-2xl border border-primary/20 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Play className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black leading-none text-primary/90">
                  {t.ITEMS_COUNT(preparingCount)}
                </span>
                <span className="text-[8px] opacity-70 uppercase font-black tracking-wider mt-1.5 text-primary/70">
                  {t.PREPARING}
                </span>
              </div>
            </div>
          </div>
        </div>

        {delayedCount > 0 && (
          <div className="mt-4 p-3 bg-red-100/50 rounded-xl border border-red-200/60 flex items-center gap-3 animate-pulse">
            <div className="p-1.5 bg-red-500 rounded-lg">
              <Timer className="size-3.5 text-white" />
            </div>
            <span className="text-[10px] font-black text-red-700 uppercase tracking-tight">
              {t.DELAYED_WARNING(delayedCount, 20)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
