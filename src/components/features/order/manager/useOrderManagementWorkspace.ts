"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { billingService } from "@/services/billingService";
import { orderService, PaginationParams } from "@/services/orderService";
import { BillingHistoryRecord } from "@/types/Billing";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

export function useOrderManagementWorkspace() {
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
    if (typeof window !== "undefined") {
      window.localStorage.setItem("foodhub:lastAuditOrderId", order.orderId);
    }
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

  const handleBillingRowSelect = (record: BillingHistoryRecord) => {
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
  };

  return {
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
  };
}
