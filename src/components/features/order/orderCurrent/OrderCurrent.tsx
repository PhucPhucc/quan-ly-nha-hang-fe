"use client";
import { Loader2, Minus, Plus, ReceiptText, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { useOrderStore } from "@/store/useOrderStore";
import { OrderType } from "@/types/enums";

import CardContainer from "../CardContainer";

const OrderCurrent = () => {
  const { items, removeItem, updateQuantity, clearOrder } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const subtotal = items.reduce((acc, item) => {
    let itemPrice = item.priceDineIn;
    if (item.selectedOptions) {
      item.selectedOptions.forEach((group) => {
        group.selectedValues.forEach((val) => {
          itemPrice += val.extraPrice;
        });
      });
    }
    return acc + itemPrice * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      toast.error("Vui lòng chọn món trước khi gửi yêu cầu");
      return;
    }

    try {
      setIsSubmitting(true);
      // Create Order - Using Takeaway to skip table check for now
      const orderRes = await orderService.createOrder({
        orderType: OrderType.Takeaway,
        items: [],
      });

      if (!orderRes.isSuccess || !orderRes.data) {
        toast.error(orderRes.message || "Không thể tạo đơn hàng");
        return;
      }

      const orderId = orderRes.data.orderId;

      // Add Items sequentially
      for (const item of items) {
        const addRes = await orderService.addOrderItem(orderId, {
          orderId: orderId,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          note: item.note,
          selectedOptions: item.selectedOptions?.map((g) => ({
            optionGroupId: g.optionGroupId,
            selectedValues: g.selectedValues.map((v) => ({
              optionItemId: v.optionItemId,
              quantity: v.quantity,
              note: undefined,
            })),
          })),
        });

        if (!addRes.isSuccess) {
          toast.error(`Lỗi thêm món "${item.name}": ${addRes.message}`);
        }
      }

      toast.success("Đã gửi yêu cầu thành công!");
      clearOrder();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi đơn hàng");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardContainer className="h-full">
      <div className="flex flex-col h-full min-h-0">
        <CardHeader className="py-2 px-3 border-b flex flex-row items-center justify-between shrink-0">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ReceiptText className="size-4 text-primary" />
              {UI_TEXT.DASHBOARD.RECENT_ORDERS.TITLE}
            </CardTitle>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Bàn số 05 • {items.length} món
            </p>
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
            {items.length === 0 && (
              <div className="text-center text-muted-foreground text-sm italic py-10">
                Chưa có món nào được chọn
              </div>
            )}
            {items.map((item) => {
              // Calculate single item unit price with options
              let unitPrice = item.priceDineIn;
              if (item.selectedOptions) {
                item.selectedOptions.forEach((group) => {
                  group.selectedValues.forEach((val) => {
                    unitPrice += val.extraPrice;
                  });
                });
              }

              return (
                <div
                  key={item.uniqueId}
                  className="group relative flex flex-col gap-2 p-3 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm leading-tight">{item.name}</h4>
                      <p className="text-xs text-primary font-bold mt-1">
                        {unitPrice.toLocaleString()}đ x {item.quantity} ={" "}
                        {(unitPrice * item.quantity).toLocaleString()}đ
                      </p>
                      {/* Display Options */}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.selectedOptions
                            .flatMap((g) => g.selectedValues)
                            .map((val, idx) => (
                              <p
                                key={idx}
                                className="text-[10px] text-slate-500 flex justify-between"
                              >
                                <span>• {val.label}</span>
                                {val.extraPrice > 0 && (
                                  <span>+{val.extraPrice.toLocaleString()}đ</span>
                                )}
                              </p>
                            ))}
                        </div>
                      )}
                      {/* Display Note */}
                      {item.note && (
                        <p className="text-[10px] text-orange-600 italic mt-1">
                          Ghi chú: {item.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => item.uniqueId && removeItem(item.uniqueId)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                      title="Xóa món"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 border-none bg-slate-500/10 text-slate-600"
                      >
                        Mới
                      </Badge>
                    </div>

                    <div className="flex items-center bg-background rounded-lg border border-border shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-none rounded-l-lg hover:bg-secondary"
                        onClick={() =>
                          item.uniqueId &&
                          updateQuantity(item.uniqueId, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-none rounded-r-lg hover:bg-secondary"
                        onClick={() =>
                          item.uniqueId && updateQuantity(item.uniqueId, item.quantity + 1)
                        }
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
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
              onClick={handleSubmitOrder}
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </Button>
          </div>
        </CardFooter>
      </div>
    </CardContainer>
  );
};

export default OrderCurrent;
