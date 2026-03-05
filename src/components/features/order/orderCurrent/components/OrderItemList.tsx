import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { CartItem, CartItemOptionGroup, CartItemOptionValue } from "@/types/Cart";
import { OrderItemStatus } from "@/types/enums";
import { OrderItem } from "@/types/Order";

interface OrderItemListProps {
  items: CartItem[];
  remoteItems?: OrderItem[];
  onUpdateQuantity: (cartItemKey: string, delta: number) => void;
  onRemoveItem: (cartItemKey: string) => void;
}

const OrderItemList: React.FC<OrderItemListProps> = ({
  items,
  remoteItems = [],
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const getStatusBadge = (status: OrderItemStatus) => {
    switch (status) {
      case OrderItemStatus.Preparing:
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px] py-0">
            Đang chuẩn bị
          </Badge>
        );
      case OrderItemStatus.Cooking:
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-[10px] py-0">Đang nấu</Badge>;
      case OrderItemStatus.Ready:
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] py-0">Sẵn sàng</Badge>
        );
      case OrderItemStatus.Completed:
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-[10px] py-0">Hoàn tất</Badge>;
      default:
        return null;
    }
  };

  const nomalizedPrice = (price: number, quantity: number) => {
    return `${price.toLocaleString()}đ x ${quantity} = ${(price * quantity).toLocaleString()}đ`;
  };
  return (
    <ScrollArea className="flex-1 overflow-auto" type="always">
      <div className="py-4 space-y-4 px-2">
        {items.length === 0 && remoteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground italic text-sm text-center">
            Chưa có món nào trong đơn hàng
          </div>
        ) : (
          <>
            {/* New Items (Cart) */}
            {items.map((item) => (
              <div
                key={item.cartItemKey}
                className="group relative flex flex-col gap-2 p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm leading-tight">{item.menuItem.name}</h4>
                    <p className="text-xs text-primary font-bold mt-1">
                      {nomalizedPrice(item.unitPrice, item.quantity)}
                    </p>
                    {/* Options */}
                    {item.selectedOptions.flatMap((g: CartItemOptionGroup) => g.selectedValues)
                      .length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.selectedOptions
                          .flatMap((g: CartItemOptionGroup) => g.selectedValues)
                          .map((val: CartItemOptionValue) => (
                            <p
                              key={val.optionItemId}
                              className="text-[10px] text-muted-foreground flex items-center justify-between"
                            >
                              <span>• {val.label}</span>
                              {val.extraPrice > 0 && (
                                <span>+{val.extraPrice.toLocaleString()}đ</span>
                              )}
                            </p>
                          ))}
                      </div>
                    )}
                    {/* Note */}
                    {item.note && (
                      <p className="text-[10px] text-orange-600 italic mt-1">
                        {UI_TEXT.ORDER.NOTE(item.note)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.cartItemKey)}
                    className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <Badge
                    variant="ghost"
                    className="text-[10px] font-bold px-2 py-0.5 border-none bg-order-new/15 text-order-new"
                  >
                    Mới
                  </Badge>

                  <div className="flex items-center bg-background rounded-lg border border-border shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none rounded-l-lg hover:bg-secondary"
                      onClick={() => onUpdateQuantity(item.cartItemKey, -1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none rounded-r-lg hover:bg-secondary"
                      onClick={() => onUpdateQuantity(item.cartItemKey, 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Remote Items (Ordered) */}
            {remoteItems.map((item) => (
              <div
                key={item.orderItemId}
                className="group relative flex flex-col gap-2 p-3 rounded-xl border border-border/50 bg-secondary/20 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 text-muted-foreground">
                    <h4 className="font-semibold text-sm leading-tight">{item.itemNameSnapshot}</h4>
                    <p className="text-xs font-medium mt-1">
                      {nomalizedPrice(item.unitPriceSnapshot, item.quantity)}
                    </p>
                    {item.itemNote && (
                      <p className="text-[10px] italic mt-1">{UI_TEXT.ORDER.NOTE(item.itemNote)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  {getStatusBadge(item.status)}
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default OrderItemList;
