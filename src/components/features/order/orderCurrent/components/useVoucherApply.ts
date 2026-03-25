"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { voucherService } from "@/services/voucherService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { Voucher } from "@/types/voucher";

const TEXT = {
  APPLY_SUCCESS: "Áp dụng mã giảm giá thành công!",
  APPLY_ERROR: "Không thể áp dụng mã giảm giá",
  REMOVE_SUCCESS: "Đã gỡ mã giảm giá",
  REMOVE_ERROR: "Không thể gỡ mã giảm giá",
  NOT_FOUND: "Không tìm thấy voucher nào",
  VALIDATE_CODE_REQUIRED: "Vui lòng nhập mã voucher",
  ERROR_MIN_AMOUNT: "Giá trị đơn hàng chưa đạt mức tối thiểu để sử dụng mã này",
  ERROR_ALREADY_APPLIED: "Đơn hàng này đã áp dụng mã giảm giá rồi",
  STATUS_EXPIRED: "Voucher đã hết hạn",
  ERROR_UNKNOWN: "Đã xảy ra lỗi, vui lòng thử lại.",
};

export function useVoucherApply(
  isOpen: boolean,
  onClose: () => void,
  orderId: string,
  currentVoucherCode?: string
) {
  const [voucherCode, setVoucherCode] = useState(currentVoucherCode || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSwitchConfirmOpen, setIsSwitchConfirmOpen] = useState(false);
  const [pendingVoucher, setPendingVoucher] = useState<Voucher | null>(null);

  const { patchActiveOrderDetails, fetchOrderDetails, fetchOrders } = useOrderBoardStore();

  useEffect(() => {
    if (isOpen) {
      setVoucherCode(currentVoucherCode || "");
      fetchAvailableVouchers();
    }
  }, [isOpen, currentVoucherCode]);

  const fetchAvailableVouchers = async () => {
    try {
      setIsLoadingList(true);
      const res = await voucherService.getAll({ pageSize: 50, filters: ["isActive==true"] });
      if (res.isSuccess && res.data) {
        const now = new Date();
        const active = res.data.items.filter((v) => new Date(v.endDate) >= now);
        setAvailableVouchers(active);
      }
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const applyVoucher = async (targetVoucher: Voucher, forceUnapply = false) => {
    try {
      setIsSubmitting(true);

      if (forceUnapply) {
        await voucherService.unapply({
          orderId,
        });
      }

      const res = await voucherService.apply({
        orderId,
        code: targetVoucher.code,
      });

      if (res.isSuccess && res.data) {
        toast.success(TEXT.APPLY_SUCCESS);
        patchActiveOrderDetails({
          promotionId: res.data.newPromotionId,
          promotionCode: res.data.newPromotionCode,
          voucherCode: res.data.newPromotionCode,
          appliedVoucherCode: res.data.newPromotionCode,
          discountAmount: res.data.discountAmount,
          subTotal: res.data.subTotal ?? undefined,
          vatAmount: res.data.vatAmount ?? undefined,
          totalAmount: res.data.totalAmount,
        });
        await Promise.all([fetchOrderDetails(orderId), fetchOrders()]);
        onClose();
      } else {
        toast.error(res.message || TEXT.APPLY_ERROR);
      }
    } catch (error: unknown) {
      console.error("Apply voucher failed:", error);
      const message = error instanceof Error ? error.message : "";

      if (message.includes("Voucher.BelowMinAmount")) {
        toast.error(TEXT.ERROR_MIN_AMOUNT);
      } else if (message.includes("Order.VoucherAlreadyApplied")) {
        toast.error(TEXT.ERROR_ALREADY_APPLIED);
      } else if (message.includes("Voucher.Expired")) {
        toast.error(TEXT.STATUS_EXPIRED);
      } else {
        toast.error(message || TEXT.ERROR_UNKNOWN);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = async (codeToApply?: string) => {
    const code = (codeToApply || voucherCode).trim();
    if (!code) {
      toast.error(TEXT.VALIDATE_CODE_REQUIRED);
      return;
    }

    try {
      setIsSubmitting(true);
      const listRes = await voucherService.getAll({ search: code });
      const targetVoucher = listRes.data?.items.find(
        (v) => v.code.toUpperCase() === code.toUpperCase()
      );

      if (!targetVoucher) {
        toast.error(TEXT.NOT_FOUND);
        return;
      }

      const normalizedCurrent = currentVoucherCode?.trim().toUpperCase();
      const normalizedTarget = targetVoucher.code.trim().toUpperCase();

      if (normalizedCurrent === normalizedTarget) {
        toast.error(TEXT.ERROR_ALREADY_APPLIED);
        return;
      }

      const isSwitchingVoucher = !!normalizedCurrent;

      if (isSwitchingVoucher) {
        setPendingVoucher(targetVoucher);
        setIsSwitchConfirmOpen(true);
        return;
      }

      await applyVoucher(targetVoucher);
    } catch (error: unknown) {
      console.error("Apply voucher failed:", error);
      const message = error instanceof Error ? error.message : "";
      if (message.includes("Common.DatabaseUpdateError")) {
        toast.error("Lỗi cập nhật dữ liệu. Vui lòng thử gỡ mã cũ trước khi áp dụng mã mới.");
      } else {
        toast.error(message || TEXT.ERROR_UNKNOWN);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsSubmitting(true);
      const res = await voucherService.unapply({
        orderId,
      });

      if (res.isSuccess) {
        toast.success(TEXT.REMOVE_SUCCESS);
        patchActiveOrderDetails({
          promotionId: undefined,
          promotionCode: undefined,
          voucherCode: undefined,
          appliedVoucherCode: undefined,
          discountAmount: 0,
        });
        await Promise.all([fetchOrderDetails(orderId), fetchOrders()]);
        setVoucherCode("");
        onClose();
      } else {
        toast.error(res.message || TEXT.REMOVE_ERROR);
      }
    } catch (error: unknown) {
      console.error("Remove voucher failed:", error);
      const message = error instanceof Error ? error.message : "";
      toast.error(message || TEXT.ERROR_UNKNOWN);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    voucherCode,
    setVoucherCode,
    isSubmitting,
    availableVouchers,
    isLoadingList,
    isSwitchConfirmOpen,
    setIsSwitchConfirmOpen,
    pendingVoucher,
    setPendingVoucher,
    handleApply,
    handleRemove,
    applyVoucher,
  };
}
