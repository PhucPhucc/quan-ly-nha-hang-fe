"use client";

import { ClipboardList, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { useOrderBoardStore } from "@/store/useOrderStore";

import CardMenu from "./orderMenu/CardMenu";
import OrderBoard from "./orderTable/OrderBoard";

const OrderViewSelector = () => {
  const activeView = useOrderBoardStore((s) => s.activeView);
  const setActiveView = useOrderBoardStore((s) => s.setActiveView);

  return (
    <div className="flex-[1.8] flex flex-col h-full min-w-0 border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex bg-accent p-1 rounded-t-2xl border border-b-0 border-border gap-2">
        <Button
          variant="ghost"
          onClick={() => setActiveView("order")}
          className={cn(
            "flex-1 h-12 rounded-xl gap-3 text-sm font-black transition-all",
            activeView === "order"
              ? "bg-card hover:bg-card/90 text-primary shadow-sm border border-border"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <ClipboardList className="size-5" />
          <span>{UI_TEXT.ORDER.TAB_ORDER}</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveView("menu")}
          className={cn(
            "flex-1 h-12 rounded-xl gap-3 text-sm font-black transition-all",
            activeView === "menu"
              ? "bg-card hover:bg-card/90 text-primary shadow-sm border border-border"
              : "text-muted-foreground hover:text-primary "
          )}
        >
          <UtensilsCrossed className="size-5" />
          <span>{UI_TEXT.ORDER.TAB_MENU}</span>
        </Button>
      </div>

      <div className="flex-1 min-h-0 border border-border bg-card rounded-b-2xl shadow-sm overflow-hidden flex flex-col relative z-0">
        {activeView === "order" ? <OrderBoard /> : <CardMenu />}
      </div>
    </div>
  );
};

export default OrderViewSelector;
