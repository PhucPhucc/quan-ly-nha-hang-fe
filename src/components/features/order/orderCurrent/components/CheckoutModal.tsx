import { DollarSign, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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
import { OrderBoardState, useOrderBoardStore } from "@/store/useOrderStore";
import { PaymentMethod } from "@/types/enums";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [customerGiven, setCustomerGiven] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { selectedOrderId, checkoutOrder, clearOrderDetails } = useOrderBoardStore(
    (state: OrderBoardState) => ({
      selectedOrderId: state.selectedOrderId,
      checkoutOrder: state.checkoutOrder,
      clearOrderDetails: state.clearOrderDetails,
    })
  );

  const handleCheckout = async () => {
    if (!selectedOrderId) return;

    // Optional validation for cash
    let amountReceived = undefined;
    if (selectedMethod === PaymentMethod.Cash) {
      if (!customerGiven) {
        toast.error("Vui lòng nhập số tiền khách đưa");
        return;
      }
      amountReceived = parseFloat(customerGiven.replace(/,/g, ""));
      if (isNaN(amountReceived) || amountReceived < totalAmount) {
        toast.error("Số tiền khách đưa không hợp lệ hoặc nhỏ hơn tổng tiền");
        return;
      }
    }

    try {
      setIsProcessing(true);
      const success = await checkoutOrder(selectedOrderId, selectedMethod, amountReceived);

      if (success) {
        toast.success("Thanh toán thành công!");
        onClose();
        clearOrderDetails(); // Clear selected order
      } else {
        toast.error("Thanh toán thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình thanh toán.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateChange = () => {
    if (!customerGiven || selectedMethod !== PaymentMethod.Cash) return 0;
    const given = parseFloat(customerGiven.replace(/,/g, ""));
    if (isNaN(given)) return 0;
    return Math.max(0, given - totalAmount);
  };

  const handleQuickAmount = (amount: number) => {
    setCustomerGiven(amount.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <DollarSign className="w-5 h-5 text-primary" />
            Thanh toán đơn hàng
          </DialogTitle>
          <DialogDescription>Vui lòng chọn phương thức thanh toán và xác nhận</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <span className="font-semibold text-secondary-foreground">Tổng thanh toán:</span>
            <span className="text-2xl font-black text-primary">
              {totalAmount.toLocaleString()}đ
            </span>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-sm">Phương thức thanh toán</span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedMethod === PaymentMethod.Cash ? "default" : "outline"}
                onClick={() => setSelectedMethod(PaymentMethod.Cash)}
                className="w-full text-xs font-bold"
              >
                Tiền mặt
              </Button>
              <Button
                variant={selectedMethod === PaymentMethod.BankTransfer ? "default" : "outline"}
                onClick={() => setSelectedMethod(PaymentMethod.BankTransfer)}
                className="w-full text-xs font-bold"
              >
                Chuyển khoản
              </Button>
              <Button
                variant={selectedMethod === PaymentMethod.CreditCard ? "default" : "outline"}
                onClick={() => setSelectedMethod(PaymentMethod.CreditCard)}
                className="w-full text-xs font-bold"
              >
                Thẻ (POS)
              </Button>
            </div>
          </div>

          {selectedMethod === PaymentMethod.Cash && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1">
                <span className="font-semibold text-sm">Khách đưa</span>
                <Input
                  type="text"
                  placeholder="Nhập số tiền khách đưa..."
                  value={customerGiven}
                  onChange={(e) => setCustomerGiven(e.target.value)}
                  className="font-bold text-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[totalAmount, 500000, 1000000].map((amount) => (
                  <Button
                    key={amount}
                    variant="secondary"
                    size="sm"
                    className="text-xs font-bold"
                    onClick={() => handleQuickAmount(amount)}
                  >
                    {amount.toLocaleString()}đ
                  </Button>
                ))}
              </div>

              <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-muted border border-muted">
                <span className="font-semibold text-sm text-muted-foreground">Tiền thối lại:</span>
                <span className="font-black text-lg text-primary/90">
                  {calculateChange().toLocaleString()}đ
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Hủy
          </Button>
          <Button onClick={handleCheckout} disabled={isProcessing} className="font-bold">
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận thanh toán"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
