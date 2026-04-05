"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { formatDateTimeWithBranding } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { PreCheckBillItem, PreCheckBillResponse } from "@/types/Billing";
import { buildReceiptOptionItems, resolveOrderTableDisplay } from "@/utils/orderReceipt";
import { buildReceiptDisplayItems, printThermalReceipt } from "@/utils/thermalPrint";

import { getRemoteItemTotal } from "./order-item-list/order-item-list.utils";

const money = (value: number) => formatCurrency(value);

interface PrintTempDialogProps {
  subtotal?: number;
  tax?: number;
  total?: number;
  discount?: number;
  voucherCode?: string;
}

const PrintTempDialog: React.FC<PrintTempDialogProps> = ({
  subtotal: propsSubtotal,
  tax: propsTax,
  total: propsTotal,
  discount: propsDiscount,
  voucherCode: propsVoucherCode,
}) => {
  const { data: branding } = useBrandingSettings();
  const fulleNameEmployee = useAuthStore((state) => state.employee?.fullName);
  const activeOrderDetails = useOrderBoardStore((state) => state.activeOrderDetails);
  const selectedOrderId = useOrderBoardStore((state) => state.selectedOrderId);

  // Derived values with props fallback
  const subtotalValue = propsSubtotal ?? 0;
  const taxValue = propsTax ?? 0;
  const totalValue = propsTotal ?? 0;
  const discountValue = propsDiscount ?? 0;
  const voucherCodeValue = propsVoucherCode;

  const receiptItems: PreCheckBillItem[] = (activeOrderDetails?.orderItems || []).map((item) => {
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
  });

  const orderItems = buildReceiptDisplayItems(receiptItems).map((item, index) => ({
    id: `${item.itemName}-${item.unitPrice}-${index}`,
    name: item.isChild
      ? item.itemName
      : `${item.itemName}${item.isFreeItem ? ` (${UI_TEXT.VOUCHER.GIFT_LABEL})` : ""}`,
    quantity: item.quantity,
    unitPrice: item.isChild ? "" : money(item.unitPrice),
    amount: item.isChild ? "" : money(item.lineTotal),
    isChild: item.isChild,
  }));
  const orderInfo = [
    {
      label: UI_TEXT.ORDER.PRINT_TEMP.TIME,
      value: formatDateTimeWithBranding(new Date().toISOString(), branding, true),
    },
    { label: UI_TEXT.ORDER.PRINT_TEMP.EMPLOYEE, value: fulleNameEmployee || "" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full focus:ring-0" disabled={!selectedOrderId}>
          {UI_TEXT.ORDER.CURRENT.PRINT_TEMP_ACTION || "In tạm tính"}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden max-w-none border-border bg-background p-0 sm:rounded-md">
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>
        <div className="print:block min-h-[85vh] bg-background px-5 pt-6 text-foreground sm:px-8 sm:pt-8 overflow-y-scroll no-scrollbar">
          <div className="mx-auto w-full h-full max-w-160 flex flex-col justify-between">
            <div>
              <div className="text-center leading-none">
                {branding?.logoUrl && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={branding.logoUrl}
                      alt="Logo"
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>
                )}
                <h1 className="text-3xl font-semibold uppercase tracking-tight">
                  {UI_TEXT.ORDER.PRINT_TEMP.TITLE || "PHIẾU TẠM TÍNH"}
                </h1>
                <p className="mt-1 text-lg">
                  {" "}
                  {branding?.restaurantName || UI_TEXT.COMMON.NAME_RESTAURANT}
                </p>
                <p className="mt-1">
                  {UI_TEXT.ORDER.PRINT_TEMP.ORDER_CODE(activeOrderDetails?.orderCode || "")}
                </p>
              </div>

              <div className="mt-8 w-full leading-snug">
                {orderInfo.map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <div className="font-medium">{item.label}</div>
                    <div>{item.value}</div>
                  </div>
                ))}
              </div>

              <Separator className="my-1" />

              <Table className="text-[15px]">
                <TableHeader>
                  <TableRow variant="header" className="bg-transparent">
                    <TableHead className="h-auto px-0 py-2 text-[15px] font-semibold normal-case tracking-normal text-foreground">
                      {UI_TEXT.ORDER.PRINT_TEMP.MENU_NAME}
                    </TableHead>
                    <TableHead className="h-auto px-0 py-2 text-center text-[15px] font-semibold normal-case tracking-normal text-foreground">
                      {UI_TEXT.ORDER.PRINT_TEMP.QUANTITY}
                    </TableHead>
                    <TableHead className="h-auto px-0 py-2 text-center text-[15px] font-semibold normal-case tracking-normal text-foreground">
                      {UI_TEXT.ORDER.PRINT_TEMP.UNIT_PRICE}
                    </TableHead>
                    <TableHead className="h-auto px-0 py-2 text-right text-[15px] font-semibold normal-case tracking-normal text-foreground">
                      {UI_TEXT.ORDER.PRINT_TEMP.AMOUNT}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id} className="border-border hover:bg-transparent">
                      <TableCell
                        className={`px-0 py-2 text-[15px] text-foreground ${
                          item.isChild ? "pl-4 text-[14px] font-light italic" : ""
                        }`}
                      >
                        {item.isChild ? `- ${item.name}` : item.name}
                      </TableCell>
                      <TableCell className="px-0 py-2 text-center text-[15px] text-foreground">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="px-0 py-2 text-center text-[15px] text-foreground">
                        {item.unitPrice}
                      </TableCell>
                      <TableCell className="px-0 py-2 text-right text-[15px] text-foreground">
                        {item.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 space-y-1 text-[15px] leading-snug">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground">{UI_TEXT.ORDER.PRINT_TEMP.BEFORE_TAX}</span>
                  <span className="font-medium">{money(subtotalValue)}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-foreground">
                      {UI_TEXT.ORDER.CURRENT.DISCOUNT}
                      {voucherCodeValue ? ` (${voucherCodeValue})` : ""}
                    </span>
                    <span className="font-medium">-{money(discountValue)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground">{UI_TEXT.ORDER.PRINT_TEMP.TAX_LABEL}</span>
                  <span className="font-medium">{money(taxValue)}</span>
                </div>
                <div className="flex items-end justify-between gap-4 border-t mt-4 pt-1 text-[19px] font-bold">
                  <span>{UI_TEXT.ORDER.PRINT_TEMP.TOTAL_AMOUNT}</span>
                  <span>{money(totalValue)}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs leading-tight text-foreground">
              <div className="w-58 my-2 border mx-auto" />
              <p>{UI_TEXT.ORDER.PRINT_TEMP.THIS_IS_NOT_RECEIPT}</p>
              <p className="mt-1">{branding?.billFooter || UI_TEXT.ORDER.PRINT_TEMP.THANK_YOU}</p>
            </div>
          </div>
        </div>
        <DialogFooter className=" print:hidden gap-4 mx-2 mt-2 mb-2">
          <DialogClose asChild className="flex-1">
            <Button variant="outline" className=" focus:ring-0">
              {UI_TEXT.COMMON.CLOSE}
            </Button>
          </DialogClose>
          <Button
            className="flex-1 focus:ring-0"
            onClick={() => {
              const receipt: PreCheckBillResponse = {
                orderId: selectedOrderId || "",
                orderCode: activeOrderDetails?.orderCode || "",
                ...resolveOrderTableDisplay(activeOrderDetails?.tableId),
                employeeName: fulleNameEmployee || UI_TEXT.COMMON.NOT_APPLICABLE,
                printedAt: new Date().toISOString(),
                items: receiptItems,
                subTotal: subtotalValue,
                discount: discountValue,
                voucherCode: voucherCodeValue,
                preTaxAmount: subtotalValue - discountValue,
                vatRate: 10,
                vat: taxValue,
                totalAmount: totalValue,
              };
              // Override title for pre-bill
              printThermalReceipt(receipt, {
                ...branding,
                billTitle: UI_TEXT.ORDER.PRINT_TEMP.TITLE || "PHIẾU TẠM TÍNH",
              });
            }}
          >
            {UI_TEXT.ORDER.CURRENT.PRINT_TEMP_ACTION || "In tạm tính"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintTempDialog;
