"use client";

import { Armchair, ClipboardList, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

import OrderCurrent from "@/components/features/order/orderCurrent/OrderCurrent";
import CardMenu from "@/components/features/order/orderMenu/CardMenu";
import OrderBoard from "@/components/features/order/orderTable/OrderBoard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const OrderPage = () => {
  const [activeView, setActiveView] = useState<"order" | "menu">("order");

  return (
    <div className="flex h-[calc(100vh-100px)] w-full bg-muted/40 p-2 gap-2 overflow-hidden">
      {/* Left Column: Order Board & Menu Selection */}
      <div className="flex-[1.8] flex flex-col h-full min-w-0">
        <div className="flex bg-muted/30 p-1.5 rounded-t-2xl border border-b-0 border-border gap-2">
          <Button
            variant="ghost"
            onClick={() => setActiveView("order")}
            className={cn(
              "flex-1 h-12 rounded-xl gap-3 text-sm font-black transition-all",
              activeView === "order"
                ? "bg-background text-primary shadow-sm border border-border/50"
                : "text-muted-foreground hover:bg-background/50"
            )}
          >
            <ClipboardList
              className={cn(
                "size-5",
                activeView === "order" ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span>ĐƠN HÀNG</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveView("menu")}
            className={cn(
              "flex-1 h-12 rounded-xl gap-3 text-sm font-black transition-all",
              activeView === "menu"
                ? "bg-background text-primary shadow-sm border border-border/50"
                : "text-muted-foreground hover:bg-background/50"
            )}
          >
            <UtensilsCrossed
              className={cn(
                "size-5",
                activeView === "menu" ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span>THỰC ĐƠN</span>
          </Button>
        </div>

        <div className="flex-1 min-h-0 border border-border bg-background rounded-b-2xl shadow-sm overflow-hidden flex flex-col relative z-0">
          {activeView === "order" ? <OrderBoard /> : <CardMenu />}
        </div>
      </div>

      {/* Right Column: Order Details */}
      <div className="flex-1 flex flex-col h-full min-h-0 w-full">
        <Tabs
          defaultValue="detail"
          className="flex-1 flex flex-col h-full min-h-0 w-full border bg-background rounded-xl shadow-sm overflow-hidden"
        >
          <div className="border-b bg-muted/20 flex items-center justify-between px-4 py-2 shrink-0 h-14">
            <div className="flex items-center gap-3 font-black text-primary text-base">
              <div className="flex items-center justify-center size-9 bg-primary/10 rounded-lg">
                <Armchair className="size-5" />
              </div>
              <span>Bàn 01</span>
            </div>
            <TabsList className="h-9 bg-muted p-1 rounded-t-lg">
              <TabsTrigger
                value="detail"
                className="h-full rounded-md text-xs px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Chi tiết
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="h-full rounded-md text-xs px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Lịch sử
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="detail"
            className="flex-1 m-0 p-0 min-h-0 overflow-hidden flex flex-col"
          >
            <OrderCurrent />
          </TabsContent>
          <TabsContent
            value="history"
            className="flex-1 m-0 p-0 min-h-0 overflow-hidden flex flex-col"
          >
            <EmptyState
              title="Chưa có lịch sử"
              description="Bàn này chưa có đơn hàng nào được hoàn thành"
              icon={UtensilsCrossed}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderPage;
