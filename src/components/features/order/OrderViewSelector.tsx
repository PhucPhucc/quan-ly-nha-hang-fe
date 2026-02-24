"use client";

import { ClipboardList, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import CardMenu from "./orderMenu/CardMenu";
import OrderBoard from "./orderTable/OrderBoard";

const OrderViewSelector = () => {
  const [activeView, setActiveView] = useState<"order" | "menu">("order");

  return (
    <div className="flex-[1.8] flex flex-col h-full min-w-0">
      <div className="flex bg-muted/30 p-1 rounded-t-2xl border border-b-0 border-border gap-2">
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
  );
};

export default OrderViewSelector;
