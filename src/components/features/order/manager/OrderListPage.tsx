"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import OrderBoardFilters from "@/components/features/order/orderBoard/OrderBoardFilters";
import OrderBoardTable from "@/components/features/order/orderBoard/OrderBoardTable";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService, PaginationParams } from "@/services/orderService";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

export default function OrderListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params: PaginationParams = {
        pageNumber,
        pageSize: 10,
        ...(search && { search }),
      };

      if (statusFilter !== "ALL") params.status = statusFilter as OrderStatus;
      if (typeFilter !== "ALL") params.orderType = typeFilter as OrderType;

      const response = await orderService.getOrders(params);
      if (response.isSuccess && response.data) {
        setOrders(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || UI_TEXT.ORDER.BOARD.FETCH_ERROR);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [pageNumber, search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4">
      <OrderBoardFilters
        search={search}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onSearchChange={(value) => {
          setSearch(value);
          setPageNumber(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPageNumber(1);
        }}
        onTypeChange={(value) => {
          setTypeFilter(value);
          setPageNumber(1);
        }}
        onReset={() => {
          setSearch("");
          setStatusFilter("ALL");
          setTypeFilter("ALL");
          setPageNumber(1);
        }}
      />

      <OrderBoardTable
        orders={orders}
        loading={loading}
        error={error}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={setPageNumber}
        onRetry={fetchOrders}
        onRowSelect={(order) => router.push(`/manager/order/${order.orderId}`)}
      />
    </div>
  );
}
