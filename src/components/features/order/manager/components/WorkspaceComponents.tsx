"use client";

import { BarChart3, CreditCard, RefreshCw, Search, UtensilsCrossed } from "lucide-react";
import { type ComponentType } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { OrderType } from "@/types/enums";

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="text-lg font-black text-table-text-strong">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function OrderMetricCards({
  stats,
}: {
  stats: { total: number; serving: number; revenue: number; vip: number };
}) {
  return (
    <CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={BarChart3}
        label={UI_TEXT.ORDER.MANAGEMENT.STATS.TOTAL}
        value={String(stats.total)}
      />
      <MetricCard
        icon={UtensilsCrossed}
        label={UI_TEXT.ORDER.MANAGEMENT.STATS.SERVING}
        value={String(stats.serving)}
      />
      <MetricCard
        icon={CreditCard}
        label={UI_TEXT.ORDER.MANAGEMENT.STATS.REVENUE}
        value={money.format(stats.revenue)}
      />
    </CardContent>
  );
}

interface OrderBillingFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  setPageNumber: (num: number) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  paymentFilter: string;
  setPaymentFilter: (val: string) => void;
  onReset: () => void;
  onReload: () => void;
  totalPages: number;
}

export function OrderBillingFilters({
  search,
  setSearch,
  setPageNumber,
  typeFilter,
  setTypeFilter,
  paymentFilter,
  setPaymentFilter,
  onReset,
  onReload,
  totalPages,
}: OrderBillingFiltersProps) {
  return (
    <Card>
      <CardContent className="grid gap-3 p-4 md:grid-cols-[1.2fr_auto_auto_auto_auto] md:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNumber(1);
            }}
            placeholder={UI_TEXT.ORDER.BILLING.SEARCH_PLACEHOLDER}
            className="pl-10"
          />
        </div>

        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
          <SelectTrigger className="h-10 w-full md:w-[180px]">
            <SelectValue placeholder={UI_TEXT.ORDER.BILLING.TYPE_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{UI_TEXT.COMMON.ALL}</SelectItem>
            <SelectItem value={OrderType.DineIn}>{UI_TEXT.ORDER.BILLING.DINE_IN}</SelectItem>
            <SelectItem value={OrderType.Takeaway}>{UI_TEXT.ORDER.BILLING.TAKEAWAY}</SelectItem>
            <SelectItem value={OrderType.Delivery}>{UI_TEXT.ORDER.BILLING.DELIVERY}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={(value) => setPaymentFilter(value)}>
          <SelectTrigger className="h-10 w-full md:w-[180px]">
            <SelectValue placeholder={UI_TEXT.ORDER.BILLING.METHOD_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{UI_TEXT.ORDER.BILLING.ALL_METHODS}</SelectItem>
            <SelectItem value="Cash">{UI_TEXT.ORDER.BILLING.CASH}</SelectItem>
            <SelectItem value="BankTransfer">{UI_TEXT.ORDER.BILLING.TRANSFER}</SelectItem>
            <SelectItem value="CreditCard">{UI_TEXT.ORDER.BILLING.CARD}</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onReset}>
          {UI_TEXT.COMMON.RESET}
        </Button>
        <Button variant="outline" onClick={onReload}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {UI_TEXT.ORDER.MANAGEMENT.RELOAD}
        </Button>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="table-pill table-pill-neutral border-0">
            {UI_TEXT.ORDER.MANAGEMENT.PAGE_COUNT(totalPages)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
