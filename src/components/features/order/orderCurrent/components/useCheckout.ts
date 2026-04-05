"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { paymentMethodService } from "@/services/paymentMethodService";
import { AuthState, useAuthStore } from "@/store/useAuthStore";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { PreCheckBillResponse } from "@/types/Billing";
import { OrderStatus, PaymentMethod } from "@/types/enums";
import { Order } from "@/types/Order";
import { buildReceiptOptionItems, resolveOrderTableDisplay } from "@/utils/orderReceipt";
import { printThermalReceipt } from "@/utils/thermalPrint";

import { getRemoteItemTotal } from "./order-item-list/order-item-list.utils";

export function useCheckout(isOpen: boolean, onClose: () => void, totalAmount: number) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "MixedCashQR">(
    PaymentMethod.Cash
  );
  const [customerGiven, setCustomerGiven] = useState<string>(String(totalAmount));
  const [isProcessing, setIsProcessing] = useState(false);
  const [payOSUrl, setPayOSUrl] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<{
    accountName?: string;
    accountNumber?: string;
    bin?: string;
    amount?: number;
    description?: string;
  } | null>(null);
  const [paymentMethodIds, setPaymentMethodIds] = useState<{
    cash?: string;
    bankTransfer?: string;
  }>({});

  const { data: branding } = useBrandingSettings();
  const fullNameEmployee = useAuthStore((state: AuthState) => state.employee?.fullName);

  const selectedOrderId = useOrderBoardStore((state) => state.selectedOrderId);
  const checkoutOrder = useOrderBoardStore((state) => state.checkoutOrder);
  const clearOrderDetails = useOrderBoardStore((state) => state.clearOrderDetails);
  const fetchOrders = useOrderBoardStore((state) => state.fetchOrders);
  const activeOrderDetails = useOrderBoardStore((state) => state.activeOrderDetails);

  // const totalAmount = useOrderBoardStore(
  //   (state) => state.activeOrderDetails?.totalAmount ?? totalAmount
  // );

  const selectedAreaId = useTableStore((state) => state.selectedAreaId);
  const fetchTablesByArea = useTableStore((state) => state.fetchTablesByArea);

  const remainingAmount = Math.max(totalAmount - (activeOrderDetails?.amountPaid ?? 0), 0);
  const isMixedPayment =
    selectedMethod === PaymentMethod.Cash &&
    customerGiven !== "" &&
    Number.parseFloat(customerGiven.replace(/,/g, "")) < remainingAmount;

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const buildReceiptFromOrder = useCallback(
    (order: Order, invoiceAmount?: number): PreCheckBillResponse => {
      // Tính toán giá trị dựa trên danh sách món để đảm bảo độ chính xác
      const itemsLineTotal = order.orderItems.reduce(
        (sum, item) =>
          sum + (item.isFreeItem ? 0 : getRemoteItemTotal(item) * (item.quantity || 0)),
        0
      );

      // Ưu tiên subTotal từ BE, nếu không có thì lấy tổng tính từ items, cuối cùng là totalAmount truyền vào
      const subTotalVal = order.subTotal || itemsLineTotal || order.totalAmount || totalAmount;
      const discountVal = order.discountAmount ?? order.discount ?? 0;

      // Tính thuế 10% dựa trên (Thành tiền - Giảm giá)
      const vatRate = 0.1;
      const computedVat = Math.max(0, (subTotalVal - discountVal) * vatRate);
      const finalTotal = subTotalVal - discountVal + computedVat;

      // Lấy tên nhân viên từ store hoặc cookie nếu store trống
      const employeeNameFromStore =
        fullNameEmployee || useAuthStore.getState().employee?.employeeCode;
      const employeeNameFromCookie = getCookie("fullName") || getCookie("employeeName");

      return {
        orderId: order.orderId,
        orderCode: order.orderCode,
        ...resolveOrderTableDisplay(order.tableId),
        employeeName:
          employeeNameFromStore || employeeNameFromCookie || UI_TEXT.COMMON.NOT_APPLICABLE,
        printedAt: new Date().toISOString(),
        items: order.orderItems.map((item) => {
          const optionItems = buildReceiptOptionItems(item.optionGroups, item.itemOptions);

          return {
            itemName: item.itemNameSnapshot,
            quantity: item.quantity,
            unitPrice: item.isFreeItem ? 0 : item.unitPriceSnapshot,
            optionItems,
            optionsSummary: optionItems.map((opt) => opt.label).join("; "),
            lineTotal: item.isFreeItem ? 0 : getRemoteItemTotal(item) * item.quantity,
            isFreeItem: item.isFreeItem ?? false,
          };
        }),
        subTotal: subTotalVal,
        discount: discountVal,
        voucherCode: order.voucherCode ?? order.appliedVoucherCode,
        preTaxAmount: subTotalVal - discountVal,
        vatRate: 10, // Hiển thị 10% trên bill
        vat: computedVat,
        totalAmount: finalTotal,
        paymentMethod: order.paymentMethod,
        amountReceived: invoiceAmount ?? order.amountPaid ?? finalTotal,
        changeAmount:
          typeof invoiceAmount === "number"
            ? Math.max(0, invoiceAmount - finalTotal)
            : Math.max(0, (order.amountPaid ?? finalTotal) - finalTotal),
      };
    },
    [fullNameEmployee, totalAmount]
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

    if (!isOpen) return;

    const loadPaymentMethods = async () => {
      try {
        const res = await paymentMethodService.getPaymentMethods();
        if (!isMounted || !res.isSuccess || !res.data) return;

        const cash = res.data.find((item) => item.isActive && item.type === PaymentMethod.Cash);
        const bankTransfer = res.data.find(
          (item) => item.isActive && item.type === PaymentMethod.BankTransfer
        );

        setPaymentMethodIds({
          cash: cash?.paymentMethodConfigId,
          bankTransfer: bankTransfer?.paymentMethodConfigId,
        });
      } catch (error) {
        console.error("Failed to load payment methods:", error);
      }
    };

    void loadPaymentMethods();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && (selectedMethod === PaymentMethod.Cash || selectedMethod === "MixedCashQR")) {
      setCustomerGiven(String(remainingAmount));
    }
  }, [isOpen, selectedMethod, remainingAmount]);

  useEffect(() => {
    if (selectedMethod !== "MixedCashQR") {
      setPayOSUrl(null);
      setBankInfo(null);
    }
  }, [selectedMethod]);

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

  const generateMixedQR = async () => {
    if (!selectedOrderId) return;
    const cashAmount = parseFloat(customerGiven.replace(/,/g, "")) || 0;
    const qrAmount = Math.max(0, remainingAmount - cashAmount);

    if (qrAmount <= 0) {
      toast.error("Số tiền QR phải lớn hơn 0");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await orderService.createPayOsQr(selectedOrderId, qrAmount);
      if (response.isSuccess && response.data) {
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
      } else {
        toast.error(UI_TEXT.ORDER.CURRENT.QR_CREATE_ERROR);
      }
    } catch (error) {
      toast.error(UI_TEXT.ORDER.CURRENT.QR_FETCH_ERROR);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (
      isOpen &&
      (selectedMethod === PaymentMethod.BankTransfer || selectedMethod === "MixedCashQR") &&
      payOSUrl
    ) {
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
    let paymentLines:
      | Array<{
          paymentMethodConfigId: string;
          amount: number;
          amountReceived?: number;
        }>
      | undefined;

    if (selectedMethod === PaymentMethod.Cash || selectedMethod === "MixedCashQR") {
      if (!customerGiven) {
        toast.error(UI_TEXT.ORDER.CURRENT.INPUT_AMOUNT_REQUIRED);
        return;
      }
      amountReceived = parseFloat(customerGiven.replace(/,/g, ""));
      if (isNaN(amountReceived)) {
        toast.error(UI_TEXT.ORDER.CURRENT.INVALID_AMOUNT);
        return;
      }
      if (amountReceived < remainingAmount) {
        if (!paymentMethodIds.cash || !paymentMethodIds.bankTransfer) {
          toast.error("Không tìm thấy cấu hình phương thức thanh toán phù hợp.");
          return;
        }

        const cashAmount = amountReceived;
        const qrAmount = remainingAmount - amountReceived;

        paymentLines = [
          {
            paymentMethodConfigId: paymentMethodIds.cash,
            amount: cashAmount,
            amountReceived: cashAmount,
          },
          {
            paymentMethodConfigId: paymentMethodIds.bankTransfer,
            amount: qrAmount,
          },
        ];
      }
    }

    try {
      setIsProcessing(true);

      if (selectedMethod === PaymentMethod.BankTransfer) {
        return;
      }

      const success = await checkoutOrder(
        selectedOrderId,
        selectedMethod,
        amountReceived,
        paymentLines
      );

      if (success) {
        try {
          const invoiceAmount =
            isMixedPayment || selectedMethod === "MixedCashQR"
              ? remainingAmount
              : (amountReceived ?? remainingAmount);
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
      // API throws error on non-2xx status, extract message from thrown error
      const errorMessage =
        error instanceof Error ? error.message : UI_TEXT.ORDER.CURRENT.PAYMENT_FAILED;
      toast.error(errorMessage);
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
    if (
      !customerGiven ||
      (selectedMethod !== PaymentMethod.Cash && selectedMethod !== "MixedCashQR")
    )
      return 0;
    const given = parseFloat(customerGiven.replace(/,/g, ""));
    if (isNaN(given)) return 0;
    return Math.max(0, given - remainingAmount);
  };

  const handleQuickAmount = (amount: number) => {
    setCustomerGiven(amount.toString());
  };

  const getMixedPaymentAmounts = () => {
    const cashAmount = parseFloat(customerGiven.replace(/,/g, "")) || 0;
    const qrAmount = Math.max(0, remainingAmount - cashAmount);
    return { cashAmount, qrAmount };
  };

  return {
    selectedMethod,
    setSelectedMethod,
    customerGiven,
    setCustomerGiven,
    isProcessing,
    payOSUrl,
    bankInfo,
    totalAmount,
    remainingAmount,
    paymentMethodIds,
    handleCheckout,
    calculateChange,
    handleQuickAmount,
    handleSyncPayment,
    getMixedPaymentAmounts,
    generateMixedQR,
  };
}
