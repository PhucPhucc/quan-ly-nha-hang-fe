import { Calculator } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";

export function InventoryCogsRules() {
  return (
    <div className="bg-slate-50/50 p-6 rounded-lg border border-slate-200 shadow-sm backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Calculator className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-base tracking-tight text-slate-900">
          {UI_TEXT.INVENTORY.COGS.FORMULA_TITLE}
        </h3>
      </div>

      <div className="relative p-6 mb-6 rounded-lg bg-white border border-slate-100 overflow-hidden text-center shadow-sm">
        <p className="text-sm font-semibold leading-relaxed text-slate-700 tracking-tight">
          {UI_TEXT.INVENTORY.COGS.FORMULA}
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {[
          UI_TEXT.INVENTORY.COGS.RULE_1,
          UI_TEXT.INVENTORY.COGS.RULE_2,
          UI_TEXT.INVENTORY.COGS.RULE_3,
          UI_TEXT.INVENTORY.COGS.RULE_4,
        ].map((rule, idx) => (
          <div key={idx} className="flex gap-3 group">
            <div className="h-5 w-5 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 transition-all group-hover:border-primary/30 group-hover:bg-primary/5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-xs font-semibold text-slate-500 leading-relaxed transition-colors group-hover:text-slate-900">
              {rule}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
