"use client";

import {
  LucideArrowLeft,
  LucideCalendar,
  LucideCheckCircle2,
  LucideMessageSquare,
  LucideSave,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryCheckStatus } from "@/types/Inventory";

import {
  INVENTORY_DETAIL_CARD_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./components/inventoryStyles";
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
    <div className="space-y-8 p-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-12 w-12 p-0 rounded-2xl bg-background border-2 shadow-sm hover:bg-muted/50 transition-all"
          >
            <Link href="/manager/inventory/check">
              <LucideArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-4">
              {isNew
                ? UI_TEXT.INVENTORY.CHECK.CREATE.TITLE
                : `${UI_TEXT.INVENTORY.CHECK.TITLE} #${check?.inventoryCheckId.substring(0, 8).toUpperCase()}`}
              {!isNew && (
                <Badge
                  variant={isProcessed ? "default" : "secondary"}
                  className={`rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-md border-none ${
                    isProcessed ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  }`}
                >
                  {isProcessed
                    ? UI_TEXT.INVENTORY.CHECK.STATUS_PROCESSED
                    : UI_TEXT.INVENTORY.CHECK.STATUS_DRAFT}
                </Badge>
              )}
            </h2>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest opacity-60">
              {UI_TEXT.INVENTORY.CHECK.CREATE.DESC}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {(isNew || !isProcessed) && (
            <Button
              variant="outline"
              disabled={isSaving}
              onClick={handleSaveDraft}
              className="gap-2 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[11px] border-2 hover:bg-muted transition-all"
            >
              <LucideSave className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE.SAVE_DRAFT}
            </Button>
          )}
          {(isNew || !isProcessed) && (
            <Button
              disabled={isSaving}
              onClick={handleProcess}
              className="gap-2 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <LucideCheckCircle2 className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE.PROCESS}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-[2.5rem] border bg-card shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm border-b">
                  <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
                    <TableHead className={`${INVENTORY_TH_CLASS} pl-8`}>
                      {UI_TEXT.INVENTORY.TABLE.COL_SKU}
                    </TableHead>
                    <TableHead className={INVENTORY_TH_CLASS}>
                      {UI_TEXT.INVENTORY.TABLE.COL_NAME}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                      {UI_TEXT.INVENTORY.TABLE.COL_STOCK}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} w-[150px] text-center`}>
                      {UI_TEXT.INVENTORY.CHECK.CREATE.COL_PHYSICAL_QTY}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                      {UI_TEXT.INVENTORY.CHECK.CREATE.COL_DIFF_QTY}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} pr-8`}>
                      {UI_TEXT.INVENTORY.CHECK.CREATE.COL_REASON}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const diff = item.differenceQuantity || 0;
                    const diffColor =
                      diff > 0
                        ? "text-emerald-500"
                        : diff < 0
                          ? "text-destructive"
                          : "text-muted-foreground/40";

                    return (
                      <TableRow key={item.ingredientId} className={INVENTORY_TROW_CLASS}>
                        <TableCell className="font-mono text-[11px] font-bold text-muted-foreground/60 uppercase pl-8">
                          {item.ingredientCode}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-black text-foreground/80 tracking-tight">
                              {item.ingredientName}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50 uppercase font-black tracking-widest">
                              {item.unit || UI_TEXT.COMMON.DASH}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-black tabular-nums text-foreground/80">
                          {item.bookQuantity}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Input
                            type="number"
                            disabled={isProcessed || isSaving}
                            value={item.physicalQuantity}
                            onChange={(e) =>
                              updatePhysicalQty(item.ingredientId!, Number(e.target.value))
                            }
                            className="text-center font-black bg-muted/20 border-border/50 focus:bg-background h-11 rounded-xl transition-all shadow-inner"
                          />
                        </TableCell>
                        <TableCell
                          className={`text-center font-black tabular-nums text-lg ${diffColor} bg-muted/5`}
                        >
                          {diff > 0 ? `${UI_TEXT.INVENTORY.TABLE.PLUS_SIGN}${diff}` : diff}
                        </TableCell>
                        <TableCell className="pr-8">
                          <Input
                            disabled={isProcessed || isSaving}
                            value={item.reason || ""}
                            onChange={(e) => updateReason(item.ingredientId!, e.target.value)}
                            placeholder={
                              item.differenceQuantity !== 0
                                ? UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION
                                : ""
                            }
                            className="bg-transparent border-none px-0 text-sm font-medium italic h-11 focus-visible:ring-0 placeholder:text-muted-foreground/20"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="h-12 bg-muted/5 border-t border-border/30" />
          </div>
        </div>

        {/* Right Side: Meta Info */}
        <div className="space-y-6">
          <div
            className={`${INVENTORY_DETAIL_CARD_CLASS} bg-card p-8 space-y-8 shadow-xl border-border/40 rounded-[2.5rem]`}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-primary/60">
                <LucideCalendar className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {UI_TEXT.INVENTORY.CHECK.COL_DATE}
                </span>
              </div>
              {isProcessed ? (
                <div className="p-4 bg-muted/30 rounded-2xl text-sm font-black text-foreground/60 border border-dashed text-center">
                  {new Date(checkDate).toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI, {
                    dateStyle: "long",
                  })}
                </div>
              ) : (
                <div className="[&_button]:h-12 [&_button]:rounded-2xl [&_button]:bg-muted/20 [&_button]:border-none [&_button]:font-black [&_button]:text-[11px] [&_button]:uppercase [&_button]:tracking-widest shadow-none">
                  <DateRangePicker
                    value={{ from: checkDate, to: checkDate }}
                    onChange={(range: DateRange | undefined) =>
                      range?.from && setCheckDate(range.from)
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3 text-primary/60">
                <LucideMessageSquare className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
                </span>
              </div>
              <Textarea
                disabled={isProcessed || isSaving}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION}
                className="min-h-[160px] bg-muted/10 border-border/30 rounded-2xl resize-none text-sm font-medium p-5 focus:bg-background transition-all focus:ring-primary/20 shadow-inner"
              />
            </div>

            {!isNew && (
              <div className="pt-8 border-t border-border/50 space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                  <span className="text-muted-foreground/50">
                    {UI_TEXT.INVENTORY.CHECK.COL_CREATOR}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-foreground/70 bg-muted/30 px-3 py-1 rounded-lg border-none font-black"
                  >
                    {check?.createdBy || UI_TEXT.COMMON.DASH}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                  <span className="text-muted-foreground/50">
                    {UI_TEXT.INVENTORY.TABLE.COL_DATE}
                  </span>
                  <span className="text-foreground/70 font-black">
                    {new Date(check?.createdAt || "").toLocaleString(UI_TEXT.COMMON.LOCALE_VI)}
                  </span>
                </div>
              </div>
            )}
          </div>
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
