"use client";

import { useMutation } from "@tanstack/react-query";
import { Calculator, CheckCircle2, Info, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { DatePicker } from "@/components/shared/DatePicker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { RecalculateCogsResponse } from "@/types/Inventory";

import { InventoryCogsRules } from "./components/InventoryCogsRules";

export function InventoryCogsContainer() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [calculationResult, setCalculationResult] = useState<RecalculateCogsResponse | null>(null);

  const calculateMutation = useMutation({
    mutationFn: async () => {
      if (!fromDate || !toDate) {
        throw new Error(UI_TEXT.COMMON.SELECT_DATE_RANGE);
      }

      const response = await inventoryService.calculateCogs(
        fromDate.toISOString(),
        toDate.toISOString()
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(UI_TEXT.INVENTORY.COGS.SUCCESS_MSG);
      setCalculationResult(data);
      setShowConfirmDialog(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred");
      setShowConfirmDialog(false);
    },
  });

  const handleCalculateClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCalculate = () => {
    calculateMutation.mutate();
  };

  const handleReset = () => {
    setCalculationResult(null);
    setFromDate(undefined);
    setToDate(undefined);
  };

  const isFormValid = !!(fromDate && toDate);

  return (
    <div className="mx-auto max-w-[1040px] animate-in fade-in pt-4 duration-500 space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Form/Success Panel */}
        <div className="space-y-6 lg:col-span-2">
          {!calculationResult ? (
            <div className="rounded-[2rem] border-none bg-background/60 p-8 shadow-2xl shadow-primary/5 ring-1 ring-border/50 backdrop-blur-xl">
              <div className="mb-8">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
                  <div className="h-8 w-1.5 rounded-full bg-primary" />
                  {UI_TEXT.INVENTORY.COGS.FORM_TITLE}
                </h2>
                <p className="mt-2 ml-3.5 text-sm text-muted-foreground">
                  {UI_TEXT.INVENTORY.COGS.DESC}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-muted/30 p-6 flex flex-col items-stretch gap-6 lg:flex-row lg:items-end">
                <div className="flex-1 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="mb-1.5 ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {UI_TEXT.INVENTORY.COGS.FROM_DATE}
                    </p>
                    <DatePicker
                      value={fromDate}
                      onChange={setFromDate}
                      placeholder={UI_TEXT.INVENTORY.COGS.FROM_DATE}
                      className="w-full"
                    />
                  </div>
                  <div className="hidden h-8 w-px bg-border/50 sm:block mt-5" />
                  <div className="flex-1">
                    <p className="mb-1.5 ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {UI_TEXT.INVENTORY.COGS.TO_DATE}
                    </p>
                    <DatePicker
                      value={toDate}
                      onChange={setToDate}
                      placeholder={UI_TEXT.INVENTORY.COGS.TO_DATE}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-auto">
                  <Button
                    onClick={handleCalculateClick}
                    disabled={!isFormValid || calculateMutation.isPending}
                    className="h-11 w-full rounded-xl bg-primary px-10 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 lg:w-auto"
                  >
                    {calculateMutation.isPending ? (
                      <RotateCcw className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Calculator className="mr-2 h-5 w-5" />
                    )}
                    {calculateMutation.isPending
                      ? UI_TEXT.INVENTORY.COGS.BTN_CALCULATING
                      : UI_TEXT.INVENTORY.COGS.BTN_CALCULATE}
                  </Button>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-5 text-primary">
                <Info className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  {UI_TEXT.INVENTORY.COGS.NOTE}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border-none bg-success/5 p-10 shadow-2xl shadow-success/10 ring-1 ring-success/20 backdrop-blur-xl">
              <div className="mb-8 flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-success/20 text-success shadow-inner shadow-success/20">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-success">
                    {UI_TEXT.INVENTORY.COGS.SUCCESS_TITLE}
                  </h2>
                  <p className="mt-1 text-base font-medium text-success/80">
                    {UI_TEXT.INVENTORY.COGS.SUCCESS_DESC_PREFIX}{" "}
                    <span className="font-bold text-success">
                      {fromDate?.toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI)}
                    </span>{" "}
                    {UI_TEXT.INVENTORY.COGS.SUCCESS_DESC_TO}{" "}
                    <span className="font-bold text-success">
                      {toDate?.toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-border/50 bg-background/40 p-5 shadow-sm transition-all hover:shadow-md">
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {UI_TEXT.INVENTORY.COGS.LABEL_RECEIPTS}
                  </p>
                  <p className="mt-3 text-3xl font-black tabular-nums text-foreground">
                    {calculationResult.updatedReceipts}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-background/40 p-5 shadow-sm transition-all hover:shadow-md">
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {UI_TEXT.INVENTORY.COGS.LABEL_ITEMS}
                  </p>
                  <p className="mt-3 text-3xl font-black tabular-nums text-foreground">
                    {calculationResult.updatedItems}
                  </p>
                </div>
                <div className="rounded-2xl border border-success/10 bg-success/10 p-5 shadow-sm transition-all hover:shadow-md">
                  <p className="text-sm font-bold uppercase tracking-wider text-success/70">
                    {UI_TEXT.INVENTORY.COGS.LABEL_ADJUSTMENT}
                  </p>
                  <p className="mt-3 text-3xl font-black tabular-nums text-success">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculationResult.totalAdjustmentAmount)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 rounded-xl px-10 text-base font-bold transition-all hover:bg-muted"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  {UI_TEXT.INVENTORY.COGS.BTN_RECALCULATE}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Info Card */}
        <div className="lg:col-span-1">
          <InventoryCogsRules />
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="sm:max-w-[425px] rounded-[1.5rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Calculator className="h-5 w-5 text-primary" />
              {UI_TEXT.INVENTORY.COGS.CONFIRM_TITLE}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground mt-3">
              {UI_TEXT.INVENTORY.COGS.CONFIRM_DESC_PREFIX}{" "}
              <span className="font-bold text-foreground">
                {fromDate?.toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI) || "---"}
              </span>{" "}
              {UI_TEXT.INVENTORY.COGS.CONFIRM_DESC_TO}{" "}
              <span className="font-bold text-foreground">
                {toDate?.toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI) || "---"}
              </span>
              {UI_TEXT.INVENTORY.COGS.CONFIRM_DESC_SUFFIX}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2">
            <AlertDialogCancel disabled={calculateMutation.isPending} className="h-11 rounded-xl">
              {UI_TEXT.COMMON.CLOSE}
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-11 rounded-xl bg-primary px-8"
              onClick={(e) => {
                e.preventDefault();
                handleConfirmCalculate();
              }}
              disabled={calculateMutation.isPending}
            >
              {calculateMutation.isPending
                ? UI_TEXT.INVENTORY.COGS.BTN_RUNNING
                : UI_TEXT.INVENTORY.COGS.BTN_RUN_NOW}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
