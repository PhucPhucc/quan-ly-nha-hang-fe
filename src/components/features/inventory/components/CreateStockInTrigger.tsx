"use client";

import { ChevronDown, FileInput, FileOutput } from "lucide-react";
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
          <Button>
            <span className="whitespace-nowrap">{UI_TEXT.INVENTORY.CREATE_VOUCHER_BTN}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-lg p-2">
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
