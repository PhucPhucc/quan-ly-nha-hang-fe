"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryExpiryAlertItem } from "@/types/Inventory";

interface DisposeLotModalProps {
  item: InventoryExpiryAlertItem;
  onSuccess?: () => void;
}

export function DisposeLotModal({ item, onSuccess }: DisposeLotModalProps) {
  const [open, setOpen] = useState(false);
  const [quantityToDispose, setQuantityToDispose] = useState("");
  const [reason, setReason] = useState(UI_TEXT.INVENTORY.LOTS.DISPOSE.PRESET_REASONS[0]);
  const [quantityError, setQuantityError] = useState("");
  const [reasonError, setReasonError] = useState("");
  const queryClient = useQueryClient();
  const availableQuantity = Number(item.remainingQuantity);

  const resetForm = () => {
    setQuantityToDispose("");
    setReason(UI_TEXT.INVENTORY.LOTS.DISPOSE.PRESET_REASONS[0]);
    setQuantityError("");
    setReasonError("");
  };

  const validateQuantity = (value: string) => {
    if (!value.trim()) {
      return UI_TEXT.INVENTORY.LOTS.DISPOSE.VALIDATION.QTY_REQUIRED;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return UI_TEXT.INVENTORY.LOTS.DISPOSE.VALIDATION.QTY_POSITIVE;
    }

    if (parsed > availableQuantity) {
      return UI_TEXT.INVENTORY.LOTS.DISPOSE.VALIDATION.QTY_EXCEEDED;
    }

    return "";
  };

  const validateReason = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return UI_TEXT.INVENTORY.LOTS.DISPOSE.VALIDATION.REASON_REQUIRED;
    }

    if (trimmed.length > 200) {
      return UI_TEXT.INVENTORY.LOTS.DISPOSE.VALIDATION.REASON_MAX;
    }

    return "";
  };

  const mutation = useMutation({
    mutationFn: () =>
      inventoryService.disposeLot(item.inventoryLotId, {
        quantity: Number(quantityToDispose),
        reason: reason.trim(),
      } as never),
    onSuccess: () => {
      toast.success(UI_TEXT.INVENTORY.LOTS.DISPOSE.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["inventory-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-alerts-badge"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-lots"] });
      onSuccess?.();
      setOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(UI_TEXT.INVENTORY.LOTS.DISPOSE.ERROR, {
        description: error.message,
      });
    },
  });

  const handleConfirm = () => {
    const nextQuantityError = validateQuantity(quantityToDispose);
    const nextReasonError = validateReason(reason);

    setQuantityError(nextQuantityError);
    setReasonError(nextReasonError);

    if (nextQuantityError || nextReasonError) {
      return;
    }

    mutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-danger hover:bg-danger/10 hover:text-danger"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          {UI_TEXT.INVENTORY.LOTS.DISPOSE.TITLE_SHORT}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-danger">
            <Trash2 className="h-5 w-5" />
            {UI_TEXT.INVENTORY.LOTS.DISPOSE.TITLE}
          </DialogTitle>
          <DialogDescription>{UI_TEXT.INVENTORY.LOTS.DISPOSE.DESC}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="rounded-2xl border border-danger/15 bg-danger/5 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-full bg-danger/10 p-2 text-danger">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {UI_TEXT.INVENTORY.LOTS.DISPOSE.INFO_TITLE}
                </p>
                <p className="text-xs text-muted-foreground">
                  {UI_TEXT.INVENTORY.LOTS.DISPOSE.INFO_DESC}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-background px-3 py-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {UI_TEXT.INVENTORY.LOTS.DISPOSE.LABEL_NAME}
                </p>
                <p className="text-sm font-bold text-foreground">{item.ingredientName}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background px-3 py-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {UI_TEXT.INVENTORY.LOTS.DISPOSE.LABEL_CODE}
                </p>
                <p className="truncate font-mono text-sm font-bold uppercase text-foreground">
                  {item.lotCode || UI_TEXT.COMMON.NOT_APPLICABLE}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background px-3 py-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {UI_TEXT.INVENTORY.LOTS.DISPOSE.LABEL_AVAILABLE}
                </p>
                <p className="text-sm font-black tabular-nums text-danger">
                  {item.remainingQuantity} {item.unit}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor={`dispose-qty-${item.inventoryLotId}`}
                className="text-sm font-semibold"
              >
                {UI_TEXT.INVENTORY.LOTS.DISPOSE.LABEL_QTY}
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
                onClick={() => {
                  setQuantityToDispose(String(availableQuantity));
                  setQuantityError("");
                }}
              >
                {UI_TEXT.INVENTORY.LOTS.DISPOSE.BTN_USE_MAX}
              </Button>
            </div>

            <div className="flex items-start gap-3">
              <Input
                id={`dispose-qty-${item.inventoryLotId}`}
                type="number"
                min={0}
                max={availableQuantity}
                step="0.01"
                value={quantityToDispose}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setQuantityToDispose(nextValue);
                  setQuantityError(validateQuantity(nextValue));
                }}
                className="h-12 text-right font-black tabular-nums"
                aria-invalid={Boolean(quantityError)}
                autoFocus
              />
              <div className="flex h-12 min-w-14 items-center justify-center rounded-lg border bg-muted/30 px-3 text-sm font-bold">
                {item.unit}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {UI_TEXT.INVENTORY.LOTS.DISPOSE.HELP_QTY}
            </p>
            {quantityError && <p className="text-xs font-medium text-danger">{quantityError}</p>}
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`dispose-reason-${item.inventoryLotId}`}
              className="text-sm font-semibold"
            >
              {UI_TEXT.INVENTORY.LOTS.DISPOSE.LABEL_REASON}
            </label>
            <div className="flex flex-wrap gap-2">
              {UI_TEXT.INVENTORY.LOTS.DISPOSE.PRESET_REASONS.map((presetReason) => {
                const active = reason.trim() === presetReason;
                return (
                  <button
                    key={presetReason}
                    type="button"
                    onClick={() => {
                      setReason(presetReason);
                      setReasonError("");
                    }}
                    className="rounded-full"
                  >
                    <Badge
                      variant="outline"
                      className={
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }
                    >
                      {presetReason}
                    </Badge>
                  </button>
                );
              })}
            </div>
            <Input
              id={`dispose-reason-${item.inventoryLotId}`}
              value={reason}
              onChange={(e) => {
                const nextReason = e.target.value;
                setReason(nextReason);
                setReasonError(validateReason(nextReason));
              }}
              placeholder={UI_TEXT.INVENTORY.LOTS.DISPOSE.PLACEHOLDER_REASON}
              maxLength={200}
              className="h-12"
              aria-invalid={Boolean(reasonError)}
            />
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{UI_TEXT.INVENTORY.LOTS.DISPOSE.HELP_REASON}</span>
              <span>
                {reason.trim().length}
                {UI_TEXT.INVENTORY.LOTS.DISPOSE.LIMIT_SUFFIX}
              </span>
            </div>
            {reasonError && <p className="text-xs font-medium text-danger">{reasonError}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
            disabled={mutation.isPending}
          >
            {UI_TEXT.INVENTORY.LOTS.DISPOSE.BTN_CANCEL}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={
              mutation.isPending ||
              !quantityToDispose.trim() ||
              !reason.trim() ||
              Boolean(quantityError) ||
              Boolean(reasonError)
            }
            className="min-w-36 bg-danger hover:bg-danger/90"
          >
            {mutation.isPending
              ? UI_TEXT.INVENTORY.LOTS.DISPOSE.BTN_DISPOSING
              : UI_TEXT.INVENTORY.LOTS.DISPOSE.BTN_CONFIRM}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
