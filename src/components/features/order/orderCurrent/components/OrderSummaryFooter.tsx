import React from "react";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryFooterProps {
  subtotal: number;
  tax: number;
  total: number;
}

const OrderSummaryFooter: React.FC<OrderSummaryFooterProps> = ({ subtotal, tax, total }) => {
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
          {/* <div className="p-1.5 bg-primary rounded-lg text-white shadow-glow-sm">
            <ReceiptText className="size-4" />
          </div> */}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button variant="outline" size="sm" className="font-bold text-xs h-9">
          In tạm tính
        </Button>
        <Button
          size="sm"
          className="font-bold shadow-sm hover:bg-primary/90 transition-all text-xs h-9"
        >
          Gửi yêu cầu
        </Button>
      </div>
    </CardFooter>
  );
};

export default OrderSummaryFooter;
