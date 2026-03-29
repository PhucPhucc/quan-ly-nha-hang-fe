"use client";

import { PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

import { AddIngredientPanel } from "../AddIngredientPanel";

export function AddIngredientTrigger() {
  return (
    <AddIngredientPanel
      trigger={
        <Button
          variant="outline"
          className="w-full gap-2 border bg-card px-4 text-sm font-medium text-card-foreground shadow-sm transition-colors md:w-auto"
        >
          <div className="flex size-5 items-center justify-center rounded-lg bg-primary/10">
            <PackagePlus className="size-3.5 text-primary" strokeWidth={2.5} />
          </div>
          <span className="whitespace-nowrap">{UI_TEXT.INVENTORY.ADD_TITLE}</span>
        </Button>
      }
    />
  );
}
