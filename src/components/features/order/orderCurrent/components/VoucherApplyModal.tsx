import { Loader2, Ticket, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { voucherService } from "@/services/voucherService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { Voucher, VoucherType } from "@/types/voucher";

interface VoucherApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentVoucherCode?: string;
}

const TEXT = {
  APPLY_MODAL_TITLE: "Áp dụng mã giảm giá",
  APPLY_MODAL_DESC: "Nhập mã voucher để nhận ưu đãi cho đơn hàng.",
  APPLY_MODAL_PLACEHOLDER: "Nhập mã voucher...",
  APPLY_MODAL_APPLY: "Áp dụng",
  APPLY_MODAL_REMOVE: "Gỡ bỏ",
  APPLY_MODAL_CURRENT: "Mã đang áp dụng:",
  APPLY_SUCCESS: "Áp dụng mã giảm giá thành công!",
  APPLY_ERROR: "Không thể áp dụng mã giảm giá",
  REMOVE_SUCCESS: "Đã gỡ mã giảm giá",
  REMOVE_ERROR: "Không thể gỡ mã giảm giá",
  LIST_AVAILABLE: "Danh sách voucher khả dụng",
  LOADING_LIST: "Đang tải danh sách...",
  EMPTY_LIST: "Không có voucher nào khả dụng lúc này",
  NOT_FOUND: "Không tìm thấy voucher nào",
  VALIDATE_CODE_REQUIRED: "Vui lòng nhập mã voucher",
  ERROR_MIN_AMOUNT: "Giá trị đơn hàng chưa đạt mức tối thiểu để sử dụng mã này",
  ERROR_ALREADY_APPLIED: "Đơn hàng này đã áp dụng mã giảm giá rồi",
  CONFIRM_SWITCH_TITLE: "Xác nhận đổi voucher",
  CONFIRM_SWITCH_DESC: (oldCode: string, newCode: string) =>
    `Đơn hàng đang áp dụng mã ${oldCode}. Nếu đổi sang ${newCode}, hệ thống sẽ gỡ mã cũ và áp dụng mã mới. Bạn có muốn tiếp tục không?`,
  CONFIRM_SWITCH_ACTION: "Đổi voucher",
  STATUS_EXPIRED: "Voucher đã hết hạn",
  CANCEL: "Hủy",
  ERROR_UNKNOWN: "Đã xảy ra lỗi, vui lòng thử lại.",
  MIN_ORDER_LABEL: "Đơn tối thiểu:",
  MAX_DISCOUNT_LABEL: "Giảm tối đa:",
  VALIDITY_LABEL: "Hiệu lực:",
};

export const VoucherApplyModal: React.FC<VoucherApplyModalProps> = ({
  isOpen,
  onClose,
  orderId,
  currentVoucherCode,
}) => {
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
        // Filter out expired ones on client side as an extra safety
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

  const applyVoucher = async (targetVoucher: Voucher) => {
    try {
      setIsSubmitting(true);

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

      // 1. Find voucher by code to get ID
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
      const isSwitchingVoucher = !!normalizedCurrent && normalizedCurrent !== normalizedTarget;

      if (isSwitchingVoucher) {
        setPendingVoucher(targetVoucher);
        setIsSwitchConfirmOpen(true);
        return;
      }

      await applyVoucher(targetVoucher);
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

  const formatVoucherValue = (v: Voucher) => {
    if (v.type === VoucherType.Percent) return `-${v.value}%`;
    if (v.type === VoucherType.Fixed) return `-${v.value.toLocaleString()}đ`;
    return "Tặng món";
  };

  const formatCurrency = (value?: number) =>
    typeof value === "number" ? `${value.toLocaleString()}đ` : undefined;

  const formatDateShort = (value?: string) => {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toLocaleDateString("vi-VN");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden rounded-2xl border-none">
        <DialogHeader className="p-6 pb-4 bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-primary">
            <Ticket className="w-5 h-5" />
            {TEXT.APPLY_MODAL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 font-medium">
            {TEXT.APPLY_MODAL_DESC}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <div className="flex gap-2 relative">
            <div className="relative flex-1 group">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={TEXT.APPLY_MODAL_PLACEHOLDER}
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="pl-9 pr-9 font-black uppercase tracking-wider h-11 border-muted-foreground/20 focus-visible:ring-primary/30 text-foreground"
                disabled={isSubmitting}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
              />
              {voucherCode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVoucherCode("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => handleApply()}
              disabled={isSubmitting || !voucherCode.trim()}
              className="px-6 h-11 font-bold shadow-lg shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : TEXT.APPLY_MODAL_APPLY}
            </Button>
          </div>

          {currentVoucherCode && (
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex justify-between items-center animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ticket className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                    {TEXT.APPLY_MODAL_CURRENT}
                  </p>
                  <p className="text-sm font-black text-primary tracking-wider">
                    {currentVoucherCode}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-bold h-8 px-3 rounded-lg"
                onClick={handleRemove}
                disabled={isSubmitting}
              >
                {TEXT.APPLY_MODAL_REMOVE}
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
              <span className="flex-1 h-px bg-muted" />
              {TEXT.LIST_AVAILABLE}
              <span className="flex-1 h-px bg-muted" />
            </h4>

            <ScrollArea className="h-56 rounded-xl border border-muted/50">
              <div className="p-1 space-y-1">
                {isLoadingList ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary/40" />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {TEXT.LOADING_LIST}
                    </span>
                  </div>
                ) : availableVouchers.length > 0 ? (
                  availableVouchers.map((p) => {
                    const minOrder = formatCurrency(p.minOrderValue);
                    const maxDiscount = formatCurrency(p.maxDiscount);
                    const dateRange = `${formatDateShort(p.startDate) ?? ""} - ${formatDateShort(p.endDate) ?? ""}`;
                    const usage =
                      typeof p.usageLimit === "number"
                        ? `Còn ${Math.max((p.usageLimit ?? 0) - (p.usedCount ?? 0), 0)}/${p.usageLimit} lượt`
                        : undefined;

                    return (
                      <button
                        key={p.promotionId}
                        onClick={() => setVoucherCode(p.code)}
                        disabled={isSubmitting}
                        className="w-full group flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all text-left border border-transparent hover:border-primary/10"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="size-9 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                            <Ticket className="h-4 w-4 text-orange-600 group-hover:text-primary" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-black tracking-wide group-hover:text-primary transition-colors text-foreground truncate">
                                {p.code}
                              </p>
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2 shrink-0 ml-auto"
                              >
                                {formatVoucherValue(p)}
                              </Badge>
                            </div>
                            <div className="text-[10px] text-muted-foreground/80 space-y-0.5">
                              {minOrder && (
                                <p>
                                  {TEXT.MIN_ORDER_LABEL} {minOrder}
                                </p>
                              )}
                              {maxDiscount && p.type === VoucherType.Percent && (
                                <p>
                                  {TEXT.MAX_DISCOUNT_LABEL} {maxDiscount}
                                </p>
                              )}
                              {usage && <p>{usage}</p>}
                              <p className="text-[9px] text-muted-foreground">
                                {TEXT.VALIDITY_LABEL} {dateRange}
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-10 text-center text-[11px] text-muted-foreground font-medium italic">
                    {TEXT.EMPTY_LIST}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/30 border-t flex sm:justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="font-bold text-muted-foreground hover:text-foreground"
          >
            {TEXT.CANCEL}
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog
        open={isSwitchConfirmOpen}
        onOpenChange={(open) => {
          setIsSwitchConfirmOpen(open);
          if (!open) setPendingVoucher(null);
        }}
      >
        <AlertDialogContent className="sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Ticket className="h-5 w-5 text-primary" />
              {TEXT.CONFIRM_SWITCH_TITLE}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground mt-3">
              {pendingVoucher &&
                TEXT.CONFIRM_SWITCH_DESC(currentVoucherCode || "", pendingVoucher.code)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2">
            <AlertDialogCancel
              disabled={isSubmitting}
              onClick={() => setPendingVoucher(null)}
              className="h-11 rounded-xl"
            >
              {TEXT.CANCEL}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting || !pendingVoucher}
              onClick={async () => {
                if (!pendingVoucher) return;
                setIsSwitchConfirmOpen(false);
                const voucher = pendingVoucher;
                setPendingVoucher(null);
                await applyVoucher(voucher);
              }}
              className="h-11 rounded-xl bg-primary text-primary-foreground"
            >
              {TEXT.CONFIRM_SWITCH_ACTION}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
