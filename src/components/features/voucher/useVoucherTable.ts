"use client";

import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "@/lib/error";
import { voucherService } from "@/services/voucherService";
import { Voucher } from "@/types/voucher";

export function useVoucherTable(refreshKey: number) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filters: string[] = [];
      if (typeFilter !== "all") {
        filters.push(`type:${typeFilter}`);
      }
      if (statusFilter !== "all") {
        filters.push(`isActive:${statusFilter}`);
      }
      console.log(filters);
      const res = await voucherService.getAll({
        pageNumber: currentPage,
        pageSize,
        search: debouncedSearch || undefined,
        filters: filters.length > 0 ? filters : undefined,
      });

      if (res.isSuccess && res.data) {
        setVouchers(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalCount || 0);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, typeFilter, statusFilter]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers, refreshKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, typeFilter, statusFilter]);

  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      await voucherService.toggleStatus(voucher.promotionId, !voucher.isActive);
      setVouchers((prev) =>
        prev.map((v) =>
          v.promotionId === voucher.promotionId ? { ...v, isActive: !v.isActive } : v
        )
      );
    } catch (err) {
      console.error("Failed to toggle voucher status:", err);
    }
  };

  const handleDelete = async (voucherId: string) => {
    try {
      await voucherService.delete(voucherId);
      fetchVouchers();
    } catch (err) {
      console.error("Failed to delete voucher:", err);
    }
  };

  const activeCount = vouchers.filter((v) => {
    const now = new Date();
    return v.isActive && new Date(v.endDate) >= now;
  }).length;
  const inactiveCount = vouchers.length - activeCount;

  return {
    vouchers,
    loading,
    error,
    search,
    setSearch,
    setDebouncedSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    pageSize,
    activeCount,
    inactiveCount,
    handleToggleStatus,
    handleDelete,
    fetchVouchers,
  };
}
