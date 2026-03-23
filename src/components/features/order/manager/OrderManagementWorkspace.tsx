"use client";

import {
  BarChart3,
  Clock3,
  CreditCard,
  RefreshCw,
  Search,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { type ComponentType, useCallback, useEffect, useMemo, useState } from "react";

import OrderBoardFilters from "@/components/features/order/orderBoard/OrderBoardFilters";
import OrderBoardTable from "@/components/features/order/orderBoard/OrderBoardTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { billingService } from "@/services/billingService";
import { orderService, PaginationParams } from "@/services/orderService";
import { BillingHistoryRecord } from "@/types/Billing";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

import BillingHistoryTable from "./BillingHistoryTable";
import OrderAuditLogPanel from "./OrderAuditLogPanel";
import OrderDetailsDrawer from "./OrderDetailsDrawer";

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function OrderManagementWorkspace() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingBilling, setLoadingBilling] = useState(true);
  const [errorOrders, setErrorOrders] = useState("");
  const [errorBilling, setErrorBilling] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [billingSearch, setBillingSearch] = useState("");
  const [billingTypeFilter, setBillingTypeFilter] = useState("ALL");
  const [billingPaymentFilter, setBillingPaymentFilter] = useState("ALL");
  const [billingPageNumber, setBillingPageNumber] = useState(1);
  const [billingTotalPages, setBillingTotalPages] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      setErrorOrders("");

      const payload: PaginationParams = {
        pageNumber,
        pageSize: 10,
        ...(search && { search }),
      };

      if (statusFilter !== "ALL") {
        payload.status = statusFilter as OrderStatus;
      }

      if (typeFilter !== "ALL") {
        payload.orderType = typeFilter as OrderType;
      }

      const response = await orderService.getOrders(payload);
      if (response.isSuccess && response.data) {
        setOrders(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setErrorOrders(response.message || UI_TEXT.ORDER.BOARD.FETCH_ERROR);
      }
    } catch (error) {
      setErrorOrders(getErrorMessage(error));
    } finally {
      setLoadingOrders(false);
    }
  }, [pageNumber, search, statusFilter, typeFilter]);

  const fetchBilling = useCallback(async () => {
    try {
      setLoadingBilling(true);
      setErrorBilling("");

      const response = await billingService.getBillingHistory({
        pageNumber: billingPageNumber,
        pageSize: 10,
        ...(billingSearch && { search: billingSearch }),
        ...(billingTypeFilter !== "ALL" && { orderType: billingTypeFilter as OrderType }),
        ...(billingPaymentFilter !== "ALL" && { paymentMethod: billingPaymentFilter }),
      });

      if (response.isSuccess && response.data) {
        setBillingHistory(response.data.items || []);
        setBillingTotalPages(response.data.totalPages || 1);
      } else {
        setErrorBilling(response.message || UI_TEXT.ORDER.BILLING.FETCH_ERROR);
      }
    } catch (error) {
      setErrorBilling(getErrorMessage(error));
    } finally {
      setLoadingBilling(false);
    }
  }, [billingPageNumber, billingPaymentFilter, billingSearch, billingTypeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const orderStats = useMemo(() => {
    const total = orders.length;
    const serving = orders.filter((order) => order.status === OrderStatus.Serving).length;
    const vip = orders.filter((order) => order.isPriority).length;
    const revenue = billingHistory.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
    return { total, serving, vip, revenue };
  }, [billingHistory, orders]);

  const handleOrderSearch = (value: string) => {
    setSearch(value);
    setPageNumber(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPageNumber(1);
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
    setPageNumber(1);
  };

  const resetOrderFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPageNumber(1);
  };

  const resetBillingFilters = () => {
    setBillingSearch("");
    setBillingTypeFilter("ALL");
    setBillingPaymentFilter("ALL");
    setBillingPageNumber(1);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4">
      <Card className="overflow-hidden border bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_92%,var(--primary)_8%)_0%,var(--card)_100%)]">
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 border-b">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-black">
              <Sparkles className="h-5 w-5 text-primary" />
              {UI_TEXT.ORDER.MANAGEMENT.WORKSPACE_TITLE}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {UI_TEXT.ORDER.MANAGEMENT.WORKSPACE_DESC}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              fetchOrders();
              fetchBilling();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {UI_TEXT.ORDER.MANAGEMENT.RELOAD}
          </Button>
        </CardHeader>

        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={BarChart3}
            label={UI_TEXT.ORDER.MANAGEMENT.STATS.TOTAL}
            value={String(orderStats.total)}
          />
          <MetricCard
            icon={UtensilsCrossed}
            label={UI_TEXT.ORDER.MANAGEMENT.STATS.SERVING}
            value={String(orderStats.serving)}
          />
          <MetricCard
            icon={CreditCard}
            label={UI_TEXT.ORDER.MANAGEMENT.STATS.REVENUE}
            value={money.format(orderStats.revenue)}
          />
          <MetricCard
            icon={Clock3}
            label={UI_TEXT.ORDER.MANAGEMENT.STATS.VIP}
            value={String(orderStats.vip)}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="orders" className="flex min-h-0 flex-1 flex-col gap-4">
        <TabsList className="w-full justify-start rounded-2xl border bg-card p-1">
          <TabsTrigger value="orders">{UI_TEXT.ORDER.MANAGEMENT.TABS.ORDERS}</TabsTrigger>
          <TabsTrigger value="billing">{UI_TEXT.ORDER.MANAGEMENT.TABS.BILLING}</TabsTrigger>
          <TabsTrigger value="audit">{UI_TEXT.ORDER.MANAGEMENT.TABS.AUDIT}</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="m-0 flex min-h-0 flex-1 flex-col gap-4">
          <OrderBoardFilters
            search={search}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onSearchChange={handleOrderSearch}
            onStatusChange={handleStatusChange}
            onTypeChange={handleTypeChange}
            onReset={resetOrderFilters}
          />

          <OrderBoardTable
            orders={orders}
            loading={loadingOrders}
            error={errorOrders}
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageChange={setPageNumber}
            onRetry={fetchOrders}
            onRowSelect={openDetails}
          />
        </TabsContent>

        <TabsContent value="billing" className="m-0 flex min-h-0 flex-1 flex-col gap-4">
          <Card>
            <CardContent className="grid gap-3 p-4 md:grid-cols-[1.2fr_auto_auto_auto_auto] md:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={billingSearch}
                  onChange={(e) => {
                    setBillingSearch(e.target.value);
                    setBillingPageNumber(1);
                  }}
                  placeholder={UI_TEXT.ORDER.BILLING.SEARCH_PLACEHOLDER}
                  className="pl-10"
                />
              </div>

              <Select
                value={billingTypeFilter}
                onValueChange={(value) => setBillingTypeFilter(value)}
              >
                <SelectTrigger className="h-10 w-full md:w-[180px]">
                  <SelectValue placeholder={UI_TEXT.ORDER.BILLING.TYPE_PLACEHOLDER} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{UI_TEXT.COMMON.ALL}</SelectItem>
                  <SelectItem value={OrderType.DineIn}>{UI_TEXT.ORDER.BILLING.DINE_IN}</SelectItem>
                  <SelectItem value={OrderType.Takeaway}>
                    {UI_TEXT.ORDER.BILLING.TAKEAWAY}
                  </SelectItem>
                  <SelectItem value={OrderType.Delivery}>
                    {UI_TEXT.ORDER.BILLING.DELIVERY}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={billingPaymentFilter}
                onValueChange={(value) => setBillingPaymentFilter(value)}
              >
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

              <Button variant="outline" onClick={resetBillingFilters}>
                {UI_TEXT.COMMON.RESET}
              </Button>
              <Button variant="outline" onClick={fetchBilling}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {UI_TEXT.ORDER.MANAGEMENT.RELOAD}
              </Button>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="table-pill table-pill-neutral border-0">
                  {UI_TEXT.ORDER.MANAGEMENT.PAGE_COUNT(billingTotalPages)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <BillingHistoryTable
            records={billingHistory}
            loading={loadingBilling}
            error={errorBilling}
            pageNumber={billingPageNumber}
            totalPages={billingTotalPages}
            onPageChange={setBillingPageNumber}
            onRetry={fetchBilling}
            onRowSelect={(record) => {
              const selected =
                orders.find((order) => order.orderId === record.orderId) ||
                ({
                  orderId: record.orderId,
                  orderCode: record.orderCode,
                  orderType: record.orderType as OrderType,
                  status: record.status as OrderStatus,
                  tableId: record.tableId,
                  totalAmount: record.totalAmount,
                  subTotal: record.subTotal,
                  vatRate: record.vatRate,
                  vatAmount: record.vatAmount,
                  paymentMethod: record.paymentMethod,
                  amountPaid: record.amountPaid,
                  paidAt: record.paidAt,
                  createdAt: record.createdAt,
                  isPriority: false,
                  orderItems: [],
                } as Order);
              setSelectedOrder(selected);
              setDetailsOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="audit" className="m-0 flex min-h-0 flex-1 flex-col gap-4">
          <OrderAuditLogPanel selectedOrder={selectedOrder} />
        </TabsContent>
      </Tabs>

      <OrderDetailsDrawer
        open={detailsOpen}
        order={selectedOrder}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) {
            setSelectedOrder(null);
          }
        }}
      />
    </div>
  );
}

function MetricCard({
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
