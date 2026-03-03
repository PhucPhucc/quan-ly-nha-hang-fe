"use client";

import { Clock, Info, MapPin } from "lucide-react";
import React from "react";

import { RecentOrders } from "@/components/features/Dashboard/RecentOrders";
import { RevenueChart } from "@/components/features/Dashboard/RevenueChart";
import { SharedResources } from "@/components/features/Dashboard/SharedResources";
import { StatsCards } from "@/components/features/Dashboard/StatsCards";
import { TableStatusOverview } from "@/components/features/Dashboard/TableStatusOverview";
import { TeamAnnouncements } from "@/components/features/Dashboard/TeamAnnouncements";
import { TopDishes } from "@/components/features/Dashboard/TopDishes";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

export default function DashboardPage() {
  const { employee } = useAuthStore();
  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const role = employee?.role;
  const isManager = role === EmployeeRole.MANAGER; // Based on subagent finding "Admin Manager" in token
  const isChef = role === EmployeeRole.CHEFBAR;
  const isCashier = role === EmployeeRole.CASHIER;

  const getRoleName = () => {
    if (isManager) return UI_TEXT.ROLE.MANAGER;
    if (isChef) return UI_TEXT.ROLE.CHEF;
    if (isCashier) return UI_TEXT.ROLE.CASHIER;
    return UI_TEXT.ROLE.WAITER;
  };

  return (
    <div className="flex flex-col gap-8 py-4 pb-12">
      {/* Performance Summary Section */}
      <div className="px-3 lg:px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight uppercase">
              {UI_TEXT.DASHBOARD.OVERVIEW}
            </h2>
            <p className="text-xs text-muted-foreground font-normal">
              {UI_TEXT.DASHBOARD.USER_ROLE(getRoleName())}
            </p>
          </div>

          {/* Subtle System Info */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-full text-[10px] font-medium text-muted-foreground">
              <Clock className="size-3" />
              <span>
                {mounted && currentTime
                  ? currentTime.toLocaleTimeString("vi-VN", { hour12: false })
                  : "--:--:--"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-full text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              <MapPin className="size-3 text-rose-500" />
              <span>{UI_TEXT.DASHBOARD.MAIN_LOBBY}</span>
            </div>
          </div>
        </div>

        <StatsCards />
      </div>

      <div className="grid gap-6 lg:grid-cols-12 px-1 lg:px-4">
        {/* LEFT COLUMN: Operations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {UI_TEXT.DASHBOARD.PULSE}
            </h3>
            <TableStatusOverview />
          </div>

          {isManager || isCashier ? (
            <div className="flex flex-col gap-6">
              {isManager && <RevenueChart />}
              <RecentOrders />
            </div>
          ) : (
            <div className="flex-1 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Info className="h-8 w-8 text-primary/40" />
              </div>
              <h3 className="font-bold text-slate-600 mb-2">
                {UI_TEXT.DASHBOARD.OPERATIONAL_DATA_LOCKED}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                {UI_TEXT.DASHBOARD.LOCKED_DESC}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Team Hub */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <TeamAnnouncements />
          <SharedResources />
          {(isManager || isChef) && <TopDishes />}

          {/* Quick System Status */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              {UI_TEXT.DASHBOARD.SYSTEM_HEALTH}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="opacity-70">{UI_TEXT.DASHBOARD.POS_STATUS}</span>
                <span className="text-emerald-400 font-bold">{UI_TEXT.DASHBOARD.ONLINE}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="opacity-70">{UI_TEXT.DASHBOARD.PRINTER_STATUS}</span>
                <span className="text-emerald-400 font-bold">{UI_TEXT.DASHBOARD.READY}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="opacity-70">{UI_TEXT.DASHBOARD.INVENTORY_SYNC}</span>
                <span className="text-amber-400 font-bold">
                  {UI_TEXT.DASHBOARD.STALE} {UI_TEXT.DASHBOARD.STALE_DURATION(5)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
