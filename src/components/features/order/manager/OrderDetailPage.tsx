"use client";

import { FileText, Loader2, LucideArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

import { OrderDetailsTabs } from "./components/OrderDetailsTabs";
import { useOrderDetailPage } from "./useOrderDetailPage";

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  const { detail, preCheckBill, loading } = useOrderDetailPage(orderId);
  const employeeRole = useAuthStore((state) => state.employee?.role);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-10 w-10 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Link href={employeeRole === EmployeeRole.CASHIER ? "/list" : "/manager/order"}>
              <LucideArrowLeft className="h-5 w-5 text-slate-500" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {detail?.orderCode || UI_TEXT.ORDER.DETAIL.TITLE}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {UI_TEXT.ORDER.DETAIL.DESCRIPTION_MANAGER}
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center rounded-lg border bg-white shadow-sm">
          <Loader2 className="mr-3 h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {UI_TEXT.ORDER.DETAIL.LOADING}
          </span>
        </div>
      )}

      {!loading && !detail && (
        <EmptyState
          title={UI_TEXT.ORDER.DETAIL.EMPTY_TITLE}
          description={UI_TEXT.ORDER.DETAIL.EMPTY_DESC}
          icon={FileText}
        />
      )}

      {!loading && detail && <OrderDetailsTabs current={detail} preCheckBill={preCheckBill} />}
    </div>
  );
}
