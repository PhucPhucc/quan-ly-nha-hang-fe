"use client";

import { RefreshCw, Sparkles } from "lucide-react";
import React from "react";

import OrderBoardFilters from "@/components/features/order/orderBoard/OrderBoardFilters";
import OrderBoardTable from "@/components/features/order/orderBoard/OrderBoardTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";

import BillingHistoryTable from "./BillingHistoryTable";
import { OrderBillingFilters, OrderMetricCards } from "./components/WorkspaceComponents";
import OrderAuditLogPanel from "./OrderAuditLogPanel";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import { useOrderManagementWorkspace } from "./useOrderManagementWorkspace";

export default function OrderManagementWorkspace() {
  const {
    orders,
    billingHistory,
    loadingOrders,
    loadingBilling,
    errorOrders,
    errorBilling,
    search,
    statusFilter,
    typeFilter,
    pageNumber,
    totalPages,
    billingSearch,
    setBillingSearch,
    billingTypeFilter,
    setBillingTypeFilter,
    billingPaymentFilter,
    setBillingPaymentFilter,
    billingPageNumber,
    setBillingPageNumber,
    billingTotalPages,
    selectedOrder,
    setSelectedOrder,
    detailsOpen,
    setDetailsOpen,
    fetchOrders,
    fetchBilling,
    openDetails,
    orderStats,
    handleOrderSearch,
    handleStatusChange,
    handleTypeChange,
    resetOrderFilters,
    resetBillingFilters,
    handleBillingRowSelect,
    setPageNumber,
  } = useOrderManagementWorkspace();

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
        <OrderMetricCards stats={orderStats} />
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
          <OrderBillingFilters
            search={billingSearch}
            setSearch={setBillingSearch}
            setPageNumber={setBillingPageNumber}
            typeFilter={billingTypeFilter}
            setTypeFilter={setBillingTypeFilter}
            paymentFilter={billingPaymentFilter}
            setPaymentFilter={setBillingPaymentFilter}
            onReset={resetBillingFilters}
            onReload={fetchBilling}
            totalPages={billingTotalPages}
          />

          <BillingHistoryTable
            records={billingHistory}
            loading={loadingBilling}
            error={errorBilling}
            pageNumber={billingPageNumber}
            totalPages={billingTotalPages}
            onPageChange={setBillingPageNumber}
            onRetry={fetchBilling}
            onRowSelect={handleBillingRowSelect}
          />
        </TabsContent>

        <TabsContent value="audit" className="m-0 flex min-h-0 flex-1 flex-col gap-4">
          <OrderAuditLogPanel
            globalMode
            title={UI_TEXT.ORDER.MANAGEMENT.TABS.AUDIT}
            description={UI_TEXT.AUDIT_LOG.PANEL_DESC}
          />
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
