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
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderBoardStore } from "@/store/useOrderStore";

const money = (value: number) => value.toLocaleString("vi-VN");

const PrintTempDialog = () => {
  const fulleNameEmployee = useAuthStore((state) => state.employee?.fullName);
  const activeOrderDetails = useOrderBoardStore((state) => state.activeOrderDetails);
  const selectedOrderId = useOrderBoardStore((state) => state.selectedOrderId);
  const orderItems =
    activeOrderDetails?.orderItems.map((item) => ({
      name: item.itemNameSnapshot,
      quantity: item.quantity,
      unitPrice: item.unitPriceSnapshot,
      amount: item.quantity * item.unitPriceSnapshot,
    })) || [];
  const orderInfo = [
    { label: UI_TEXT.ORDER.PRINT_TEMP.TIME, value: new Date().toLocaleString("vi-VN") },
    { label: UI_TEXT.ORDER.PRINT_TEMP.EMPLOYEE, value: fulleNameEmployee || "Manager" },
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
        <div className="min-h-[85vh] bg-background px-5 pt-6 text-foreground sm:px-8 sm:pt-8 overflow-y-scroll no-scrollbar">
          <div className="mx-auto w-full h-full max-w-160 flex flex-col justify-between">
            <div>
              <div className="text-center leading-none">
                <h1 className="text-3xl font-semibold uppercase tracking-tight">
                  {UI_TEXT.ORDER.PRINT_TEMP.TITLE}
                </h1>
                <p className="mt-1 text-lg"> {UI_TEXT.COMMON.NAME_RESTAURANT}</p>
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
                    <TableRow key={item.name} className="border-border hover:bg-transparent">
                      <TableCell className="px-0 py-2 text-[15px] text-foreground">
                        {item.name}
                      </TableCell>
                      <TableCell className="px-0 py-2 text-center text-[15px] text-foreground">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="px-0 py-2 text-center text-[15px] text-foreground">
                        {money(item.unitPrice)}
                      </TableCell>
                      <TableCell className="px-0 py-2 text-right text-[15px] text-foreground">
                        {money(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 space-y-1 text-[15px] leading-snug">
                <div className="flex items-center justify-between gap-4">
                  <span className="italic text-foreground">
                    {UI_TEXT.ORDER.PRINT_TEMP.MENU_NAME}
                  </span>
                  <span className="font-medium italic">
                    {money(activeOrderDetails?.totalAmount || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="italic text-foreground">
                    {UI_TEXT.ORDER.PRINT_TEMP.BEFORE_TAX}
                  </span>
                  <span className="font-medium">{money(activeOrderDetails?.totalAmount || 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="italic text-foreground">
                    {UI_TEXT.ORDER.PRINT_TEMP.TAX_LABEL}
                  </span>
                  <span className="font-medium italic">
                    {money(((activeOrderDetails?.totalAmount || 0) * 10) / 100)}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4 border-t mt-4 pt-1 text-[19px] font-bold">
                  <span>{UI_TEXT.ORDER.PRINT_TEMP.TOTAL_AMOUNT}</span>
                  <span>{money((activeOrderDetails?.totalAmount || 0) * 1.1)}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs  leading-tight text-foreground">
              <div className="w-58 my-2 border mx-auto" />
              <p className="italic">{UI_TEXT.ORDER.PRINT_TEMP.THIS_IS_NOT_RECEIPT}</p>
              <p className="mt-1">{UI_TEXT.ORDER.PRINT_TEMP.THANK_YOU}</p>
            </div>
          </div>
        </div>
        <DialogFooter className=" print:hidden gap-4 mx-2 mt-2 mb-2">
          <DialogClose asChild className="flex-1">
            <Button variant="outline" className=" focus:ring-0">
              {UI_TEXT.COMMON.CLOSE}
            </Button>
          </DialogClose>
          <Button className="flex-1 focus:ring-0" onClick={() => window.print()}>
            {UI_TEXT.ORDER.CURRENT.PRINT_TEMP_ACTION || "In tạm tính"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintTempDialog;
