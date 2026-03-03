"use client";

import { Calendar, ChevronDown, Download, RefreshCw, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import KDSAuditLogTable from "@/components/features/kds/KDSAuditLogTable";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { KdsAuditLogResponse, kdsService } from "@/services/kdsService";

interface KDSAuditLogData {
  logId: string;
  time: string;
  actorName: string;
  actorRole: "ChefBar" | "Barista";
  actionType: string;
  orderCode: string;
  orderItems: string;
  reason: string;
}

export default function KDSAuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<KdsAuditLogResponse[]>([]);
  const [station, setStation] = useState<string>("all");
  const [action, setAction] = useState<string>("all");

  const mapToTableData = (apiLogs: KdsAuditLogResponse[]): KDSAuditLogData[] => {
    return apiLogs.map((log) => ({
      logId: log.logId,
      time: log.formattedTime,
      actorName: log.actorName,
      actorRole: (log.actorRole === "ChefBar" || log.actorRole === "Barista"
        ? log.actorRole
        : "ChefBar") as "ChefBar" | "Barista",
      actionType: log.action,
      orderCode: log.orderCode,
      orderItems: log.orderItems,
      reason: log.reason || "",
    }));
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await kdsService.getAuditLogs({
        station: station === "all" ? undefined : station,
        action: action === "all" ? undefined : action,
      });

      if (result.isSuccess && result.data) {
        setLogs(result.data);
      } else {
        setError(result.error?.message || "Failed to fetch audit logs");
      }
    } catch (err) {
      setError("An error occurred while fetching audit logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [station, action]);

  const handleRefresh = () => {
    fetchAuditLogs();
  };

  const tableData = mapToTableData(logs);
  const filteredLogs = searchQuery
    ? tableData.filter(
        (log) =>
          log.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.orderItems.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tableData;

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
              onClick={() => {
                const stations = ["all", "HotKitchen", "ColdKitchen", "Bar"];
                const currentIndex = stations.indexOf(station);
                const nextStation = stations[(currentIndex + 1) % stations.length];
                setStation(nextStation);
              }}
            >
              <span className="text-muted-foreground text-[10px] font-black uppercase tracking-tight">
                {UI_TEXT.KDS.NAV.FILTER_STATION}{" "}
                <span className="text-foreground">
                  {station === "all" ? UI_TEXT.KDS.NAV.STATION_ALL : station}
                </span>
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          <div className="relative group">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 h-[42px] bg-card hover:border-primary/50 rounded-xl transition-all shadow-sm font-bold"
              onClick={() => {
                const actions = [
                  "all",
                  "KDS_START_COOKING",
                  "KDS_MARK_READY",
                  "KDS_REJECT",
                  "KDS_RETURN",
                ];
                const currentIndex = actions.indexOf(action);
                const nextAction = actions[(currentIndex + 1) % actions.length];
                setAction(nextAction);
              }}
            >
              <span className="text-muted-foreground text-[10px] font-black uppercase tracking-tight">
                {UI_TEXT.KDS.NAV.FILTER_ACTION}{" "}
                <span className="text-foreground">
                  {action === "all" ? UI_TEXT.KDS.NAV.ACTION_ALL : action.replace("KDS_", "")}
                </span>
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
              onClick={handleRefresh}
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 md:px-8 pb-8 overflow-hidden flex flex-col">
        <KDSAuditLogTable logs={filteredLogs} loading={loading} error={error} />
      </div>
    </div>
  );
}
