"use client";

import { Minus, Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";

interface SelectionDialogFooterProps {
  quantity: number;
  totalPrice: number;
  loading: boolean;
  onQuantityChange: (delta: number) => void;
  onAddToCart: () => void;
}

export const SelectionDialogFooter: React.FC<SelectionDialogFooterProps> = ({
  quantity,
  totalPrice,
  loading,
  onQuantityChange,
  onAddToCart,
}) => {
  return (
    <DialogFooter className="p-4 border-t bg-white shrink-0">
      <div className="flex flex-row items-center justify-between gap-4 w-full">
        {/* Quantity Control */}
        <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md bg-white shadow-sm hover:bg-white/80"
            onClick={() => onQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-bold w-4 text-center text-sm">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md bg-white shadow-sm hover:bg-white/80"
            onClick={() => onQuantityChange(1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="flex-1 h-10 font-bold shadow-lg shadow-primary/20"
          onClick={onAddToCart}
          disabled={loading}
        >
          {UI_TEXT.MENU.OPTIONS.ADD_TO_ORDER} {formatCurrency(totalPrice)}
        </Button>
      </div>
    </DialogFooter>
  );
};
