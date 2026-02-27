"use client";

import { Calendar, ChevronDown, Download, RefreshCw, Search } from "lucide-react";
import React, { useState } from "react";

import KDSAuditLogTable from "@/components/features/kds/KDSAuditLogTable";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

export default function KDSAuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockLogs = [
    {
      logId: "l1",
      time: "22:10 25/02",
      actorName: "Chef Toàn",
      actorRole: "ChefBar" as const,
      actionType: UI_TEXT.KDS.AUDIT.ACTION_REJECT,
      orderCode: "ORD-102",
      orderItems: "Phở Bò Tái Lăn (x2)",
      reason: "Hết nguyên liệu bò",
    },
    {
      logId: "l2",
      time: "22:05 25/02",
      actorName: "Chef Toàn",
      actorRole: "ChefBar" as const,
      actionType: UI_TEXT.KDS.AUDIT.ACTION_START,
      orderCode: "ORD-102",
      orderItems: "Phở Bò Tái Lăn (x2)",
      reason: "",
    },
    {
      logId: "l3",
      time: "22:00 25/02",
      actorName: "Barista Linh",
      actorRole: "Barista" as const,
      actionType: UI_TEXT.KDS.AUDIT.ACTION_DONE,
      orderCode: "ORD-101",
      orderItems: "Cafe Sữa Đá (x1)",
      reason: "",
    },
    {
      logId: "l4",
      time: "21:55 25/02",
      actorName: "Chef Hùng",
      actorRole: "ChefBar" as const,
      actionType: UI_TEXT.KDS.AUDIT.ACTION_START,
      orderCode: "ORD-100",
      orderItems: "Bún Chả Hà Nội (x3)",
      reason: "",
    },
    {
      logId: "l5",
      time: "21:50 25/02",
      actorName: "Chef Hùng",
      actorRole: "ChefBar" as const,
      actionType: UI_TEXT.KDS.AUDIT.ACTION_DONE,
      orderCode: "ORD-099",
      orderItems: "Nem Rán (x5)",
      reason: "",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      <header className="flex flex-col gap-6 px-4 md:px-8 pt-8 pb-6 bg-background z-10 shrink-0 border-b border-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">
              {UI_TEXT.KDS.NAV.AUDIT_LOG}
            </h2>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-70">
              {UI_TEXT.KDS.NAV.DESC_AUDIT}
            </p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder={UI_TEXT.KDS.NAV.SEARCH_PLACEHOLDER}
              className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-64 transition-all shadow-sm font-bold placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-tight"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative group">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 h-[42px] bg-card hover:border-primary/50 rounded-xl transition-all shadow-sm font-bold"
            >
              <span className="text-muted-foreground text-[10px] font-black uppercase tracking-tight">
                {UI_TEXT.KDS.NAV.FILTER_STATION}{" "}
                <span className="text-foreground">{UI_TEXT.KDS.NAV.STATION_ALL}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          <div className="relative group">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 h-[42px] bg-card hover:border-primary/50 rounded-xl transition-all shadow-sm font-bold"
            >
              <span className="text-muted-foreground text-[10px] font-black uppercase tracking-tight">
                {UI_TEXT.KDS.NAV.FILTER_ACTION}{" "}
                <span className="text-foreground">{UI_TEXT.KDS.NAV.ACTION_ALL}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          <div className="relative group">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 h-[42px] bg-card hover:border-primary/50 rounded-xl transition-all shadow-sm font-bold"
            >
              <span className="text-muted-foreground text-[10px] font-black uppercase tracking-tight">
                {UI_TEXT.KDS.NAV.FILTER_TIME}{" "}
                <span className="text-foreground">{UI_TEXT.KDS.NAV.TIME_TODAY}</span>
              </span>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5"
              title="EXPORT CSV"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5"
              title="RELOAD"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 md:px-8 pb-8 overflow-hidden flex flex-col">
        <KDSAuditLogTable logs={mockLogs} loading={false} error={null} />
      </div>
    </div>
  );
}
