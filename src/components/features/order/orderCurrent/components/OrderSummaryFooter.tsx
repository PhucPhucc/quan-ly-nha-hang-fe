import { Loader2, Ticket } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";

import { CheckoutModal } from "./CheckoutModal";
import PrintTempDialog from "./PrintTempDialog";
import { VoucherApplyModal } from "./VoucherApplyModal";

interface OrderSummaryFooterProps {
  subtotal: number;
  tax: number;
  total: number;
  discount?: number;
  voucherCode?: string;
}

const OrderSummaryFooter: React.FC<OrderSummaryFooterProps> = ({
  subtotal,
  tax,
  total,
  discount = 0,
  voucherCode,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const { items: cartData, clearCart } = useCartStore();
  const { selectedOrderId, fetchOrders, fetchOrderDetails, orders } = useOrderBoardStore();
  const setActiveView = useOrderBoardStore((state) => state.setActiveView);

  const handleSendRequest = async () => {
    if (!selectedOrderId) {
      toast.error("Vui lòng chọn bàn trước khi gửi yêu cầu");
      return;
    }

    const activeOrder = orders.find((o) => o.orderId === selectedOrderId);
    if (!activeOrder) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      return;
    }

    const items = cartData[selectedOrderId] || [];
    if (items.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = {
        orderId: selectedOrderId,
        tableId: activeOrder.tableId || "",
        orderType: activeOrder.orderType,
        note: activeOrder.note || "",
        items: items.map((item) => ({
          menuItemId: item.menuItem.menuItemId,
          quantity: item.quantity,
          note: item.note,
          selectedOptions: item.selectedOptions.map((g) => ({
            optionGroupId: g.optionGroupId,
            selectedValues: g.selectedValues.map((v) => ({
              optionItemId: v.optionItemId,
              quantity: v.quantity,
              note: v.note,
            })),
          })),
        })),
      };

      const submitRes = await orderService.submitToKitchen(submitData);
      if (submitRes.isSuccess) {
        toast.success("Đã gửi yêu cầu vào bếp thành công!");
        clearCart(selectedOrderId);
        fetchOrders(); // Refresh order board
        fetchOrderDetails(selectedOrderId); // Refresh sidebar items
        setActiveView("order"); // Switch to order view to show updated items
      } else {
        toast.error("Gửi vào bếp thất bại: " + submitRes.message);
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error("Đã có lỗi xảy ra khi gửi yêu cầu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardFooter className="flex flex-col p-2 border-t gap-2 shrink-0">
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center text-muted-foreground gap-2 px-1">
          <span className="text-[10px]">{UI_TEXT.ORDER.CURRENT.SUBTOTAL}</span>
          <span className="font-semibold text-xs text-foreground">
            {subtotal.toLocaleString()}
            {UI_TEXT.COMMON.CURRENCY}
          </span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground gap-2 px-1">
          <span className="text-[10px]">{UI_TEXT.ORDER.CURRENT.TAX}</span>
          <span className="font-semibold text-xs text-foreground">
            {tax.toLocaleString()}
            {UI_TEXT.COMMON.CURRENCY}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-red-500 gap-2 px-1">
            <span className="text-[10px] uppercase font-bold">
              {UI_TEXT.VOUCHER.SIDEBAR_TITLE} {voucherCode && `(${voucherCode})`}
            </span>
            <span className="font-bold text-xs">
              {UI_TEXT.COMMON.MINUS}
              {discount.toLocaleString()}
              {UI_TEXT.COMMON.CURRENCY}
            </span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between items-center mt-1 p-2 rounded-xl transition-all">
          <div className="flex justify-between w-full text-xl">
            <span className="font-black text-primary/80 leading-none mb-0.5">
              {UI_TEXT.ORDER.CURRENT.TOTAL_AMOUNT}
            </span>
            <span className="font-black text-primary leading-none tracking-tighter">
              {total.toLocaleString()}
              {UI_TEXT.COMMON.CURRENCY}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <PrintTempDialog />
        <Button
          variant="outline"
          onClick={() => {
            if (selectedOrderId && (cartData[selectedOrderId] || []).length > 0) {
              toast.warning("Vui lòng 'Thêm vào đơn' các món mới trước khi áp dụng mã giảm giá.");
              return;
            }
            setIsVoucherOpen(true);
          }}
          disabled={!selectedOrderId || isSubmitting}
          className={voucherCode ? "text-primary border-primary bg-primary/5 font-bold" : ""}
        >
          <Ticket className="w-4 h-4 mr-2" />
          {UI_TEXT.VOUCHER.SIDEBAR_TITLE}
        </Button>

        <Button
          className="col-span-2"
          onClick={handleSendRequest}
          disabled={
            isSubmitting || !selectedOrderId || (cartData[selectedOrderId] || []).length === 0
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {UI_TEXT.ORDER.CURRENT.PROCESSING}
            </>
          ) : (
            "Thêm vào đơn"
          )}
        </Button>
        <Button
          variant="outline"
          className="col-span-2 min-w-40 font-bold bg-success text-success-foreground hover:bg-success/80 border-success"
          onClick={() => setIsCheckoutOpen(true)}
          disabled={isSubmitting || !selectedOrderId}
        >
          {UI_TEXT.ORDER.CURRENT.PAY}
        </Button>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          totalAmount={total}
        />
      )}

      {isVoucherOpen && selectedOrderId && (
        <VoucherApplyModal
          isOpen={isVoucherOpen}
          onClose={() => setIsVoucherOpen(false)}
          orderId={selectedOrderId}
          currentVoucherCode={voucherCode}
        />
      )}
    </CardFooter>
  );
};

export default OrderSummaryFooter;
