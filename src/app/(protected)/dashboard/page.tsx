"use client";

import { Clock, Cloud, Info, LayoutGrid, MapPin } from "lucide-react";
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

export default function DashboardPage() {
  const { employee } = useAuthStore();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const role = employee?.role || 0;
  const isManager = role === 1;
  const isChef = role === 4;
  const isCashier = role === 2;

  const getRoleName = () => {
    if (isManager) return UI_TEXT.ROLE.MANAGER;
    if (isChef) return UI_TEXT.ROLE.CHEF;
    if (isCashier) return UI_TEXT.ROLE.CASHIER;
    return UI_TEXT.ROLE.WAITER;
  };

  return (
    <div className="flex flex-col gap-6 py-6 pb-12">
      {/* Portal System Header */}
      <div className="flex flex-col gap-6 px-1 md:flex-row md:items-center md:justify-between lg:px-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 uppercase">
              {UI_TEXT.DASHBOARD.PORTAL_TITLE}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            {UI_TEXT.DASHBOARD.PORTAL_SUBTITLE}
          </p>
        </div>

        {/* Global System Status Widgets */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-slate-700 min-w-[70px]">
              {currentTime.toLocaleTimeString("en-US", { hour12: false })}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm">
            <Cloud className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-700">28°C / Có mây</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm">
            <MapPin className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold text-slate-700">Sảnh chính</span>
          </div>
        </div>
      </div>

      {/* 1. Global Performance Metrics */}
      <div className="px-3 lg:px-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            {UI_TEXT.DASHBOARD.OVERVIEW}
          </h2>
          <p className="text-xs text-muted-foreground ml-3">
            {UI_TEXT.DASHBOARD.USER_ROLE(getRoleName())}
          </p>
        </div>
        <StatsCards />
      </div>

      <div className="grid gap-6 lg:grid-cols-12 px-1 lg:px-4">
        {/* LEFT COLUMN: Operations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
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
                <span className="text-amber-400 font-bold">{UI_TEXT.DASHBOARD.STALE} (5m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
