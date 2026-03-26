"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { OrderBoardState, useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { OrderStatus, PaymentMethod } from "@/types/enums";
import { printPdfBlob } from "@/utils/thermalPrint";

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
          toast.error(UI_TEXT.ORDER.CURRENT.QR_CREATE_ERROR);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(UI_TEXT.ORDER.CURRENT.QR_FETCH_ERROR);
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
            // In hóa đơn tự động khi nhận được tiền chuyển khoản
            try {
              const pdfRes = await orderService.getOrderReceiptPDF(selectedOrderId);
              if (pdfRes.isSuccess && pdfRes.data) {
                printPdfBlob(pdfRes.data);
              }
            } catch (printError) {
              console.error("Failed to print PDF for bank transfer:", printError);
            }

            await refreshBoardState();
            toast.success(UI_TEXT.ORDER.CURRENT.PAYMENT_RECEIVED);
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
        toast.error(UI_TEXT.ORDER.CURRENT.INPUT_AMOUNT_REQUIRED);
        return;
      }
      amountReceived = parseFloat(customerGiven.replace(/,/g, ""));
      if (isNaN(amountReceived) || amountReceived < totalAmount) {
        toast.error(UI_TEXT.ORDER.CURRENT.INVALID_AMOUNT);
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
        // Fetch bill PDF and print
        try {
          const pdfRes = await orderService.getOrderReceiptPDF(selectedOrderId);
          if (pdfRes.isSuccess && pdfRes.data) {
            printPdfBlob(pdfRes.data);
          }
        } catch (printError) {
          console.error("Failed to print PDF receipt:", printError);
        }

        await refreshBoardState();
        toast.success(UI_TEXT.ORDER.CURRENT.PAYMENT_SUCCESS);
        onClose();
        clearOrderDetails();
        useOrderBoardStore.getState().setSelectedOrderId(null);
      } else {
        toast.error(UI_TEXT.ORDER.CURRENT.PAYMENT_FAILED);
      }
    } catch (error) {
      toast.error(UI_TEXT.ORDER.CURRENT.PAYMENT_ERROR);
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
