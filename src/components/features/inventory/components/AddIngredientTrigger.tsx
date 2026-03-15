"use client";

import { PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

import { AddIngredientPanel } from "../AddIngredientPanel";

export function AddIngredientTrigger() {
  return (
    <AddIngredientPanel
      trigger={
        <Button className="bg-[#cc0000] hover:bg-[#aa0000] shadow-md shadow-red-100 gap-2.5 px-6 font-semibold rounded-2xl uppercase tracking-wider text-[11px] h-11 w-full md:w-auto transition-all active:scale-95 border-none">
          <div className="flex items-center justify-center size-5 bg-white/20 rounded-lg">
            <PackagePlus className="size-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span>{UI_TEXT.INVENTORY.ADD_TITLE}</span>
        </Button>
      }
    />
  );
}
