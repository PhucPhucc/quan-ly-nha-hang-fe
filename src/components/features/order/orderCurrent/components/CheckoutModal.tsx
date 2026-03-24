import { DollarSign, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";
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
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { OrderBoardState, useOrderBoardStore } from "@/store/useOrderStore";
import { OrderStatus, PaymentMethod } from "@/types/enums";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

const BANK_LABELS = {
  bank: "Ngân hàng:",
  accountName: "Chủ tài khoản:",
  accountNumber: "Số tài khoản:",
  amount: "Số tiền:",
  currency: "đ",
  desc: "Nội dung CT:",
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [customerGiven, setCustomerGiven] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [payOSUrl, setPayOSUrl] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<{
    accountName?: string;
    accountNumber?: string;
    bin?: string;
    amount?: number;
    description?: string;
  } | null>(null);

  const { selectedOrderId, checkoutOrder, clearOrderDetails, fetchOrders } = useOrderBoardStore(
    (state: OrderBoardState) => ({
      selectedOrderId: state.selectedOrderId,
      checkoutOrder: state.checkoutOrder,
      clearOrderDetails: state.clearOrderDetails,
      fetchOrders: state.fetchOrders,
    })
  );

  useEffect(() => {
    let isMounted = true;

    if (!isOpen || selectedMethod !== PaymentMethod.BankTransfer) {
      setPayOSUrl(null);
      setBankInfo(null);
      return;
    }

    const fetchQR = async () => {
      if (!selectedOrderId) return;
      setIsProcessing(true);
      try {
        const response = await orderService.createPayOsQr(selectedOrderId);
        if (isMounted && response.isSuccess && response.data) {
          const qrString =
            typeof response.data === "string"
              ? response.data
              : response.data.qrCode || response.data.checkoutUrl || "";
          setPayOSUrl(qrString);

          if (typeof response.data === "object" && response.data !== null) {
            setBankInfo({
              accountName: response.data.accountName,
              accountNumber: response.data.accountNumber,
              bin: response.data.bin,
              amount: response.data.amount,
              description: response.data.description,
            });
          }
        } else if (isMounted) {
          toast.error("Không thể tạo mã QR thanh toán.");
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Đã xảy ra lỗi khi tải mã QR.");
          console.error(error);
        }
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    fetchQR();

    return () => {
      isMounted = false;
    };
  }, [selectedMethod, isOpen, selectedOrderId]);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isOpen && selectedMethod === PaymentMethod.BankTransfer && payOSUrl) {
      interval = setInterval(async () => {
        try {
          if (!selectedOrderId) return;
          const res = await orderService.getOrderById(selectedOrderId);

          if (res.isSuccess && res.data?.status === OrderStatus.Paid) {
            await fetchOrders();
            toast.success("Hệ thống đã nhận được tiền!");
            onClose();
            clearOrderDetails();
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Lỗi kiểm tra thanh toán:", error);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isOpen, selectedMethod, payOSUrl, selectedOrderId, onClose, clearOrderDetails, fetchOrders]);

  const handleCheckout = async () => {
    if (!selectedOrderId) return;

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

      if (selectedMethod === PaymentMethod.BankTransfer) {
        return;
      }

      const success = await checkoutOrder(selectedOrderId, selectedMethod, amountReceived);

      if (success) {
        toast.success("Thanh toán thành công!");
        onClose();
        clearOrderDetails();
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
            {UI_TEXT.ORDER.CURRENT.CHECKOUT_TITLE}
          </DialogTitle>
          <DialogDescription>{UI_TEXT.ORDER.CURRENT.CHECKOUT_DESC}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <span className="font-semibold text-secondary-foreground">
              {UI_TEXT.ORDER.CURRENT.TOTAL_AMOUNT}
            </span>
            <span className="text-2xl font-black text-primary">
              {totalAmount.toLocaleString()}
              {UI_TEXT.COMMON.CURRENCY}
            </span>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-sm">{UI_TEXT.ORDER.CURRENT.PAYMENT_METHOD}</span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedMethod === PaymentMethod.Cash ? "default" : "outline"}
                onClick={() => setSelectedMethod(PaymentMethod.Cash)}
                className="w-full text-xs font-bold"
              >
                {UI_TEXT.ORDER.CURRENT.CASH}
              </Button>
              <Button
                variant={selectedMethod === PaymentMethod.BankTransfer ? "default" : "outline"}
                onClick={() => setSelectedMethod(PaymentMethod.BankTransfer)}
                className="w-full text-xs font-bold"
              >
                {UI_TEXT.ORDER.CURRENT.TRANSFER}
              </Button>
              <Button
                variant={selectedMethod === PaymentMethod.CreditCard ? "default" : "outline"}
                onClick={() => setSelectedMethod(PaymentMethod.CreditCard)}
                className="w-full text-xs font-bold"
              >
                {UI_TEXT.ORDER.CURRENT.CARD}
              </Button>
            </div>
          </div>

          {selectedMethod === PaymentMethod.Cash && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1">
                <span className="font-semibold text-sm">{UI_TEXT.ORDER.CURRENT.CUSTOMER_GAVE}</span>
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
                    {amount.toLocaleString()}
                    {UI_TEXT.COMMON.CURRENCY}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-muted border border-muted">
                <span className="font-semibold text-sm text-muted-foreground">
                  {UI_TEXT.ORDER.CURRENT.CHANGE}
                </span>
                <span className="font-black text-lg text-primary/90">
                  {calculateChange().toLocaleString()}
                  {UI_TEXT.COMMON.CURRENCY}
                </span>
              </div>
            </div>
          )}

          {selectedMethod === PaymentMethod.BankTransfer && payOSUrl && (
            <div className="flex flex-col items-center justify-center space-y-3 py-2 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-muted">
                <QRCodeSVG value={payOSUrl} size={100} level="M" />
              </div>

              {bankInfo && (
                <div className="w-full space-y-1 mt-1 text-[11px] bg-muted/40 p-2 rounded-md border border-muted">
                  <div className="flex flex-col border-b border-muted/50 pb-1">
                    <span className="text-muted-foreground uppercase text-[9px] font-medium">
                      {BANK_LABELS.accountName}
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="font-bold uppercase text-foreground">
                        {bankInfo.accountName || "---"}
                      </span>
                      <span className="font-medium text-muted-foreground">
                        {bankInfo.accountNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-muted/50 py-1">
                    <span className="text-muted-foreground">{BANK_LABELS.amount}</span>
                    <span className="font-black text-right text-red-600 text-xs">
                      {(bankInfo.amount ?? totalAmount).toLocaleString()} {BANK_LABELS.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-muted-foreground shrink-0 mr-2">{BANK_LABELS.desc}</span>
                    <span className="font-bold text-right text-orange-600 truncate">
                      {bankInfo.description || "---"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="min-w-28 font-semibold text-foreground"
          >
            {UI_TEXT.COMMON.CANCEL_EN}
          </Button>

          {selectedMethod !== PaymentMethod.BankTransfer && (
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="min-w-40 font-bold text-primary-foreground"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {UI_TEXT.ORDER.CURRENT.PROCESSING}
                </>
              ) : (
                UI_TEXT.ORDER.CURRENT.CONFIRM_PAYMENT
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
