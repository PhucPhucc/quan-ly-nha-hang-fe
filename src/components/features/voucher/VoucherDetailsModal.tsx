"use client";

import { Calendar, Clock, Gift, Hash, Percent, Tag, TrendingUp } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";
import { Voucher, VOUCHER_TYPE_OPTIONS, VoucherType } from "@/types/voucher";

interface VoucherDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: Voucher | null;
  onEdit: (voucher: Voucher) => void;
  onToggleStatus: (voucher: Voucher) => void;
}

const V = UI_TEXT.VOUCHER;
const C = UI_TEXT.COMMON;

const VoucherDetailsModal: React.FC<VoucherDetailsModalProps> = ({
  open,
  onOpenChange,
  voucher,
  onEdit,
  onToggleStatus,
}) => {
  if (!voucher) return null;

  const isActive = () => {
    const now = new Date();
    const endDate = new Date(voucher.endDate);
    if (endDate < now) return false;
    return voucher.isActive;
  };

  const getStatusLabel = () => {
    const now = new Date();
    if (new Date(voucher.endDate) < now) return V.STATUS_EXPIRED;
    if (!voucher.isActive) return V.STATUS_INACTIVE;
    return V.STATUS_ACTIVE;
  };

  const typeBadge = VOUCHER_TYPE_OPTIONS.find((o) => o.value === voucher.type);
  const active = isActive();
  const statusLabel = getStatusLabel();
  const usagePercent =
    voucher.usageLimit && voucher.usageLimit > 0
      ? Math.round((voucher.usedCount / voucher.usageLimit) * 100)
      : 0;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(C.LOCALE_VI, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0" + C.CURRENCY;
    return value.toLocaleString(C.LOCALE_VI) + C.CURRENCY;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[420px] flex flex-col h-full" side="right">
        <SheetHeader className="pb-4 pt-2 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg text-foreground">
              <Tag className="size-5 text-primary" />
              {V.DETAILS}
            </SheetTitle>
          </div>
          <SheetDescription asChild>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{V.STATUS_LABEL}</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`table-status-dot ${active ? "table-status-dot-active" : "table-status-dot-muted"}`}
                  />
                  <span
                    className={`text-xs font-medium ${active ? "table-status-text-active" : "table-status-text-muted"}`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {C.HASH}
                {voucher.promotionId.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 px-4 -mx-6">
          <div className="px-5 space-y-8">
            {/* Basic Info */}
            <section className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {V.DETAIL_BASIC}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  icon={<Hash className="size-4 text-primary" />}
                  label={V.DETAIL_CODE}
                  value={voucher.code}
                />
                <InfoCard
                  icon={<Tag className="size-4 text-primary" />}
                  label={V.DETAIL_NAME}
                  value={voucher.code || C.DASH}
                />
                <InfoCard
                  icon={<Percent className="size-4 text-primary" />}
                  label={V.DETAIL_TYPE}
                  value={
                    <span className="table-pill table-pill-primary border-0 text-[10px]">
                      {typeBadge?.label || voucher.type}
                    </span>
                  }
                />
                <InfoCard
                  icon={<TrendingUp className="size-4 text-primary" />}
                  label={V.DETAIL_VALUE}
                  value={
                    voucher.type === VoucherType.FreeItem
                      ? V.DETAIL_FREE_ITEM_LABEL
                      : voucher.type === VoucherType.Percent
                        ? `${voucher.value}${C.PERCENT}`
                        : formatCurrency(voucher.value)
                  }
                />
              </div>
            </section>

            {/* Conditions */}
            <section className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {V.DETAIL_CONDITIONS}
              </h4>
              <div className="space-y-2">
                <DetailRow
                  label={V.DETAIL_MIN_ORDER}
                  value={
                    voucher.minOrderValue && voucher.minOrderValue > 0
                      ? formatCurrency(voucher.minOrderValue)
                      : V.DETAIL_UNLIMITED
                  }
                />
                <DetailRow
                  label={V.DETAIL_MAX_DISCOUNT}
                  value={
                    voucher.maxDiscount && voucher.maxDiscount > 0
                      ? formatCurrency(voucher.maxDiscount)
                      : V.DETAIL_UNLIMITED
                  }
                />
                <DetailRow
                  icon={<Calendar className="size-3.5 text-muted-foreground" />}
                  label={V.DETAIL_TIME_RANGE}
                  value={`${formatDate(voucher.startDate)} ${C.MINUS} ${formatDate(voucher.endDate)}`}
                />
                <DetailRow
                  icon={<Clock className="size-3.5 text-muted-foreground" />}
                  label={V.DETAIL_TIME_OF_DAY}
                  value={
                    voucher.startTime && voucher.endTime
                      ? `${voucher.startTime} ${C.MINUS} ${voucher.endTime}`
                      : V.DETAIL_ALL_DAY
                  }
                />
                {voucher.type === VoucherType.FreeItem && (
                  <DetailRow
                    icon={<Gift className="size-3.5 text-muted-foreground" />}
                    label={V.DETAIL_FREE_ITEM}
                    value={
                      voucher.itemName
                        ? `${voucher.itemName} ${C.PAREN_LEFT}x${voucher.freeQuantity}${C.PAREN_RIGHT}`
                        : `ID${C.COLON} ${voucher.itemId || C.DASH} ${C.PAREN_LEFT}x${voucher.freeQuantity}${C.PAREN_RIGHT}`
                    }
                  />
                )}
              </div>
            </section>

            {/* Usage Statistics */}
            <section className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {V.DETAIL_STATS}
              </h4>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-foreground">{voucher.usedCount}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {C.SLASH} {voucher.usageLimit} {V.DETAIL_USED}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {usagePercent}
                    {C.PERCENT}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      usagePercent >= 90
                        ? "bg-danger"
                        : usagePercent >= 60
                          ? "bg-warning"
                          : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Enable / Disable */}
            <section className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{V.DETAIL_ENABLE}</p>
                  <p className="text-xs text-muted-foreground">{V.DETAIL_ENABLE_DESC}</p>
                </div>
                <Switch
                  checked={voucher.isActive}
                  onCheckedChange={() => onToggleStatus(voucher)}
                />
              </div>
            </section>
          </div>
        </div>

        <SheetFooter className="border-t border-border pt-4 gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            {V.ACTION_CLOSE}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onEdit(voucher);
              onOpenChange(false);
            }}
          >
            {V.ACTION_EDIT}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold text-foreground truncate">{value}</div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default VoucherDetailsModal;
