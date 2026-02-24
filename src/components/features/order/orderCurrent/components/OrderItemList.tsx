import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

interface OrderItemListProps {
  items: OrderItem[];
  // Add handlers here later, e.g., onUpdateQuantity, onRemoveItem
}

const OrderItemList: React.FC<OrderItemListProps> = ({ items }) => {
  return (
    <ScrollArea className="flex-1 overflow-auto" type="always">
      <div className="py-4 space-y-4 px-2">
        {items.map((item) => (
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
  );
};

export default OrderItemList;
