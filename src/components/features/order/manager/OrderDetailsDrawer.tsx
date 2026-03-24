"use client";

import { format } from "date-fns";
import { CalendarClock, FileText, Loader2, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import OrderAuditLogPanel from "@/components/features/order/manager/OrderAuditLogPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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

interface OrderDetailsDrawerProps {
  open: boolean;
  order: OrderModel | null;
  onOpenChange: (open: boolean) => void;
}

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const fmt = (value?: string | null) => {
  if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? UI_TEXT.COMMON.NOT_APPLICABLE
    : format(d, "dd/MM/yyyy HH:mm:ss");
};

const itemStatusClass = (status: OrderItemStatus) => {
  if (status === OrderItemStatus.Completed) return "table-pill-success";
  if (status === OrderItemStatus.Cancelled || status === OrderItemStatus.Rejected)
    return "table-pill-danger";
  if (status === OrderItemStatus.Cooking) return "table-pill-primary";
  return "table-pill-neutral";
};

const orderStatusClass = (status: string) => {
  if (status === OrderStatus.Completed) return "table-pill-success";
  if (status === OrderStatus.Cancelled) return "table-pill-danger";
  if (status === OrderStatus.Paid) return "table-pill-info";
  if (status === OrderStatus.Serving) return "table-pill-primary";
  return "table-pill-neutral";
};

const buildOptionLines = (groups?: OrderItemOptionGroup[]) =>
  (groups ?? []).flatMap((group) =>
    group.optionValues.map((value) => {
      const qty = value.quantity > 1 ? ` x${value.quantity}` : "";
      const extra =
        value.extraPriceSnapshot > 0 ? ` (+${money.format(value.extraPriceSnapshot)})` : "";
      return `${group.groupNameSnapshot}: ${value.labelSnapshot}${qty}${extra}`;
    })
  );

export default function OrderDetailsDrawer({ open, order, onOpenChange }: OrderDetailsDrawerProps) {
  const [detail, setDetail] = useState<OrderModel | null>(null);
  const [preCheckBill, setPreCheckBill] = useState<PreCheckBill | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!open || !order) return;
      setLoading(true);
      try {
        const detailRes = await orderService.getOrderById(order.orderId);
        if (!alive) return;
        setDetail(detailRes.isSuccess && detailRes.data ? detailRes.data : order);

        if (order.status === OrderStatus.Serving) {
          const preRes = await billingService.getPreCheckBill(order.orderId);
          if (!alive) return;
          setPreCheckBill(preRes.isSuccess ? preRes.data : null);
        } else {
          setPreCheckBill(null);
        }
      } catch {
        if (alive) {
          setDetail(order);
          setPreCheckBill(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [open, order]);

  const current = detail ?? order;
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

  const handleSplitBill = async (item: OrderModel["orderItems"][number]) => {
    const raw = window.prompt(UI_TEXT.ORDER.DETAIL.SPLIT_BILL_PROMPT(item.itemNameSnapshot), "1");
    if (raw == null) return;

    const quantity = Number(raw);
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > item.quantity) {
      window.alert(UI_TEXT.ORDER.DETAIL.SPLIT_BILL_INVALID_QTY);
      return;
    }

    const response = await billingService.splitBill(order!.orderId, {
      itemsToSplit: [{ orderItemId: item.orderItemId, quantityToSplit: quantity }],
    });

    if (!response.isSuccess) {
      window.alert(response.message || UI_TEXT.ORDER.DETAIL.SPLIT_BILL_FAILED);
      return;
    }

    window.alert(UI_TEXT.ORDER.DETAIL.SPLIT_BILL_SUCCESS);
  };

  const itemTotal = (current?.orderItems ?? []).reduce(
    (sum, item) => sum + item.quantity * item.unitPriceSnapshot,
    0
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full p-0 sm:max-w-[92vw]">
        <div className="flex h-full min-h-0 flex-col">
          <DrawerHeader className="border-b px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DrawerTitle className="text-2xl font-black text-table-text-strong">
                  {current?.orderCode || UI_TEXT.ORDER.DETAIL.TITLE}
                </DrawerTitle>
                <div className="mt-2 flex flex-wrap gap-2">
                  {current && (
                    <Badge
                      variant="outline"
                      className={cn("table-pill border-0", orderStatusClass(current.status))}
                    >
                      {current.status}
                    </Badge>
                  )}
                  {current?.isPriority && (
                    <Badge variant="outline" className="table-pill table-pill-danger border-0">
                      {UI_TEXT.ORDER.BOARD.VIP}
                    </Badge>
                  )}
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="outline">{UI_TEXT.COMMON.CLOSE}</Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-6 px-6 py-5">
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
                <Tabs defaultValue="overview" className="flex flex-col gap-4">
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
                        <div className="rounded-2xl border bg-card p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {UI_TEXT.ORDER.DETAIL.ORDER_TYPE}
                          </p>
                          <p className="mt-1 font-semibold text-table-text-strong">
                            {formatOrderType(current.orderType)}
                          </p>
                        </div>
                        <div className="rounded-2xl border bg-card p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {UI_TEXT.ORDER.DETAIL.TABLE_RESERVATION}
                          </p>
                          <p className="mt-1 font-semibold text-table-text-strong">
                            {current.tableId ||
                              current.reservationId ||
                              UI_TEXT.ORDER.BILLING.TAKEAWAY}
                          </p>
                        </div>
                        <div className="rounded-2xl border bg-card p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {UI_TEXT.ORDER.DETAIL.SUBTOTAL}
                          </p>
                          <p className="mt-1 font-semibold text-table-text-strong">
                            {money.format(current.subTotal ?? itemTotal)}
                          </p>
                        </div>
                        <div className="rounded-2xl border bg-card p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {UI_TEXT.ORDER.DETAIL.TOTAL_AMOUNT}
                          </p>
                          <p className="mt-1 font-semibold text-table-text-strong">
                            {money.format(current.totalAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-card p-5">
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
                              <span className="font-medium text-table-text-strong">
                                {row.label}
                              </span>
                              <span className="text-sm text-muted-foreground">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="items" className="m-0">
                    <div className="rounded-2xl border bg-card">
                      <div className="border-b px-5 py-4">
                        <h3 className="font-bold text-table-text-strong">
                          {UI_TEXT.ORDER.DETAIL.ITEMS_TITLE}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {UI_TEXT.ORDER.DETAIL.SECTION_NOTE}
                        </p>
                      </div>
                      <div className="divide-y">
                        {(current.orderItems ?? []).map((item) => {
                          const optionLines = buildOptionLines(item.optionGroups);
                          return (
                            <div
                              key={item.orderItemId}
                              className="grid gap-4 px-5 py-4 xl:grid-cols-[1fr_auto]"
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
                                    className={cn(
                                      "table-pill border-0",
                                      itemStatusClass(item.status)
                                    )}
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
                                        <span aria-hidden>{UI_TEXT.COMMON.BULLET} </span>
                                        <span>{line}</span>
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
                                {current.status === OrderStatus.Serving && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
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
                          <div className="px-5 py-12">
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

                  <TabsContent value="payment" className="m-0">
                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="rounded-2xl border bg-card p-5">
                        <h3 className="font-bold text-table-text-strong">
                          {UI_TEXT.ORDER.DETAIL.PAYMENT_TITLE}
                        </h3>
                        <Separator className="my-4" />
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {UI_TEXT.ORDER.DETAIL.PAYMENT_METHOD}
                            </span>
                            <span className="font-medium">
                              {current.paymentMethod || UI_TEXT.COMMON.NOT_APPLICABLE}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {UI_TEXT.ORDER.DETAIL.PAYMENT_RECEIVED}
                            </span>
                            <span className="font-medium">
                              {current.amountPaid
                                ? money.format(current.amountPaid)
                                : UI_TEXT.COMMON.NOT_APPLICABLE}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {UI_TEXT.ORDER.DETAIL.PAID_AT}
                            </span>
                            <span className="font-medium">{fmt(current.paidAt)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {UI_TEXT.ORDER.DETAIL.VAT}
                            </span>
                            <span className="font-medium">
                              {money.format(current.vatAmount ?? preCheckBill?.vat ?? 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-card p-5">
                        <h3 className="font-bold text-table-text-strong">
                          {UI_TEXT.ORDER.DETAIL.PRECHECK_TITLE}
                        </h3>
                        <Separator className="my-4" />
                        {preCheckBill ? (
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {UI_TEXT.ORDER.DETAIL.PRE_SUBTOTAL}
                              </span>
                              <span className="font-semibold">
                                {money.format(preCheckBill.subTotal)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {UI_TEXT.ORDER.DETAIL.PRE_PRETAX}
                              </span>
                              <span className="font-semibold">
                                {money.format(preCheckBill.preTaxAmount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {UI_TEXT.ORDER.DETAIL.PRE_VAT}
                              </span>
                              <span className="font-semibold">
                                {money.format(preCheckBill.vat)}
                              </span>
                            </div>
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
                      </div>
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
          </ScrollArea>

          <DrawerFooter className="border-t px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                {current?.orderItems?.length
                  ? UI_TEXT.ORDER.DETAIL.ITEM_COUNT(current.orderItems.length)
                  : UI_TEXT.ORDER.DETAIL.ITEMS_EMPTY_TITLE}
              </span>
              <DrawerClose asChild>
                <Button variant="outline">{UI_TEXT.COMMON.CLOSE}</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function formatOrderType(orderType: string) {
  if (orderType === "DineIn") return UI_TEXT.ORDER.BILLING.DINE_IN;
  if (orderType === "Takeaway") return UI_TEXT.ORDER.BILLING.TAKEAWAY;
  if (orderType === "Delivery") return UI_TEXT.ORDER.BILLING.DELIVERY;
  return orderType;
}
