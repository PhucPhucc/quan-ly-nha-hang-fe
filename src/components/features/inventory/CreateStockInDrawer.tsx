"use client";

import { Plus } from "lucide-react";
import React from "react";

import { DatePicker } from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";

import { StockInItemEntry } from "./components/StockInItemEntry";
import { useCreateStockIn } from "./useCreateStockIn";

interface CreateStockInDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateStockInDrawer = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateStockInDrawerProps) => {
  const { formatDate, formatCurrency } = useBrandingFormatter();
  const {
    ingredients,
    items,
    note,
    setNote,
    receivedDate,
    setReceivedDate,
    submitting,
    addItem,
    removeItem,
    updateItem,
    calculateTotal,
    handleSubmit,
  } = useCreateStockIn(open, onOpenChange, onSuccess);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] w-full flex flex-col p-0 text-foreground">
        <SheetHeader className="p-6 border-b shrink-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SheetTitle className="text-xl font-bold">
            {UI_TEXT.INVENTORY.STOCK_IN_VOUCHER}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.TABLE.COL_DATE}
              </Label>
              <DatePicker
                className="w-full"
                placeholder={formatDate(new Date())}
                value={receivedDate}
                onChange={setReceivedDate}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
              </Label>
              <Textarea
                placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION}
                className="bg-background min-h-[80px] rounded-lg resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between sticky top-0 bg-background/95 py-2 z-10">
              <h3 className="font-bold text-base flex items-center gap-2">
                {UI_TEXT.INVENTORY.OPENING_STOCK.COL_NAME}
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                className="h-8 rounded-lg border-primary/20 hover:bg-primary/5 text-primary"
              >
                <Plus className="mr-1.5 size-3.5" /> {UI_TEXT.BUTTON.ADD}
              </Button>
            </div>

            <div className="space-y-4 pb-4">
              {items.map((item, index) => (
                <StockInItemEntry
                  key={index}
                  index={index}
                  item={item}
                  ingredients={ingredients}
                  updateItem={updateItem}
                  removeItem={removeItem}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-muted/10 shrink-0 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold text-muted-foreground tracking-tight">
              {UI_TEXT.INVENTORY.OPENING_STOCK.TOTAL_VALUE}
            </span>
            <div className="text-right">
              <span className="text-2xl font-black text-primary tracking-tighter">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-lg font-semibold border-2"
            >
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button
              disabled={submitting || items.length === 0 || items.every((i) => !i.ingredientId)}
              onClick={handleSubmit}
              className="flex-[1.5] h-11 rounded-lg bg-primary hover:bg-primary-hover font-bold shadow-lg shadow-primary/20"
            >
              {submitting ? UI_TEXT.COMMON.PROCESSING : UI_TEXT.COMMON.SAVE}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
