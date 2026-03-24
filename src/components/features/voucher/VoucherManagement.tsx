"use client";

import { Plus, Tag } from "lucide-react";
import React, { useCallback, useState } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { voucherService } from "@/services/voucherService";
import { Voucher } from "@/types/voucher";

import CreateVoucherModal from "./CreateVoucherModal";
import VoucherDetailsModal from "./VoucherDetailsModal";
import VoucherTable from "./VoucherTable";

const V = UI_TEXT.VOUCHER;

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
      <PageHeader
        title={V.TITLE}
        description={V.DESCRIPTION}
        icon={Tag}
        actions={
          <Button
            onClick={handleCreate}
            className="bg-primary hover:bg-primary-hover shadow-md shadow-primary/10 gap-2.5 px-6 font-semibold rounded-2xl uppercase tracking-wider text-[11px] h-11 transition-all active:scale-95 border-none"
          >
            <div className="flex items-center justify-center size-5 bg-white/20 rounded-lg">
              <Plus className="size-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span>{V.CREATE}</span>
          </Button>
        }
      />

      <div className="px-4 pb-4">
        <VoucherTable onView={handleView} onEdit={handleEdit} refreshKey={refreshKey} />
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
