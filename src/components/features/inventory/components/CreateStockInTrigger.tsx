"use client";

import { ChevronDown, FileInput, FileOutput, History } from "lucide-react";
import React, { useState } from "react";

import { CreateStockInDrawer } from "@/app/(protected)/manager/inventory/stock-in/_components/CreateStockInDrawer";
import { CreateStockOutDrawer } from "@/app/(protected)/manager/inventory/stock-out/_components/CreateStockOutDrawer";
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
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 gap-2.5 px-6 font-semibold rounded-2xl uppercase tracking-wider text-[11px] h-11 w-full md:w-auto transition-all active:scale-95 border-none">
            <div className="flex items-center justify-center size-5 bg-white/20 rounded-lg">
              <History className="size-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span>{UI_TEXT.INVENTORY.CREATE_VOUCHER_BTN}</span>
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
