"use client";

import { RecentOrders } from "@/components/features/Dashboard/RecentOrders";
import { RevenueChart } from "@/components/features/Dashboard/RevenueChart";
import { StatsCards } from "@/components/features/Dashboard/StatsCards";
import { TableStatusOverview } from "@/components/features/Dashboard/TableStatusOverview";
import { TopDishes } from "@/components/features/Dashboard/TopDishes";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { employee } = useAuthStore();
  const role = employee?.role || 0;

  const isManager = role === 1;
  const isChef = role === 4;
  const isCashier = role === 2;

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome back! You are logged in as a{" "}
          <span className="font-bold text-primary">
            {isManager ? "Manager" : isChef ? "Chef" : isCashier ? "Cashier" : "Staff"}
          </span>
        </p>
      </div>

      {/* Stats Summary - Visible to Manager and Cashier */}
      {(isManager || isCashier) && <StatsCards />}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Charts & Analysis */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {isManager && <RevenueChart />}
          {(isManager || isCashier) && <RecentOrders />}
          {/* If waiter/chef, show something else or expand table overview */}
          {!isManager && !isCashier && (
            <div className="flex-1 rounded-2xl border-2 border-dashed border-muted flex items-center justify-center p-12 text-center text-muted-foreground">
              <p>Operational data is restricted to management and billing staff.</p>
            </div>
          )}
        </div>

        {/* Right Column: Status & Activity */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <TableStatusOverview />
          {(isManager || isChef) && <TopDishes />}

          {/* Recent Activity Mini-Card - Priority for Waiters/Chefs */}
          <div className="rounded-xl border-none bg-linear-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />
            <h3 className="mb-2 font-bold italic">Active Notice</h3>
            <p className="text-indigo-100 text-sm leading-relaxed relative z-10">
              {isChef
                ? "Kitchen: 3 new orders pending preparation. Check KDS for details."
                : "Staff: Table T-05 has been reserved for 7 PM. Ensure setup is ready."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
