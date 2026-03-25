"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { orderService } from "@/services/orderService";
import { OrderBoardState, useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { OrderStatus, PaymentMethod } from "@/types/enums";

export function useCheckout(isOpen: boolean, onClose: () => void, totalAmount: number) {
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

  const { selectedAreaId, fetchTablesByArea } = useTableStore((state) => ({
    selectedAreaId: state.selectedAreaId,
    fetchTablesByArea: state.fetchTablesByArea,
  }));

  const refreshBoardState = useCallback(async () => {
    await Promise.all([
      fetchOrders(),
      selectedAreaId ? fetchTablesByArea(selectedAreaId) : Promise.resolve(),
    ]);
  }, [fetchOrders, selectedAreaId, fetchTablesByArea]);

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

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isOpen && selectedMethod === PaymentMethod.BankTransfer && payOSUrl) {
      interval = setInterval(async () => {
        try {
          if (!selectedOrderId) return;
          const res = await orderService.getOrderById(selectedOrderId);

          if (res.isSuccess && res.data?.status === OrderStatus.Paid) {
            await refreshBoardState();
            toast.success("Hệ thống đã nhận được tiền!");
            onClose();
            clearOrderDetails();
            useOrderBoardStore.getState().setSelectedOrderId(null);
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Lỗi kiểm tra thanh toán:", error);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [
    isOpen,
    selectedMethod,
    payOSUrl,
    selectedOrderId,
    onClose,
    clearOrderDetails,
    refreshBoardState,
  ]);

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
        await refreshBoardState();
        toast.success("Thanh toán thành công!");
        onClose();
        clearOrderDetails();
        useOrderBoardStore.getState().setSelectedOrderId(null);
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

  return {
    selectedMethod,
    setSelectedMethod,
    customerGiven,
    setCustomerGiven,
    isProcessing,
    payOSUrl,
    bankInfo,
    handleCheckout,
    calculateChange,
    handleQuickAmount,
  };
}
