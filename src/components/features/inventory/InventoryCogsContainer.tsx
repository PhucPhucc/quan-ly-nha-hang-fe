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

type InventoryCogsContainerProps = {
  embedded?: boolean;
};

export function InventoryCogsContainer({ embedded = false }: InventoryCogsContainerProps) {
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
    <div
      className={
        embedded
          ? "animate-in fade-in duration-500 space-y-6 overflow-x-hidden px-1 pt-4 sm:pt-6"
          : "mx-auto max-w-[1040px] animate-in fade-in pt-4 duration-500 space-y-8"
      }
    >
      <div className="flex flex-col gap-6">
        {/* Top Section: Info & Rules */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <InventoryCogsRules />
        </div>

        {/* Bottom Section: Form/Success Panel */}
        <div
          key={calculationResult ? "success-view" : "setup-view"}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        >
          {!calculationResult ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  {UI_TEXT.INVENTORY.COGS.FORM_TITLE}
                </h2>
                <p className="mt-1.5 ml-3 d-block text-sm text-slate-500 font-medium">
                  {UI_TEXT.INVENTORY.COGS.DESC}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-lg border border-slate-100 mb-6">
                <div className="space-y-2">
                  <p className="ml-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {UI_TEXT.INVENTORY.COGS.FROM_DATE}
                  </p>
                  <DatePicker
                    value={fromDate}
                    onChange={setFromDate}
                    placeholder={UI_TEXT.INVENTORY.COGS.FROM_DATE}
                    className="h-10 w-full rounded-lg border-slate-200 bg-white shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <p className="ml-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {UI_TEXT.INVENTORY.COGS.TO_DATE}
                  </p>
                  <DatePicker
                    value={toDate}
                    onChange={setToDate}
                    placeholder={UI_TEXT.INVENTORY.COGS.TO_DATE}
                    className="h-10 w-full rounded-lg border-slate-200 bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-blue-700">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <p className="text-xs font-semibold leading-relaxed">
                    {UI_TEXT.INVENTORY.COGS.NOTE}
                  </p>
                </div>

                <Button
                  onClick={handleCalculateClick}
                  disabled={!isFormValid || calculateMutation.isPending}
                  className="h-11 w-full rounded-lg bg-primary text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:bg-primary/95 active:scale-[0.99] disabled:opacity-40"
                >
                  {calculateMutation.isPending ? (
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Calculator className="mr-2 h-4 w-4" />
                  )}
                  {calculateMutation.isPending
                    ? UI_TEXT.INVENTORY.COGS.BTN_CALCULATING
                    : UI_TEXT.INVENTORY.COGS.BTN_CALCULATE}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-emerald-900">
                    {UI_TEXT.INVENTORY.COGS.SUCCESS_TITLE}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-emerald-700/80">
                    {UI_TEXT.INVENTORY.COGS.SUCCESS_DESC_PREFIX}{" "}
                    <span className="font-bold text-emerald-900">
                      {fromDate?.toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI)}
                    </span>{" "}
                    {UI_TEXT.INVENTORY.COGS.SUCCESS_DESC_TO}{" "}
                    <span className="font-bold text-emerald-900">
                      {toDate?.toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {UI_TEXT.INVENTORY.COGS.LABEL_RECEIPTS}
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                    {calculationResult.updatedReceipts}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {UI_TEXT.INVENTORY.COGS.LABEL_ITEMS}
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                    {calculationResult.updatedItems}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {UI_TEXT.INVENTORY.COGS.LABEL_ADJUSTMENT}
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-800">
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
                  className="h-10 rounded-lg border-slate-200 px-8 text-sm font-bold shadow-sm transition-all hover:bg-slate-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {UI_TEXT.INVENTORY.COGS.BTN_RECALCULATE}
                </Button>
              </div>
            </div>
          )}
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
            <AlertDialogCancel disabled={calculateMutation.isPending} className="h-11 rounded-lg">
              {UI_TEXT.COMMON.CLOSE}
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-11 rounded-lg bg-primary px-8"
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
