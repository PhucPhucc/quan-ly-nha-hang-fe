"use client";

import { ChevronDown, FileInput, FileOutput, History } from "lucide-react";
import React, { useState } from "react";

import { CreateStockInDrawer } from "@/components/features/inventory/CreateStockInDrawer";
import { CreateStockOutDrawer } from "@/components/features/inventory/CreateStockOutDrawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UI_TEXT } from "@/lib/UI_Text";

interface Props {
  onSuccess?: () => void;
}

export function CreateStockInTrigger({ onSuccess }: Props) {
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-9 w-auto gap-2 bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary-hover active:scale-[0.98]">
            <div className="flex size-5 items-center justify-center rounded-lg bg-white/20">
              <History className="size-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="whitespace-nowrap">{UI_TEXT.INVENTORY.CREATE_VOUCHER_BTN}</span>
            <ChevronDown className="size-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
          <DropdownMenuItem
            className="flex items-center gap-2 py-2.5 rounded-lg cursor-pointer transition-colors focus:bg-blue-50 focus:text-blue-600"
            onClick={() => setIsStockInOpen(true)}
          >
            <FileInput className="size-4" />
            <span className="font-medium">{UI_TEXT.INVENTORY.STOCK_IN_VOUCHER}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 py-2.5 rounded-lg cursor-pointer transition-colors focus:bg-red-50 focus:text-red-600"
            onClick={() => setIsStockOutOpen(true)}
          >
            <FileOutput className="size-4" />
            <span className="font-medium">{UI_TEXT.INVENTORY.STOCK_OUT_VOUCHER}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateStockInDrawer
        open={isStockInOpen}
        onOpenChange={setIsStockInOpen}
        onSuccess={() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.reload();
          }
        }}
      />
      <CreateStockOutDrawer
        onSuccess={() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.reload();
          }
        }}
        open={isStockOutOpen}
        onOpenChange={setIsStockOutOpen}
      />
    </>
  );
}
