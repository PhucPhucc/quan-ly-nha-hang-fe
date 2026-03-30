"use client";

import { CalendarClock, FileText, UserCircle2 } from "lucide-react";
import React from "react";

import OrderAuditLogPanel from "@/components/features/order/manager/OrderAuditLogPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn, formatCurrency } from "@/lib/utils";
import { PreCheckBill } from "@/types/Billing";
import { OrderItemStatus, OrderStatus } from "@/types/enums";
import { Order as OrderModel, OrderItemOptionGroup } from "@/types/Order";

const itemStatusClass = (status: OrderItemStatus) => {
  if (status === OrderItemStatus.Completed) return "table-pill-success";
  if (status === OrderItemStatus.Cancelled || status === OrderItemStatus.Rejected)
    return "table-pill-danger";
  if (status === OrderItemStatus.Cooking) return "table-pill-primary";
  return "table-pill-neutral";
};

const buildOptionLines = (groups?: OrderItemOptionGroup[]) =>
  (groups ?? []).flatMap((group) =>
    group.optionValues.map((value) => {
      const qty = value.quantity > 1 ? ` x${value.quantity}` : "";
      const extra =
        value.extraPriceSnapshot > 0 ? ` (+${formatCurrency(value.extraPriceSnapshot)})` : "";
      return `${group.groupNameSnapshot}: ${value.labelSnapshot}${qty}${extra}`;
    })
  );

function formatOrderType(orderType: string) {
  if (orderType === "DineIn") return UI_TEXT.ORDER.BILLING.DINE_IN;
  if (orderType === "Takeaway") return UI_TEXT.ORDER.BILLING.TAKEAWAY;
  if (orderType === "Delivery") return UI_TEXT.ORDER.BILLING.DELIVERY;
  return orderType;
}

interface OrderDetailsContentProps {
  current: OrderModel;
  preCheckBill: PreCheckBill | null;
  handleSplitBill?: (item: OrderModel["orderItems"][number]) => Promise<void>;
}

export function OrderDetailsTabs({
  current,
  preCheckBill,
  handleSplitBill,
}: OrderDetailsContentProps) {
  const { formatDateTime } = useBrandingFormatter();

  const itemTotal = (current?.orderItems ?? []).reduce(
    (sum, item) => sum + item.quantity * item.unitPriceSnapshot,
    0
  );

  const timeline = [
    { label: UI_TEXT.ORDER.DETAIL.TIMELINE_CREATE, value: formatDateTime(current.createdAt) },
    ...(current.updatedAt
      ? [{ label: UI_TEXT.ORDER.DETAIL.TIMELINE_UPDATE, value: formatDateTime(current.updatedAt) }]
      : []),
    ...(current.paidAt
      ? [{ label: UI_TEXT.ORDER.DETAIL.TIMELINE_PAID, value: formatDateTime(current.paidAt) }]
      : []),
    ...(current.completedAt
      ? [
          {
            label: UI_TEXT.ORDER.DETAIL.TIMELINE_COMPLETE,
            value: formatDateTime(current.completedAt),
          },
        ]
      : []),
    ...(current.cancelledAt
      ? [
          {
            label: UI_TEXT.ORDER.DETAIL.TIMELINE_CANCEL,
            value: formatDateTime(current.cancelledAt),
          },
        ]
      : []),
  ];

  return (
    <Tabs defaultValue="overview" className="flex flex-col gap-6">
      <TabsList className="w-full justify-start rounded-lg border bg-slate-50/50 p-1 backdrop-blur-sm">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <span>{UI_TEXT.ORDER.DETAIL.TAB_OVERVIEW}</span>
        </TabsTrigger>
        <TabsTrigger value="items" className="flex items-center gap-2">
          <span>{UI_TEXT.ORDER.DETAIL.TAB_ITEMS}</span>
          {current.orderItems?.length > 0 && (
            <Badge variant="secondary" className="h-5 min-w-[20px] px-1 text-[10px] font-bold">
              {current.orderItems.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="payment" className="flex items-center gap-2">
          <span>{UI_TEXT.ORDER.DETAIL.TAB_PAYMENT}</span>
        </TabsTrigger>
        <TabsTrigger value="audit" className="flex items-center gap-2">
          <span>{UI_TEXT.ORDER.DETAIL.TAB_AUDIT}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="m-0 focus-visible:outline-none">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            {/* Main Info Section */}
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                label={UI_TEXT.ORDER.DETAIL.ORDER_TYPE}
                value={formatOrderType(current.orderType)}
                icon={<FileText className="h-4 w-4" />}
              />
              <InfoCard
                label={UI_TEXT.ORDER.DETAIL.TABLE_RESERVATION}
                value={current.tableId || current.reservationId || UI_TEXT.ORDER.BILLING.TAKEAWAY}
                icon={<CalendarClock className="h-4 w-4" />}
              />
              <InfoCard
                label={UI_TEXT.ORDER.DETAIL.SUBTOTAL}
                value={formatCurrency(current.subTotal ?? itemTotal)}
              />
              <InfoCard
                label={UI_TEXT.ORDER.DETAIL.TOTAL_AMOUNT}
                value={formatCurrency(current.totalAmount)}
                isHighlight
              />
            </div>

            {/* Note, Customer & Promotional Section */}
            {(current.note ||
              current.promotionCode ||
              current.appliedVoucherCode ||
              current.giftItemName ||
              (current.discountAmount ?? 0) > 0 ||
              preCheckBill?.customerName ||
              preCheckBill?.customerPhone) && (
              <div className="rounded-lg border border-primary/10 bg-primary/5 p-5">
                <h3 className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="h-4 w-1 rounded-full bg-primary" />
                  {UI_TEXT.BUTTON.DETAIL}
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {(preCheckBill?.customerName || preCheckBill?.customerPhone) && (
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {UI_TEXT.ORDER.DETAIL.CUSTOMER_INFO}
                      </p>
                      <div className="flex gap-4">
                        {preCheckBill.customerName && (
                          <div className="rounded-lg border bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">
                            {preCheckBill.customerName}
                          </div>
                        )}
                        {preCheckBill.customerPhone && (
                          <div className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                            {preCheckBill.customerPhone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {current.note && (
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {UI_TEXT.ORDER.DETAIL.NOTE}
                      </p>
                      <p className="rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm">
                        {current.note}
                      </p>
                    </div>
                  )}
                  {current.promotionCode && (
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {UI_TEXT.ORDER.DETAIL.PROMOTION_CODE}
                      </p>
                      <Badge
                        variant="secondary"
                        className="px-3 py-1 font-mono text-sm uppercase tracking-tighter"
                      >
                        {current.promotionCode}
                      </Badge>
                    </div>
                  )}
                  {(current.appliedVoucherCode || current.voucher?.voucherCode) && (
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {UI_TEXT.ORDER.DETAIL.VOUCHER_CODE}
                      </p>
                      <Badge
                        variant="outline"
                        className="border-primary/30 px-3 py-1 font-mono text-sm uppercase tracking-tighter text-primary"
                      >
                        {current.appliedVoucherCode || current.voucher?.voucherCode}
                      </Badge>
                    </div>
                  )}
                  {current.giftItemName && (
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {UI_TEXT.VOUCHER.GIFT_TITLE}
                      </p>
                      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 shadow-sm">
                        <Badge
                          variant="outline"
                          className="border-emerald-300 bg-white text-emerald-700 font-semibold"
                        >
                          {UI_TEXT.VOUCHER.GIFT_LABEL}
                        </Badge>
                        <span className="text-sm font-semibold text-emerald-900">
                          {current.giftItemName}
                        </span>
                        {current.giftQuantity && current.giftQuantity > 1 && (
                          <span className="ml-auto text-xs font-bold text-emerald-700">
                            {UI_TEXT.COMMON.QUANTITY_X}
                            {current.giftQuantity}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {(current.discountAmount ?? 0) > 0 && (
                    <div className="space-y-1 text-right sm:col-span-1">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {UI_TEXT.ORDER.DETAIL.DISCOUNT_AMOUNT}
                      </p>
                      <p className="font-bold text-danger">
                        {UI_TEXT.COMMON.MINUS}
                        {formatCurrency(current.discountAmount!)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-50 p-2 text-primary border border-slate-100">
                <CalendarClock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{UI_TEXT.ORDER.DETAIL.TIMELINE_TITLE}</h3>
                <p className="text-sm text-muted-foreground">
                  {UI_TEXT.ORDER.DETAIL.TIMELINE_DESC}
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3">
              {timeline.map((row, idx) => (
                <div key={row.label} className="relative flex items-center justify-between pl-4">
                  {/* Timeline dot/line */}
                  <div className="absolute left-0 h-full w-[2px] bg-muted/40" />
                  <div
                    className={cn(
                      "absolute left-[-4px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-card",
                      idx === timeline.length - 1 ? "bg-primary" : "bg-muted"
                    )}
                  />

                  <span className="font-medium text-table-text-strong">{row.label}</span>
                  <span className="text-xs text-muted-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="items" className="m-0 focus-visible:outline-none">
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5 bg-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {UI_TEXT.ORDER.DETAIL.ITEMS_TITLE}
              </h3>
              <p className="text-sm text-muted-foreground">{UI_TEXT.ORDER.DETAIL.SECTION_NOTE}</p>
            </div>
          </div>
          <div className="divide-y">
            {(current.orderItems ?? []).map((item) => {
              const optionLines = buildOptionLines(item.optionGroups);
              return (
                <div
                  key={item.orderItemId}
                  className="group grid gap-6 px-6 py-5 transition-colors hover:bg-muted/30 xl:grid-cols-[1fr_auto]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-table-text-strong">
                            {item.itemNameSnapshot}
                          </h4>
                          {(item.isFreeItem || item.unitPriceSnapshot === 0) && (
                            <Badge
                              variant="outline"
                              className="border-emerald-200 bg-emerald-50 text-emerald-700"
                            >
                              {UI_TEXT.VOUCHER.GIFT_BADGE}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          <span className="inline-flex items-center rounded-md border px-1.5 py-0.5">
                            {item.itemCodeSnapshot}
                          </span>
                          <span aria-hidden className="opacity-30">
                            {UI_TEXT.COMMON.BULLET}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <UserCircle2 className="h-3 w-3" />
                            {item.stationSnapshot}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("table-pill border-0", itemStatusClass(item.status))}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/50 px-2 py-1 text-xs font-medium">
                        <span className="text-muted-foreground">
                          {UI_TEXT.ORDER.DETAIL.QTY_LABEL}
                        </span>
                        <span className="text-table-text-strong">{item.quantity}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/50 px-2 py-1 text-xs font-medium">
                        <span className="text-muted-foreground">
                          {UI_TEXT.ORDER.DETAIL.PRICE_LABEL}
                        </span>
                        <span className="text-table-text-strong">
                          {formatCurrency(item.isFreeItem ? 0 : item.unitPriceSnapshot)}
                        </span>
                      </div>
                    </div>

                    {item.itemOptions && (
                      <div className="rounded-xl border border-dashed border-primary/20 bg-primary/[0.02] px-3 py-2 text-sm text-table-text">
                        {item.itemOptions.split(";").join(", ")}
                      </div>
                    )}
                    {item.itemNote && (
                      <p className="rounded-xl border border-warning/20 bg-warning/5 px-3 py-2 text-sm italic text-warning-foreground">
                        <span className="font-semibold uppercase tracking-tighter not-italic">
                          {UI_TEXT.ORDER.DETAIL.NOTE_LABEL}
                        </span>{" "}
                        {item.itemNote}
                      </p>
                    )}
                    {optionLines.length > 0 && (
                      <div className="space-y-1.5 rounded-xl border bg-secondary/30 px-3 py-2.5">
                        {optionLines.map((line) => (
                          <div
                            key={line}
                            className="flex items-start gap-2 text-sm text-table-text-strong"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-primary/40" />
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {UI_TEXT.ORDER.DETAIL.LINE_TOTAL}
                      </p>
                      <p className="text-xl font-bold tracking-tight text-primary">
                        {formatCurrency(
                          item.isFreeItem ? 0 : item.quantity * item.unitPriceSnapshot
                        )}
                      </p>
                    </div>
                    {current.status === OrderStatus.Serving && handleSplitBill && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 gap-2 border-primary/20 hover:border-primary/50"
                        onClick={() => handleSplitBill(item)}
                      >
                        {UI_TEXT.ORDER.DETAIL.SPLIT_BILL}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {(current.orderItems ?? []).length === 0 && (
              <div className="px-5 py-20">
                <EmptyState
                  title={UI_TEXT.ORDER.DETAIL.ITEMS_EMPTY_TITLE}
                  description={UI_TEXT.ORDER.DETAIL.ITEMS_EMPTY_DESC}
                  icon={UserCircle2}
                />
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="payment" className="m-0 focus-visible:outline-none">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <div className="h-4 w-1.5 rounded-full bg-primary" />
              {UI_TEXT.ORDER.DETAIL.PAYMENT_TITLE}
            </h3>
            <Separator className="my-5" />
            <div className="space-y-4">
              <PaymentRow
                label={UI_TEXT.ORDER.DETAIL.PAYMENT_METHOD}
                value={current.paymentMethod || UI_TEXT.COMMON.NOT_APPLICABLE}
              />
              <PaymentRow
                label={UI_TEXT.ORDER.DETAIL.PAYMENT_RECEIVED}
                value={
                  current.amountPaid
                    ? formatCurrency(current.amountPaid)
                    : UI_TEXT.COMMON.NOT_APPLICABLE
                }
              />
              <PaymentRow
                label={UI_TEXT.ORDER.DETAIL.PAID_AT}
                value={formatDateTime(current.paidAt)}
              />
              <PaymentRow
                label={UI_TEXT.ORDER.DETAIL.VAT}
                value={formatCurrency(current.vatAmount ?? preCheckBill?.vat ?? 0)}
              />
              <Separator className="!my-2" />
              <div className="flex items-center justify-between py-2">
                <span className="text-base font-bold text-table-text-strong">
                  {UI_TEXT.ORDER.DETAIL.TOTAL_AMOUNT}
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary">
                  {formatCurrency(current.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <div className="h-4 w-1.5 rounded-full bg-emerald-500" />
              {UI_TEXT.ORDER.DETAIL.PRECHECK_TITLE}
            </h3>
            <Separator className="my-5" />
            {preCheckBill ? (
              <div className="space-y-4">
                <PaymentRow
                  label={UI_TEXT.ORDER.DETAIL.PRE_SUBTOTAL}
                  value={formatCurrency(preCheckBill.subTotal)}
                />
                <PaymentRow
                  label={UI_TEXT.ORDER.DETAIL.PRE_PRETAX}
                  value={formatCurrency(preCheckBill.preTaxAmount)}
                />
                {preCheckBill.discount > 0 && (
                  <PaymentRow
                    label={UI_TEXT.ORDER.DETAIL.DISCOUNT_AMOUNT}
                    value={`-${formatCurrency(preCheckBill.discount)}`}
                    className="text-danger"
                  />
                )}
                <PaymentRow
                  label={UI_TEXT.ORDER.DETAIL.PRE_VAT}
                  value={formatCurrency(preCheckBill.vat)}
                />
                <Separator className="!my-2" />
                <div className="flex items-center justify-between py-2">
                  <span className="text-base font-bold text-slate-900">
                    {UI_TEXT.ORDER.DETAIL.PRE_TOTAL}
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-emerald-600">
                    {formatCurrency(preCheckBill.totalAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <EmptyState
                title={UI_TEXT.ORDER.DETAIL.PRE_EMPTY_TITLE}
                description={UI_TEXT.ORDER.DETAIL.PRECHECK_DESC}
                icon={FileText}
                className="py-12"
              />
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="audit" className="m-0 focus-visible:outline-none">
        <OrderAuditLogPanel
          orderId={current.orderId}
          title={UI_TEXT.ORDER.DETAIL.AUDIT_TIMELINE}
          description={UI_TEXT.ORDER.DETAIL.AUDIT_BE_DESC}
        />
      </TabsContent>
    </Tabs>
  );
}

function InfoCard({
  label,
  value,
  icon,
  isHighlight = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isHighlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 transition-all shadow-sm",
        isHighlight
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-white hover:border-primary/30"
      )}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <div className={cn(isHighlight ? "text-primary-foreground/70" : "text-primary")}>
            {icon}
          </div>
        )}
        <p
          className={cn(
            "text-[10px] uppercase font-bold tracking-widest",
            isHighlight ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {label}
        </p>
      </div>
      <p
        className={cn(
          "mt-2 text-xl font-bold tracking-tight",
          isHighlight ? "text-primary-foreground" : "text-slate-900"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function PaymentRow({
  label,
  value,
  isStrong = false,
  className,
}: {
  label: string;
  value: string;
  isStrong?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className={cn("font-bold text-table-text-strong", isStrong && "text-base")}>
        {value}
      </span>
    </div>
  );
}
