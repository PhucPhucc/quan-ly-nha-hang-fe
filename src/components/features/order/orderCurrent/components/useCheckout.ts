"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { OrderBoardState, useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { PreCheckBillResponse } from "@/types/Billing";
import { OrderStatus, PaymentMethod } from "@/types/enums";
import { Order } from "@/types/Order";
import { printThermalReceipt } from "@/utils/thermalPrint";

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

  const { data: branding } = useBrandingSettings();

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

  const buildReceiptFromOrder = useCallback(
    (order: Order, invoiceAmount?: number): PreCheckBillResponse => ({
      orderId: order.orderId,
      orderCode: order.orderCode,
      tableNumber: order.tableId ? Number.parseInt(order.tableId, 10) || undefined : undefined,
      employeeName: UI_TEXT.COMMON.NOT_APPLICABLE,
      printedAt: new Date().toISOString(),
      items: order.orderItems.map((item) => ({
        itemName: item.itemNameSnapshot,
        quantity: item.quantity,
        unitPrice: item.unitPriceSnapshot,
        optionsSummary: item.itemOptions,
        lineTotal: item.unitPriceSnapshot * item.quantity,
      })),
      subTotal: order.subTotal ?? order.totalAmount,
      discount: order.discountAmount ?? order.discount ?? 0,
      voucherCode: order.voucherCode ?? order.appliedVoucherCode,
      preTaxAmount: order.subTotal ?? order.totalAmount,
      vatRate: order.vatRate ?? 0,
      vat: order.vatAmount ?? 0,
      totalAmount: invoiceAmount ?? order.totalAmount,
      paymentMethod: order.paymentMethod,
      amountReceived: invoiceAmount ?? order.amountPaid ?? order.totalAmount,
      changeAmount:
        typeof invoiceAmount === "number"
          ? Math.max(0, invoiceAmount - (order.totalAmount || 0))
          : Math.max(0, (order.amountPaid ?? order.totalAmount) - (order.totalAmount || 0)),
    }),
    []
  );

  const refreshBoardState = useCallback(async () => {
    await Promise.all([
      fetchOrders(),
      selectedAreaId ? fetchTablesByArea(selectedAreaId) : Promise.resolve(),
    ]);
  }, [fetchOrders, selectedAreaId, fetchTablesByArea]);

  const printInvoiceAfterPayment = useCallback(
    async (invoiceAmount?: number) => {
      const order = useOrderBoardStore.getState().activeOrderDetails;
      if (!order) return;

      const receipt = buildReceiptFromOrder(order, invoiceAmount);
      printThermalReceipt(receipt, branding);
    },
    [buildReceiptFromOrder, branding]
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
              await printInvoiceAfterPayment(totalAmount);
            } catch (printError) {
              console.error("Failed to print thermal receipt for bank transfer:", printError);
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
    printInvoiceAfterPayment,
    totalAmount,
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
        try {
          const invoiceAmount = amountReceived ?? totalAmount;
          await printInvoiceAfterPayment(invoiceAmount);
        } catch (printError) {
          console.error("Failed to print thermal receipt:", printError);
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

  const handleSyncPayment = useCallback(async () => {
    if (!selectedOrderId) return;
    setIsProcessing(true);
    try {
      const response = await orderService.syncPayosStatus(selectedOrderId);
      if (response.isSuccess) {
        if (response.data === true) {
          toast.success(UI_TEXT.ORDER.CURRENT.PAYMENT_RECEIVED);
          // Polling will handle the rest (print, close, etc.)
          // But for better UX, we can trigger re-fetch right now
          await orderService.getOrderById(selectedOrderId);
        } else {
          toast.info("Chưa nhận được thanh toán. Vui lòng thử lại sau vài giây.");
        }
      } else {
        toast.error("Không thể đồng bộ trạng thái thanh toán.");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối với PayOS.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedOrderId]);

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
    handleSyncPayment,
  };
}
