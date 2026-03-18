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

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-9 w-9 p-0 rounded-full">
            <Link href="/manager/inventory/check">
              <LucideArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {isNew
                ? UI_TEXT.INVENTORY.CHECK.CREATE.TITLE
                : `${UI_TEXT.INVENTORY.CHECK.TITLE} #${check?.inventoryCheckId.substring(0, 8).toUpperCase()}`}
              {!isNew && (
                <Badge
                  variant={isProcessed ? "success" : "warning"}
                  className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-sm"
                >
                  {isProcessed
                    ? UI_TEXT.INVENTORY.CHECK.STATUS_PROCESSED
                    : UI_TEXT.INVENTORY.CHECK.STATUS_DRAFT}
                </Badge>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">{UI_TEXT.INVENTORY.CHECK.CREATE.DESC}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(isNew || !isProcessed) && (
            <Button
              variant="outline"
              disabled={isSaving}
              onClick={handleSaveDraft}
              className="gap-2 rounded-full px-6 hover:bg-muted"
            >
              <LucideSave className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE.SAVE_DRAFT}
            </Button>
          )}
          {(isNew || !isProcessed) && (
            <Button
              disabled={isSaving}
              onClick={handleProcess}
              className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20"
            >
              <LucideCheckCircle2 className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE.PROCESS}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="rounded-2xl border-none shadow-soft overflow-hidden">
            <div className="h-1 bg-primary/20" />
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[100px] font-semibold uppercase text-[10px] tracking-wider text-muted-foreground pl-6">
                      {UI_TEXT.INVENTORY.TABLE.COL_SKU}
                    </TableHead>
                    <TableHead className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                      {UI_TEXT.INVENTORY.TABLE.COL_NAME}
                    </TableHead>
                    <TableHead className="text-center font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                      {UI_TEXT.INVENTORY.TABLE.COL_STOCK}
                    </TableHead>
                    <TableHead className="w-[150px] text-center font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                      {UI_TEXT.INVENTORY.CHECK.CREATE.COL_PHYSICAL_QTY}
                    </TableHead>
                    <TableHead className="text-center font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                      {UI_TEXT.INVENTORY.CHECK.CREATE.COL_DIFF_QTY}
                    </TableHead>
                    <TableHead className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground pr-6">
                      {UI_TEXT.INVENTORY.CHECK.CREATE.COL_REASON}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const diff = item.differenceQuantity || 0;
                    const diffColor =
                      diff > 0
                        ? "text-success"
                        : diff < 0
                          ? "text-destructive"
                          : "text-muted-foreground";

                    return (
                      <TableRow key={item.ingredientId} className="hover:bg-muted/30 group">
                        <TableCell className="font-mono text-xs font-medium pl-6">
                          {item.ingredientCode}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{item.ingredientName}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              {item.unit || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-foreground/80">
                          {item.bookQuantity}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          <Input
                            type="number"
                            disabled={isProcessed || isSaving}
                            value={item.physicalQuantity}
                            onChange={(e) =>
                              updatePhysicalQty(item.ingredientId!, Number(e.target.value))
                            }
                            className="text-center font-bold bg-muted/20 border-border/50 focus:ring-primary h-9 rounded-lg"
                          />
                        </TableCell>
                        <TableCell className={`text-center font-black ${diffColor}`}>
                          {diff > 0 ? `+${diff}` : diff}
                        </TableCell>
                        <TableCell className="pr-6">
                          <Input
                            disabled={isProcessed || isSaving}
                            value={item.reason || ""}
                            onChange={(e) => updateReason(item.ingredientId!, e.target.value)}
                            placeholder={
                              item.differenceQuantity !== 0
                                ? UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION
                                : ""
                            }
                            className="bg-transparent border-none px-0 text-sm italic h-9 focus-visible:ring-0"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Meta Info */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-none shadow-soft overflow-hidden px-5 py-6 space-y-5 bg-card">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <LucideCalendar className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  {UI_TEXT.INVENTORY.CHECK.COL_DATE}
                </span>
              </div>
              {isProcessed ? (
                <div className="p-3 bg-muted/50 rounded-xl text-sm font-medium">
                  {new Date(checkDate).toLocaleDateString("vi-VN", { dateStyle: "long" })}
                </div>
              ) : (
                <DateRangePicker
                  value={{ from: checkDate, to: checkDate }}
                  onChange={(range) => range?.from && setCheckDate(range.from)}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <LucideMessageSquare className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
                </span>
              </div>
              <Textarea
                disabled={isProcessed || isSaving}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION}
                className="min-h-[120px] bg-muted/20 border-border/50 rounded-xl resize-none text-sm p-4 focus:ring-primary"
              />
            </div>

            {!isNew && (
              <div className="pt-4 border-t border-border/50 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {UI_TEXT.INVENTORY.CHECK.COL_CREATOR}
                  </span>
                  <span className="font-semibold">{check?.createdBy || "Admin"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{UI_TEXT.INVENTORY.TABLE.COL_DATE}</span>
                  <span className="font-semibold">
                    {new Date(check?.createdAt || "").toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function CheckFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
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
        <div className="col-span-3 h-[600px] bg-muted rounded-2xl" />
        <div className="h-[400px] bg-muted rounded-2xl" />
      </div>
    </div>
  );
}
