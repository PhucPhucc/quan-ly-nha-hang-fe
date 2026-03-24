"use client";

import React, { useCallback, useState } from "react";

import { voucherService } from "@/services/voucherService";
import { Voucher } from "@/types/voucher";

import CreateVoucherModal from "./CreateVoucherModal";
import VoucherDetailsModal from "./VoucherDetailsModal";
import VoucherTable from "./VoucherTable";

const VoucherManagement = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [viewingVoucher, setViewingVoucher] = useState<Voucher | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleCreate = () => {
    setEditingVoucher(null);
    setCreateModalOpen(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setCreateModalOpen(true);
  };

  const handleView = (voucher: Voucher) => {
    setViewingVoucher(voucher);
    setDetailsModalOpen(true);
  };

  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      await voucherService.toggleStatus(voucher.voucherId, !voucher.isActive);
      setViewingVoucher((prev) =>
        prev && prev.voucherId === voucher.voucherId ? { ...prev, isActive: !prev.isActive } : prev
      );
      refresh();
    } catch (err) {
      console.error("Failed to toggle voucher status:", err);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 pb-4 pt-4">
        <VoucherTable
          onView={handleView}
          onEdit={handleEdit}
          onCreate={handleCreate}
          refreshKey={refreshKey}
        />
      </div>

      <CreateVoucherModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        editingVoucher={editingVoucher}
        onSuccess={refresh}
      />

      <VoucherDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        voucher={viewingVoucher}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default VoucherManagement;
