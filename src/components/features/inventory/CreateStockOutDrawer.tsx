"use client";

import { Plus } from "lucide-react";
import React from "react";

import { DatePicker } from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";

import { INVENTORY_INPUT_CLASS } from "./components/inventoryStyles";
import { StockOutItemEntry } from "./components/StockOutItemEntry";
import { useCreateStockOut } from "./useCreateStockOut";

interface CreateStockOutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateStockOutDrawer = ({
  onSuccess,
  open,
  onOpenChange,
}: CreateStockOutDrawerProps) => {
  const { formatDate, formatCurrency } = useBrandingFormatter();
  const {
    ingredients,
    items,
    reason,
    setReason,
    note,
    setNote,
    stockOutDate,
    setStockOutDate,
    submitting,
    addItem,
    removeItem,
    updateItem,
    calculateTotal,
    handleSubmit,
  } = useCreateStockOut(open, onOpenChange, onSuccess);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 text-foreground sm:max-w-[500px]">
        <SheetHeader className="shrink-0 border-b bg-background/95 p-6 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SheetTitle className="text-xl font-bold text-destructive">
            {UI_TEXT.INVENTORY.STOCK_OUT_VOUCHER}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.STOCK_OUT.DATE}
              </Label>
              <DatePicker
                className="w-full"
                placeholder={formatDate(new Date())}
                value={stockOutDate}
                onChange={setStockOutDate}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.STOCK_OUT.REASON_FIELD}
              </Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={UI_TEXT.INVENTORY.STOCK_OUT.REASON_PLACEHOLDER}
                className={INVENTORY_INPUT_CLASS}
              />
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {UI_TEXT.INVENTORY.STOCK_OUT.REASON_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full border-dashed hover:bg-muted"
                    onClick={() => setReason(preset)}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.STOCK_OUT.NOTE_LABEL}
              </Label>
              <Textarea
                placeholder={UI_TEXT.INVENTORY.STOCK_OUT.NOTE_PLACEHOLDER}
                className="min-h-[80px] resize-none rounded-lg border-slate-200 bg-slate-50 text-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 py-2">
              <h3 className="flex items-center gap-2 text-base font-bold">
                {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] text-destructive">
                  {items.length}
                </span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                className="h-8 rounded-lg border-destructive/20 text-destructive hover:bg-destructive/5"
              >
                <Plus className="mr-1.5 size-3.5" /> {UI_TEXT.BUTTON.ADD}
              </Button>
            </div>

            <div className="space-y-4 pb-4">
              {items.map((item, index) => (
                <StockOutItemEntry
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

        <div className="shrink-0 space-y-4 border-t bg-muted/10 p-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold tracking-tight text-muted-foreground">
              {UI_TEXT.INVENTORY.OPENING_STOCK.TOTAL_VALUE}
            </span>
            <div className="text-right">
              <span className="text-2xl font-black tracking-tighter text-destructive">
                {formatCurrency(calculateTotal())}
              </span>
              <span className="ml-1 text-sm font-bold uppercase text-destructive">
                {UI_TEXT.COMMON.CURRENCY}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 flex-1 rounded-lg border-2 font-semibold"
            >
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button
              variant="destructive"
              disabled={submitting || items.length === 0 || items.every((i) => !i.ingredientId)}
              onClick={handleSubmit}
              className="h-11 flex-[1.5] rounded-lg font-bold shadow-lg shadow-destructive/20"
            >
              {submitting ? UI_TEXT.COMMON.PROCESSING : UI_TEXT.COMMON.SAVE}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
