"use client";

import { FileDown, LucideArrowLeft, LucideCheckCircle2, LucideSave } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { InventoryCheckStatus } from "@/types/Inventory";

import { InventoryCheckSidebar } from "./components/InventoryCheckSidebar";
import { InventoryCheckTable } from "./components/InventoryCheckTable";
import { useInventoryCheckForm } from "./useInventoryCheckForm";

interface InventoryCheckFormProps {
  id: string;
}

export function InventoryCheckForm({ id }: InventoryCheckFormProps) {
  const {
    isNew,
    check,
    isLoading,
    checkDate,
    setCheckDate,
    note,
    setNote,
    items,
    updatePhysicalQty,
    updateReason,
    handleSaveDraft,
    handleProcess,
    isSaving,
  } = useInventoryCheckForm(id);

  if (isLoading) {
    return <CheckFormSkeleton />;
  }

  const isProcessed = check?.status === InventoryCheckStatus.Processed;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10">
      {/* Header Area */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-10 w-10 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Link href="/manager/inventory/check">
              <LucideArrowLeft className="h-5 w-5 text-slate-500" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              {isNew
                ? UI_TEXT.INVENTORY.CHECK.CREATE.TITLE
                : `${UI_TEXT.INVENTORY.CHECK.TITLE} #${check?.inventoryCheckId.substring(0, 8).toUpperCase()}`}
              {!isNew && (
                <Badge
                  variant={isProcessed ? "default" : "secondary"}
                  className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none ${
                    isProcessed ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  }`}
                >
                  {isProcessed
                    ? UI_TEXT.INVENTORY.CHECK.STATUS_PROCESSED
                    : UI_TEXT.INVENTORY.CHECK.STATUS_DRAFT}
                </Badge>
              )}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {UI_TEXT.INVENTORY.CHECK.CREATE.DESC}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && (
            <Button
              variant="outline"
              className={cn(
                "h-10 gap-2 rounded-lg px-6 text-xs font-bold uppercase tracking-widest transition-all shadow-sm",
                isProcessed
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <FileDown className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE.BTN_EXPORT}
            </Button>
          )}

          {(isNew || !isProcessed) && (
            <Button
              variant="outline"
              disabled={isSaving}
              onClick={handleSaveDraft}
              className="h-10 gap-2 rounded-lg border-slate-200 px-6 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 shadow-sm"
            >
              <LucideSave className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE.SAVE_DRAFT}
            </Button>
          )}
          {(isNew || !isProcessed) && (
            <Button
              disabled={isSaving}
              onClick={handleProcess}
              className="h-10 gap-2 rounded-lg bg-primary px-8 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <LucideCheckCircle2 className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE.PROCESS}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <InventoryCheckTable
            items={items}
            isProcessed={isProcessed}
            isSaving={isSaving}
            updatePhysicalQty={updatePhysicalQty}
            updateReason={updateReason}
          />
        </div>
        <div className="space-y-6">
          <InventoryCheckSidebar
            check={check}
            isNew={isNew}
            isProcessed={isProcessed}
            isSaving={isSaving}
            checkDate={checkDate}
            setCheckDate={setCheckDate}
            note={note}
            setNote={setNote}
          />
        </div>
      </div>
    </div>
  );
}

function CheckFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-lg" />
          <div className="h-4 w-48 bg-muted rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-muted rounded-full" />
          <div className="h-10 w-32 bg-muted rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 h-[600px] bg-muted rounded-[2.5rem]" />
        <div className="h-[400px] bg-muted rounded-[2.5rem]" />
      </div>
    </div>
  );
}
