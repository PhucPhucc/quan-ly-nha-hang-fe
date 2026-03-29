"use client";

import { Plus, Search } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { Voucher, VOUCHER_TYPE_OPTIONS, VoucherType } from "@/types/voucher";

import VoucherAction from "../VoucherAction";

interface VoucherFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  setDebouncedSearch: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  activeCount: number;
  inactiveCount: number;
  onCreate: () => void;
}

export const VoucherFilterBar = ({
  search,
  setSearch,
  setDebouncedSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  activeCount,
  inactiveCount,
  onCreate,
}: VoucherFilterBarProps) => {
  const V = UI_TEXT.VOUCHER;

  return (
    <div className="w-full rounded-xl border border-border bg-card shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={V.SEARCH_PLACEHOLDER}
          className="pl-10 rounded-xl bg-card text-foreground placeholder:text-muted-foreground border border-border focus-visible:ring-2 focus-visible:ring-ring/30"
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
        <SelectTrigger className="w-40 rounded-xl bg-card border border-border text-foreground font-medium">
          <SelectValue placeholder={V.FILTER_TYPE} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">{V.FILTER_ALL_TYPE}</SelectItem>
          {VOUCHER_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40 rounded-xl bg-card border border-border text-foreground font-medium">
          <SelectValue placeholder={V.FILTER_STATUS} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">{V.FILTER_ALL_STATUS}</SelectItem>
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
        className="rounded-xl bg-primary hover:bg-primary-hover shadow-sm gap-2 font-semibold px-4"
      >
        <Plus className="size-4" />
        <span className="text-xs uppercase tracking-tight">{V.CREATE}</span>
      </Button>
    </div>
  );
};

interface VoucherRowProps {
  voucher: Voucher;
  onView: (voucher: Voucher) => void;
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
  onToggleStatus: (voucher: Voucher) => void;
}

const isVoucherActive = (voucher: Voucher) => {
  const now = new Date();
  return voucher.isActive && new Date(voucher.endDate) >= now;
};

const getStatusLabel = (voucher: Voucher) => {
  const V = UI_TEXT.VOUCHER;
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

export const VoucherRow = ({
  voucher,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: VoucherRowProps) => {
  const { formatDate, formatCurrency } = useBrandingFormatter();

  const renderValue = (voucher: Voucher) => {
    const C = UI_TEXT.COMMON;
    if (voucher.type === VoucherType.Percent) return `${voucher.value}${C.PERCENT}`;
    if (voucher.type === VoucherType.Fixed) return formatCurrency(voucher.value);
    return C.MINUS;
  };
  const active = isVoucherActive(voucher);
  const statusLabel = getStatusLabel(voucher);
  const typePill = getTypePill(voucher.type);
  const usagePercent =
    voucher.usageLimit && voucher.usageLimit > 0
      ? Math.round((voucher.usedCount / voucher.usageLimit) * 100)
      : 0;

  const V = UI_TEXT.VOUCHER;
  const C = UI_TEXT.COMMON;

  return (
    <TableRow className="group">
      <TableCell>
        <span className="text-sm font-bold text-table-text-strong tracking-wide">
          {voucher.code}
        </span>
      </TableCell>
      <TableCell>
        <span className={`table-pill border-0 ${typePill.pillClass}`}>{typePill.label}</span>
      </TableCell>
      <TableCell>
        <span className="table-cell-strong text-sm">{renderValue(voucher)}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                usagePercent >= 90 ? "bg-danger" : usagePercent >= 60 ? "bg-warning" : "bg-primary"
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
      <TableCell>
        <span className="text-xs text-table-text-muted">
          {formatDate(voucher.startDate)} {V.ARROW} {formatDate(voucher.endDate)}
        </span>
      </TableCell>
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
      <TableCell className="text-right">
        <div className="flex justify-end opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <VoucherAction
            voucher={voucher}
            onView={onView}
            onEdit={onEdit}
            onDelete={() => onDelete(voucher)}
            onToggleStatus={() => onToggleStatus(voucher)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const VoucherPagination = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const V = UI_TEXT.VOUCHER;
  const C = UI_TEXT.COMMON;

  if (totalPages <= 1) return null;

  return (
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
          onClick={() => onPageChange(currentPage - 1)}
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
              onClick={() => onPageChange(pageNum)}
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
          onClick={() => onPageChange(currentPage + 1)}
        >
          {V.PAGINATION_NEXT}
        </Button>
      </div>
    </div>
  );
};
