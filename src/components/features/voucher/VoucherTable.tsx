"use client";

import React from "react";

import PaginationTable from "@/components/shared/PaginationTable";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { Voucher } from "@/types/voucher";

import { VoucherFilterBar, VoucherRow } from "./components/VoucherTableComponents";
import { useVoucherTable } from "./useVoucherTable";

interface VoucherTableProps {
  onView: (voucher: Voucher) => void;
  onEdit: (voucher: Voucher) => void;
  onCreate: () => void;
  refreshKey: number;
}

const VoucherTable: React.FC<VoucherTableProps> = ({ onView, onEdit, onCreate, refreshKey }) => {
  const {
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
  } = useVoucherTable(refreshKey);

  const V = UI_TEXT.VOUCHER;

  const onDeleteConfirm = async (voucher: Voucher) => {
    if (!confirm(V.DELETE_CONFIRM(voucher.code))) return;
    await handleDelete(voucher.promotionId);
  };

  if (loading && vouchers.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <VoucherFilterBar
        search={search}
        setSearch={setSearch}
        setDebouncedSearch={setDebouncedSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        onCreate={onCreate}
      />

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
              vouchers.map((voucher) => (
                <VoucherRow
                  key={voucher.promotionId}
                  voucher={voucher}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDeleteConfirm}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
          </TableBody>
        </Table>
      </TableShell>

      <PaginationTable
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default VoucherTable;
