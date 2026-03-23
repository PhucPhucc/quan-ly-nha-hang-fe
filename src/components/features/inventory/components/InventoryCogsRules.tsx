import { Calculator } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";

export function InventoryCogsRules() {
  return (
    <div className="bg-background/40 p-6 rounded-[2rem] border border-border/50 shadow-sm backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Calculator className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg tracking-tight text-foreground">
          {UI_TEXT.INVENTORY.COGS.FORMULA_TITLE}
        </h3>
      </div>

      <div className="relative p-7 mb-8 rounded-[1.5rem] bg-muted/30 border border-border/50 overflow-hidden text-center">
        <p className="text-[0.95rem] font-medium leading-relaxed text-foreground/90 tracking-tight">
          {UI_TEXT.INVENTORY.COGS.FORMULA}
        </p>
      </div>

      <div className="space-y-5 flex-1">
        <div className="flex gap-4 group">
          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-all group-hover:bg-primary/20">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground leading-relaxed transition-colors group-hover:text-foreground">
            {UI_TEXT.INVENTORY.COGS.RULE_1}
          </span>
        </div>
        <div className="flex gap-4 group">
          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-all group-hover:bg-primary/20">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground leading-relaxed transition-colors group-hover:text-foreground">
            {UI_TEXT.INVENTORY.COGS.RULE_2}
          </span>
        </div>
        <div className="flex gap-4 group">
          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-all group-hover:bg-primary/20">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground leading-relaxed transition-colors group-hover:text-foreground">
            {UI_TEXT.INVENTORY.COGS.RULE_3}
          </span>
        </div>
        <div className="flex gap-4 group">
          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-all group-hover:bg-primary/20">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground leading-relaxed transition-colors group-hover:text-foreground">
            {UI_TEXT.INVENTORY.COGS.RULE_4}
          </span>
        </div>
      </div>
    </div>
  );
}
