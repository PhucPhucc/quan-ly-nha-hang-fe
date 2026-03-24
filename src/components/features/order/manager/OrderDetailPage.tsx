"use client";

import { format } from "date-fns";
import { CalendarClock, FileText, Loader2, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import OrderAuditLogPanel from "@/components/features/order/manager/OrderAuditLogPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { billingService } from "@/services/billingService";
import { orderService } from "@/services/orderService";
import { PreCheckBill } from "@/types/Billing";
import { OrderItemStatus, OrderStatus } from "@/types/enums";
import { Order as OrderModel, OrderItemOptionGroup } from "@/types/Order";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  const [detail, setDetail] = useState<OrderModel | null>(null);
  const [preCheckBill, setPreCheckBill] = useState<PreCheckBill | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const detailRes = await orderService.getOrderById(orderId);
        if (!alive) return;
        if (detailRes.isSuccess && detailRes.data) {
          setDetail(detailRes.data);

          if (detailRes.data.status === OrderStatus.Serving) {
            const preRes = await billingService.getPreCheckBill(orderId);
            if (!alive) return;
            setPreCheckBill(preRes.isSuccess ? preRes.data : null);
          } else {
            setPreCheckBill(null);
          }
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [orderId]);

  const current = detail;
  const timeline = current
    ? [
        { label: UI_TEXT.ORDER.DETAIL.TIMELINE_CREATE, value: fmt(current.createdAt) },
        ...(current.updatedAt
          ? [{ label: UI_TEXT.ORDER.DETAIL.TIMELINE_UPDATE, value: fmt(current.updatedAt) }]
          : []),
        ...(current.paidAt
          ? [{ label: UI_TEXT.ORDER.DETAIL.TIMELINE_PAID, value: fmt(current.paidAt) }]
          : []),
        ...(current.completedAt
          ? [{ label: UI_TEXT.ORDER.DETAIL.TIMELINE_COMPLETE, value: fmt(current.completedAt) }]
          : []),
        ...(current.cancelledAt
          ? [{ label: UI_TEXT.ORDER.DETAIL.TIMELINE_CANCEL, value: fmt(current.cancelledAt) }]
          : []),
      ]
    : [];

  const itemTotal = (current?.orderItems ?? []).reduce(
    (sum, item) => sum + item.quantity * item.unitPriceSnapshot,
    0
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4">
      <Card className="overflow-hidden border bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_92%,var(--primary)_8%)_0%,var(--card)_100%)]">
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 border-b">
          <div>
            <CardTitle className="text-2xl font-black text-table-text-strong">
              {current?.orderCode || UI_TEXT.ORDER.DETAIL.TITLE}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {UI_TEXT.ORDER.DETAIL.DESCRIPTION_MANAGER}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/manager/order">{UI_TEXT.ORDER.DETAIL.BACK_TO_LIST}</Link>
          </Button>
        </CardHeader>
      </Card>

      {loading && (
        <div className="flex h-64 items-center justify-center rounded-2xl border bg-card">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
          <span className="text-muted-foreground">{UI_TEXT.ORDER.DETAIL.LOADING}</span>
        </div>
      )}

      {!loading && !current && (
        <EmptyState
          title={UI_TEXT.ORDER.DETAIL.EMPTY_TITLE}
          description={UI_TEXT.ORDER.DETAIL.EMPTY_DESC}
          icon={FileText}
        />
      )}

      {!loading && current && (
        <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col gap-4">
          <TabsList className="w-full justify-start rounded-2xl border bg-card p-1">
            <TabsTrigger value="overview">
              <span>{UI_TEXT.ORDER.DETAIL.TAB_OVERVIEW}</span>
            </TabsTrigger>
            <TabsTrigger value="items">
              <span>{UI_TEXT.ORDER.DETAIL.TAB_ITEMS}</span>
            </TabsTrigger>
            <TabsTrigger value="payment">
              <span>{UI_TEXT.ORDER.DETAIL.TAB_PAYMENT}</span>
            </TabsTrigger>
            <TabsTrigger value="audit">
              <span>{UI_TEXT.ORDER.DETAIL.TAB_AUDIT}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="m-0">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title={UI_TEXT.ORDER.DETAIL.ORDER_TYPE}
                  value={formatOrderType(current.orderType)}
                />
                <InfoCard
                  title={UI_TEXT.ORDER.DETAIL.TABLE_RESERVATION}
                  value={current.tableId || current.reservationId || UI_TEXT.ORDER.BILLING.TAKEAWAY}
                />
                <InfoCard
                  title={UI_TEXT.ORDER.DETAIL.SUBTOTAL}
                  value={money.format(current.subTotal ?? itemTotal)}
                />
                <InfoCard
                  title={UI_TEXT.ORDER.DETAIL.TOTAL_AMOUNT}
                  value={money.format(current.totalAmount)}
                />
              </div>

              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-table-text-strong">
                      {UI_TEXT.ORDER.DETAIL.TIMELINE_TITLE}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {UI_TEXT.ORDER.DETAIL.TIMELINE_DESC}
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  {timeline.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-xl border px-4 py-3"
                    >
                      <span className="font-medium text-table-text-strong">{row.label}</span>
                      <span className="text-sm text-muted-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>{UI_TEXT.ORDER.DETAIL.ITEMS_TITLE}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[60vh] pr-3">
                  <div className="divide-y">
                    {(current.orderItems ?? []).map((item) => {
                      const optionLines = buildOptionLines(item.optionGroups);
                      return (
                        <div
                          key={item.orderItemId}
                          className="grid gap-4 px-0 py-4 xl:grid-cols-[1fr_auto]"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-semibold text-table-text-strong">
                                  {item.itemNameSnapshot}
                                </h4>
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                  <span>{item.itemCodeSnapshot}</span>
                                  <span aria-hidden> {UI_TEXT.COMMON.BULLET} </span>
                                  <span>{item.stationSnapshot}</span>
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn("table-pill border-0", itemStatusClass(item.status))}
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="rounded-full bg-muted px-2 py-1">
                                {UI_TEXT.ORDER.DETAIL.QTY_LABEL} {item.quantity}
                              </span>
                              <span className="rounded-full bg-muted px-2 py-1">
                                {UI_TEXT.ORDER.DETAIL.PRICE_LABEL}{" "}
                                {money.format(item.unitPriceSnapshot)}
                              </span>
                            </div>
                            {item.itemOptions && (
                              <div className="rounded-xl border bg-secondary/30 px-3 py-2 text-sm text-table-text">
                                {item.itemOptions.split(";").join(", ")}
                              </div>
                            )}
                            {item.itemNote && (
                              <p className="rounded-xl border border-warning/20 bg-warning/10 px-3 py-2 text-sm">
                                {UI_TEXT.ORDER.DETAIL.NOTE_LABEL} {item.itemNote}
                              </p>
                            )}
                            {optionLines.length > 0 && (
                              <div className="space-y-1 rounded-xl border bg-secondary/30 px-3 py-2">
                                {optionLines.map((line) => (
                                  <div key={line} className="text-sm text-table-text">
                                    {UI_TEXT.COMMON.BULLET} {line}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {UI_TEXT.ORDER.DETAIL.LINE_TOTAL}
                            </p>
                            <p className="text-lg font-black text-primary">
                              {money.format(item.quantity * item.unitPriceSnapshot)}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {(current.orderItems ?? []).length === 0 && (
                      <div className="py-12">
                        <EmptyState
                          title={UI_TEXT.ORDER.DETAIL.ITEMS_EMPTY_TITLE}
                          description={UI_TEXT.ORDER.DETAIL.ITEMS_EMPTY_DESC}
                          icon={UserCircle2}
                        />
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="m-0">
            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="p-5">
                <h3 className="font-bold text-table-text-strong">
                  {UI_TEXT.ORDER.DETAIL.PAYMENT_TITLE}
                </h3>
                <Separator className="my-4" />
                <div className="space-y-3 text-sm">
                  <KeyValue
                    label={UI_TEXT.ORDER.DETAIL.PAYMENT_METHOD}
                    value={current.paymentMethod || UI_TEXT.COMMON.NOT_APPLICABLE}
                  />
                  <KeyValue
                    label={UI_TEXT.ORDER.DETAIL.PAYMENT_RECEIVED}
                    value={
                      current.amountPaid
                        ? money.format(current.amountPaid)
                        : UI_TEXT.COMMON.NOT_APPLICABLE
                    }
                  />
                  <KeyValue label={UI_TEXT.ORDER.DETAIL.PAID_AT} value={fmt(current.paidAt)} />
                  <KeyValue
                    label={UI_TEXT.ORDER.DETAIL.VAT}
                    value={money.format(current.vatAmount ?? preCheckBill?.vat ?? 0)}
                  />
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-bold text-table-text-strong">
                  {UI_TEXT.ORDER.DETAIL.PRECHECK_TITLE}
                </h3>
                <Separator className="my-4" />
                {preCheckBill ? (
                  <div className="space-y-3 text-sm">
                    <KeyValue
                      label={UI_TEXT.ORDER.DETAIL.PRE_SUBTOTAL}
                      value={money.format(preCheckBill.subTotal)}
                    />
                    <KeyValue
                      label={UI_TEXT.ORDER.DETAIL.PRE_PRETAX}
                      value={money.format(preCheckBill.preTaxAmount)}
                    />
                    <KeyValue
                      label={UI_TEXT.ORDER.DETAIL.PRE_VAT}
                      value={money.format(preCheckBill.vat)}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {UI_TEXT.ORDER.DETAIL.PRE_TOTAL}
                      </span>
                      <span className="text-lg font-black text-primary">
                        {money.format(preCheckBill.totalAmount)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title={UI_TEXT.ORDER.DETAIL.PRE_EMPTY_TITLE}
                    description={UI_TEXT.ORDER.DETAIL.PRECHECK_DESC}
                    icon={FileText}
                    className="py-8"
                  />
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="m-0">
            <OrderAuditLogPanel
              orderId={current.orderId}
              title={UI_TEXT.ORDER.DETAIL.AUDIT_TIMELINE}
              description={UI_TEXT.ORDER.DETAIL.AUDIT_BE_DESC}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function fmt(value?: string | null) {
  if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? UI_TEXT.COMMON.NOT_APPLICABLE
    : format(d, "dd/MM/yyyy HH:mm:ss");
}

function formatOrderType(orderType: string) {
  if (orderType === "DineIn") return UI_TEXT.ORDER.BILLING.DINE_IN;
  if (orderType === "Takeaway") return UI_TEXT.ORDER.BILLING.TAKEAWAY;
  if (orderType === "Delivery") return UI_TEXT.ORDER.BILLING.DELIVERY;
  return orderType;
}

function itemStatusClass(status: OrderItemStatus) {
  if (status === OrderItemStatus.Completed) return "table-pill-success";
  if (status === OrderItemStatus.Cancelled || status === OrderItemStatus.Rejected)
    return "table-pill-danger";
  if (status === OrderItemStatus.Cooking) return "table-pill-primary";
  return "table-pill-neutral";
}

function buildOptionLines(groups?: OrderItemOptionGroup[]) {
  return (groups ?? []).flatMap((group) =>
    group.optionValues.map((value) => {
      const qty = value.quantity > 1 ? ` x${value.quantity}` : "";
      const extra =
        value.extraPriceSnapshot > 0 ? ` (+${money.format(value.extraPriceSnapshot)})` : "";
      return `${group.groupNameSnapshot}: ${value.labelSnapshot}${qty}${extra}`;
    })
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      <p className="mt-1 font-semibold text-table-text-strong">{value}</p>
    </Card>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
