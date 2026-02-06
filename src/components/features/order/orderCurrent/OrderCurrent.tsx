"use client";

import { Minus, Plus, ReceiptText, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import CardContainer from "../CardContainer";

const OrderCurrent = () => {
  // Mock data for demonstration - will be replaced by state/API later
  const orderItems = [
    { id: 1, name: "Phở Bò Tái Lăn", price: 65000, quantity: 2, status: "COOKING" },
    { id: 2, name: "Gỏi Cuốn Tôm Thịt", price: 45000, quantity: 1, status: "PENDING" },
    { id: 3, name: "Trà Đào Cam Sả", price: 35000, quantity: 3, status: "SERVED" },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <CardContainer className="h-full">
      <div className="flex flex-col h-full min-h-0">
        <CardHeader className="py-2 px-3 border-b flex flex-row items-center justify-between shrink-0">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ReceiptText className="size-4 text-primary" />
              {UI_TEXT.DASHBOARD.RECENT_ORDERS.TITLE}
            </CardTitle>
            <p className="text-[10px] text-muted-foreground mt-0.5">Bàn số 05 • 3 món</p>
          </div>
          <Badge
            variant="outline"
            className="bg-table-inprocess text-white border-none py-0 text-[10px]"
          >
            {UI_TEXT.TABLE.INPROCESS}
          </Badge>
        </CardHeader>
        <ScrollArea className="flex-1 overflow-auto" type="always">
          <div className="py-4 space-y-4 px-2">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col gap-2 p-3 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm leading-tight">{item.name}</h4>
                    <p className="text-xs text-primary font-bold mt-1">
                      {item.price.toLocaleString()}đ
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-all">
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] px-1.5 py-0 border-none",
                        item.status === "COOKING" && "bg-orange-500/10 text-orange-600",
                        item.status === "PENDING" && "bg-slate-500/10 text-slate-600",
                        item.status === "SERVED" && "bg-green-500/10 text-green-600"
                      )}
                    >
                      {item.status === "COOKING"
                        ? "Đang làm"
                        : item.status === "PENDING"
                          ? "Chờ"
                          : "Đã lên"}
                    </Badge>
                  </div>

                  <div className="flex items-center bg-background rounded-lg border border-border shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none rounded-l-lg hover:bg-secondary"
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none rounded-r-lg hover:bg-secondary"
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
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
            <div className="flex justify-between items-center mt-1 p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-sm transition-all hover:bg-primary/15">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-widest text-primary/80 leading-none mb-0.5">
                  Tổng thanh toán
                </span>
                <span className="text-xl font-black text-primary leading-none tracking-tighter">
                  {total.toLocaleString()}đ
                </span>
              </div>
              <div className="p-1.5 bg-primary rounded-lg text-white shadow-glow-sm">
                <ReceiptText className="size-4" />
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
            >
              Gửi yêu cầu
            </Button>
          </div>
        </CardFooter>
      </div>
    </CardContainer>
  );
};

export default OrderCurrent;
