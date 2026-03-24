"use client";

import { Plus, Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import TableSkeleton from "@/components/shared/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { voucherService } from "@/services/voucherService";
import { Voucher, VOUCHER_TYPE_OPTIONS, VoucherType } from "@/types/voucher";

import VoucherAction from "./VoucherAction";

interface VoucherTableProps {
  onView: (voucher: Voucher) => void;
  onEdit: (voucher: Voucher) => void;
  onCreate: () => void;
  refreshKey: number;
}

const V = UI_TEXT.VOUCHER;
const C = UI_TEXT.COMMON;

const VoucherTable: React.FC<VoucherTableProps> = ({ onView, onEdit, onCreate, refreshKey }) => {
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
    void refreshKey;
    try {
      setLoading(true);
      setError("");

      const filters: string[] = [];
      if (typeFilter !== "all") {
        filters.push(`voucherType==${typeFilter}`);
      }
      if (statusFilter !== "all") {
        filters.push(`isActive==${statusFilter}`);
      }

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
  }, [currentPage, debouncedSearch, typeFilter, statusFilter, refreshKey]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

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

  const handleDelete = async (voucher: Voucher) => {
    if (!confirm(V.DELETE_CONFIRM(voucher.code))) return;
    try {
      await voucherService.delete(voucher.promotionId);
      fetchVouchers();
    } catch (err) {
      console.error("Failed to delete voucher:", err);
    }
  };

  const isVoucherActive = (voucher: Voucher) => {
    const now = new Date();
    return voucher.isActive && new Date(voucher.endDate) >= now;
  };

  const getStatusLabel = (voucher: Voucher) => {
    const now = new Date();
    if (new Date(voucher.endDate) < now) return V.STATUS_EXPIRED;
    if (!voucher.isActive) return V.STATUS_INACTIVE;
    return V.STATUS_ACTIVE;
  };

  const getTypePill = (type: VoucherType) => {
    const opt = VOUCHER_TYPE_OPTIONS.find((o) => o.value === type);
    if (!opt) return { label: type, pillClass: "table-pill-neutral" };
    if (type === VoucherType.Percent) return { label: opt.label, pillClass: "table-pill-primary" };
    if (type === VoucherType.Fixed) return { label: opt.label, pillClass: "table-pill-success" };
    return { label: opt.label, pillClass: "table-pill-warning" };
  };

  const formatValue = (voucher: Voucher) => {
    if (voucher.type === VoucherType.Percent) return `${voucher.value}${C.PERCENT}`;
    if (voucher.type === VoucherType.Fixed)
      return `${voucher.value.toLocaleString(C.LOCALE_VI)}${C.CURRENCY}`;
    return C.MINUS;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(C.LOCALE_VI);
  };

  const activeCount = vouchers.filter((v) => isVoucherActive(v)).length;
  const inactiveCount = vouchers.length - activeCount;

  if (loading && vouchers.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Filter Bar */}
      <div className="w-full rounded-xl border border-border bg-card shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={V.SEARCH_PLACEHOLDER}
            className="pl-10 bg-card text-foreground placeholder:text-muted-foreground border border-border focus-visible:ring-2 focus-visible:ring-ring/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setDebouncedSearch(search);
              }
            }}
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl bg-card border border-border text-foreground font-medium">
            <SelectValue placeholder={V.FILTER_TYPE} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{V.FILTER_ALL}</SelectItem>
            {VOUCHER_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl bg-card border border-border text-foreground font-medium">
            <SelectValue placeholder={V.FILTER_STATUS} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{V.FILTER_ALL}</SelectItem>
            <SelectItem value="true">{V.FILTER_ACTIVE}</SelectItem>
            <SelectItem value="false">{V.FILTER_INACTIVE}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3 text-xs font-medium ml-auto">
          <span className="flex items-center gap-1.5">
            <span className="table-status-dot table-status-dot-active" />
            {activeCount} {V.STATS_ACTIVE}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="table-status-dot table-status-dot-muted" />
            {inactiveCount} {V.STATS_INACTIVE}
          </span>
        </div>

        <Button
          onClick={onCreate}
          className="h-10 rounded-xl bg-primary hover:bg-primary-hover shadow-sm gap-2 font-semibold px-4"
        >
          <Plus className="size-4" />
          <span className="text-xs uppercase tracking-tight">{V.CREATE}</span>
        </Button>
      </div>

      {/* Table */}
      <TableShell>
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>{V.TABLE_CODE}</TableHead>
              <TableHead>{V.TABLE_TYPE}</TableHead>
              <TableHead>{V.TABLE_VALUE}</TableHead>
              <TableHead>{V.TABLE_USAGE}</TableHead>
              <TableHead>{V.TABLE_VALIDITY}</TableHead>
              <TableHead>{V.TABLE_STATUS}</TableHead>
              <TableHead className="text-right">{V.TABLE_ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {error && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="table-feedback text-danger">
                    <span className="text-base font-semibold">{error}</span>
                    <Button onClick={fetchVouchers} variant="outline" className="mt-1">
                      {V.ACTION_RETRY}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!error && vouchers.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="table-feedback">
                    <span className="text-sm font-medium text-table-text-muted">{V.NOT_FOUND}</span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!error &&
              vouchers.map((voucher) => {
                const active = isVoucherActive(voucher);
                const statusLabel = getStatusLabel(voucher);
                const typePill = getTypePill(voucher.type);
                const usagePercent =
                  voucher.usageLimit && voucher.usageLimit > 0
                    ? Math.round((voucher.usedCount / voucher.usageLimit) * 100)
                    : 0;

                return (
                  <TableRow key={voucher.promotionId} className="group">
                    {/* Code */}
                    <TableCell>
                      <span className="text-sm font-bold text-table-text-strong tracking-wide">
                        {voucher.code}
                      </span>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <span className={`table-pill border-0 ${typePill.pillClass}`}>
                        {typePill.label}
                      </span>
                    </TableCell>

                    {/* Value */}
                    <TableCell>
                      <span className="table-cell-strong text-sm">{formatValue(voucher)}</span>
                    </TableCell>

                    {/* Usage */}
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              usagePercent >= 90
                                ? "bg-danger"
                                : usagePercent >= 60
                                  ? "bg-warning"
                                  : "bg-primary"
                            }`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-table-text-muted whitespace-nowrap">
                          {voucher.usedCount}
                          {C.SLASH}
                          {voucher.usageLimit}
                        </span>
                      </div>
                    </TableCell>

                    {/* Validity */}
                    <TableCell>
                      <span className="text-xs text-table-text-muted">
                        {formatDate(voucher.startDate)} {V.ARROW} {formatDate(voucher.endDate)}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`table-status-dot ${
                            active ? "table-status-dot-active" : "table-status-dot-muted"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            active ? "table-status-text-active" : "table-status-text-muted"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <VoucherAction
                          voucher={voucher}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={handleDelete}
                          onToggleStatus={handleToggleStatus}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableShell>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="table-pagination rounded-b-xl">
          <span className="text-sm text-table-text-muted">
            {V.PAGINATION_SHOWING} {(currentPage - 1) * pageSize + 1}
            {C.MINUS}
            {Math.min(currentPage * pageSize, totalCount)} {C.SLASH} {totalCount} {V.PAGINATION_OF}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              {V.PAGINATION_PREV}
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  className="size-8"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {V.PAGINATION_NEXT}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherTable;
