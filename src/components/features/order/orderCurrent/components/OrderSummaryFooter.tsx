import { Loader2 } from "lucide-react";
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

interface OrderSummaryFooterProps {
  subtotal: number;
  tax: number;
  total: number;
}

const OrderSummaryFooter: React.FC<OrderSummaryFooterProps> = ({ subtotal, tax, total }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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
        tableId: activeOrder.tableId || null,
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
          onClick={handleSendRequest}
          disabled={
            isSubmitting || !selectedOrderId || (cartData[selectedOrderId] || []).length === 0
          }
          className="min-w-40 bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:bg-primary/60 disabled:text-primary-foreground"
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
    </CardFooter>
  );
};

export default OrderSummaryFooter;
