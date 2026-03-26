"use client";

import { ChefHat, Loader2, Pause, Play, Timer } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UI_TEXT } from "@/lib/UI_Text";
import { kdsService } from "@/services/kdsService";
import { KdsBacklogSummary } from "@/types/Kds";

export function KdsBacklogWidget() {
  const t = UI_TEXT.DASHBOARD.OPERATIONS;
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<KdsBacklogSummary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await kdsService.getBacklogSummary();
        if (response.isSuccess) {
          setSummary(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch KDS backlog summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading && !summary) {
    return (
      <Card className="h-44 border border-muted/60 bg-white rounded-xl">
        <CardContent className="h-full flex items-center justify-center">
          <Loader2 className="animate-spin text-primary/20" />
        </CardContent>
      </Card>
    );
  }

  const {
    totalProcessingItems = 0,
    waitingCount = 0,
    preparingCount = 0,
    delayedCount = 0,
    preparingPercentage = 0,
  } = summary || {};

  return (
    <Card className="h-full border-none hover:ring-1 hover:ring-primary shadow-soft rounded-lg overflow-hidden bg-card transition-shadow hover:shadow-md">
      <CardHeader className="bg-linear-to-br from-primary to-primary/50 pb-6 pt-5 border-b border-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground">
            {t.KDS_BACKLOG}
          </CardTitle>
          <div className="bg-card p-2.5 rounded-full shadow-premium border border-muted/30">
            <ChefHat className="size-4.5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-end justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold tracking-tighter text-foreground">
              {totalProcessingItems}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t.PROCESSING_ITEMS(totalProcessingItems)}
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-primary">{waitingCount}</span>
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
            <div className="flex-1 bg-amber-100/50 p-3 rounded-2xl border border-amber-400/40 flex items-center gap-3">
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
          <div className="relative mt-4 p-3 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-3">
            <div className="p-1.5 bg-primary rounded-full">
              <Timer className="size-3.5 text-white" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-tight">
              {t.DELAYED_WARNING(delayedCount, 20)}
            </span>
            <span className="absolute -top-0.5 -right-0.5 flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
