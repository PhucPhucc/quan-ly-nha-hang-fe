"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import OrderBoardFilters from "@/components/features/order/orderBoard/OrderBoardFilters";
import OrderBoardTable from "@/components/features/order/orderBoard/OrderBoardTable";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService, PaginationParams } from "@/services/orderService";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

export default function OrderBoardClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const payload: PaginationParams = {
        pageNumber,
        pageSize,
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
        setError(response.message || UI_TEXT.ORDER.BOARD.FETCH_ERROR);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [pageNumber, search, statusFilter, typeFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !search || order.orderCode.toLowerCase().includes(search.trim().toLowerCase());

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

      const matchesType = typeFilter === "ALL" || order.orderType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchChange = (value: string) => {
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

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPageNumber(1);
  };

  return (
    <div className="flex flex-col gap-6 py-4 px-4 h-full">
      <OrderBoardFilters
        search={search}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        onReset={handleResetFilters}
      />

      <OrderBoardTable
        orders={filteredOrders}
        loading={loading}
        error={error}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={setPageNumber}
        onRetry={fetchOrders}
      />
    </div>
  );
}
