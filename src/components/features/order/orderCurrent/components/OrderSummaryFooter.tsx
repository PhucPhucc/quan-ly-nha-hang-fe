import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/services/orderService";
import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";

interface OrderSummaryFooterProps {
  subtotal: number;
  tax: number;
  total: number;
}

const OrderSummaryFooter: React.FC<OrderSummaryFooterProps> = ({ subtotal, tax, total }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items: cartData, clearCart } = useCartStore();
  const { selectedOrderId, fetchOrders, fetchOrderDetails } = useOrderBoardStore();

  const handleSendRequest = async () => {
    if (!selectedOrderId) {
      toast.error("Vui lòng chọn bàn trước khi gửi yêu cầu");
      return;
    }

    const items = cartData[selectedOrderId] || [];
    if (items.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Thêm từng sản phẩm vào Order
      const promises = items.map((item) =>
        orderService.addOrderItem(selectedOrderId, {
          orderId: selectedOrderId,
          menuItemId: item.menuItem.menuItemId,
          quantity: item.quantity,
          note: item.note,
          selectedOptions: item.selectedOptions.map((g) => ({
            optionGroupId: g.optionGroupId,
            selectedValues: g.selectedValues.map((v) => ({
              optionItemId: v.optionItemId,
              quantity: v.quantity,
            })),
          })),
        })
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res.isSuccess);

      if (!allSuccess) {
        toast.error("Một số món ăn không thể thêm vào đơn hàng");
        return;
      }

      // 2. Gửi yêu cầu vào bếp (nếu cần - tùy logic backend, thường add xong là submit)
      const submitRes = await orderService.submitToKitchen({ orderId: selectedOrderId });
      if (submitRes.isSuccess) {
        toast.success("Đã gửi yêu cầu vào bếp thành công!");
        clearCart(selectedOrderId);
        fetchOrders(); // Refresh order board
        fetchOrderDetails(selectedOrderId); // Refresh sidebar items
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
    <CardFooter className="flex flex-col p-2 bg-secondary/40 border-t gap-2 shrink-0">
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center text-muted-foreground gap-2 px-1">
          <span className="text-[10px]">Tạm tính</span>
          <span className="font-semibold text-xs text-foreground">
            {subtotal.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground gap-2 px-1">
          <span className="text-[10px]">Thuế (VAT 10%)</span>
          <span className="font-semibold text-xs text-foreground">{tax.toLocaleString()}đ</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center mt-1 p-2 rounded-xl transition-all">
          <div className="flex justify-between w-full text-xl">
            <span className="font-black text-primary/80 leading-none mb-0.5">Tổng thanh toán:</span>
            <span className="font-black text-primary leading-none tracking-tighter">
              {total.toLocaleString()}đ
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button variant="outline" size="sm" className="font-bold text-xs h-9">
          In tạm tính
        </Button>
        <Button
          size="sm"
          className="font-bold shadow-sm hover:bg-primary/90 transition-all text-xs h-9"
          onClick={handleSendRequest}
          disabled={
            isSubmitting || !selectedOrderId || (cartData[selectedOrderId] || []).length === 0
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Gửi yêu cầu"
          )}
        </Button>
      </div>
    </CardFooter>
  );
};

export default OrderSummaryFooter;
