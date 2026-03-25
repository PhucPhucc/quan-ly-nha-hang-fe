"use client";

import { Save, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";

import {
  INVENTORY_INPUT_CLASS,
  INVENTORY_PAGE_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
  INVENTORY_TOOLBAR_CLASS,
} from "./components/inventoryStyles";
import { OpeningStockSummary } from "./components/OpeningStockSummary";
import { OpeningStockTable } from "./components/OpeningStockTable";
import { useOpeningStockIngredients } from "./useOpeningStockIngredients";
import { useOpeningStockSubmit } from "./useOpeningStockSubmit";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;
const OVERWRITE_DIALOG = {
  title: OPENING_STOCK.PREVIEW_TITLE,
  description: OPENING_STOCK.PREVIEW_DESC,
  cancel: UI_TEXT.COMMON.CANCEL,
  confirm: OPENING_STOCK.PREVIEW_CONFIRM,
} as const;

function formatCooldownLabel(value: number) {
  if (value === 0) {
    return UI_TEXT.INVENTORY.SETTINGS.IMPORT_COOLDOWN_NONE;
  }

  return `${value} ${UI_TEXT.INVENTORY.SETTINGS.HOURS_SUFFIX}`;
}

export function OpeningStockEntry() {
  const {
    search,
    setSearch,
    ingredients,
    filteredIngredients,
    entryItems,
    totalValue,
    loading,
    isError,
    error,
    isLocked,
    lockedAt,
    lastImportedAtLabel,
    nextImportAllowedAtLabel,
    openingStockImportCooldownHours,
    handleInputChange,
  } = useOpeningStockIngredients();
  const { handleSaveAsync, saving, isOverwriteConfirmationError } = useOpeningStockSubmit();
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const submittedIngredients = useMemo(
    () =>
      ingredients.filter((item) => {
        const entryItem = entryItems[item.ingredientId];
        return (entryItem?.quantity ?? 0) > 0;
      }),
    [entryItems, ingredients]
  );

  const overwriteCandidates = useMemo(
    () => submittedIngredients.filter((item) => item.currentStock > 0),
    [submittedIngredients]
  );

  const totalPreviewQuantity = useMemo(
    () =>
      submittedIngredients.reduce(
        (sum, item) => sum + (entryItems[item.ingredientId]?.quantity ?? 0),
        0
      ),
    [entryItems, submittedIngredients]
  );

  const totalPreviewValue = useMemo(
    () =>
      submittedIngredients.reduce((sum, item) => {
        const entry = entryItems[item.ingredientId];
        return sum + (entry?.quantity ?? 0) * (entry?.costPrice ?? 0);
      }, 0),
    [entryItems, submittedIngredients]
  );

  const submitOpeningStock = async (confirmOverwrite: boolean) => {
    try {
      await handleSaveAsync(entryItems, confirmOverwrite);
      setIsPreviewDialogOpen(false);
    } catch (submitError) {
      if (isOverwriteConfirmationError(submitError)) {
        setIsPreviewDialogOpen(true);
      }
    }
  };

  const handlePrimarySave = async () => {
    if (isLocked || saving) {
      return;
    }

    setIsPreviewDialogOpen(true);
  };

  const handleConfirmOverwrite = async () => {
    await submitOpeningStock(overwriteCandidates.length > 0);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center px-4 text-center text-destructive">
        {error instanceof Error ? error.message : OPENING_STOCK.ERROR_FETCH}
      </div>
    );
  }

  return (
    <>
      <div className={INVENTORY_PAGE_CLASS}>
        <div className={INVENTORY_TOOLBAR_CLASS}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={OPENING_STOCK.SEARCH_PLACEHOLDER}
                className={INVENTORY_INPUT_CLASS + " pl-9"}
                value={search}
                disabled={isLocked}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <OpeningStockSummary totalValue={totalValue} />
              <Button
                onClick={handlePrimarySave}
                disabled={saving || isLocked}
                size="sm"
                className="h-9 bg-primary px-3 text-xs text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary-hover"
              >
                {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-3.5 w-3.5" />}
                {OPENING_STOCK.BTN_SAVE}
              </Button>
            </div>
          </div>

          {isLocked ? (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <p className="font-semibold">{OPENING_STOCK.LOCKED_TITLE}</p>
              <p className="mt-0.5 leading-relaxed">
                {OPENING_STOCK.LOCKED_DESC}
                {lockedAt
                  ? ` ${OPENING_STOCK.LOCKED_TIME} ${new Date(lockedAt).toLocaleString()}.`
                  : ""}
              </p>
              {lastImportedAtLabel ? (
                <p className="mt-1 leading-relaxed">
                  {OPENING_STOCK.LAST_IMPORT_TIME} {lastImportedAtLabel}.
                </p>
              ) : null}
              {nextImportAllowedAtLabel ? (
                <p className="mt-1 leading-relaxed">
                  {OPENING_STOCK.NEXT_IMPORT_ALLOWED} {nextImportAllowedAtLabel}.
                </p>
              ) : null}
            </div>
          ) : null}

          {!isLocked && (openingStockImportCooldownHours > 0 || lastImportedAtLabel) ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <p className="font-semibold">{OPENING_STOCK.IMPORT_COOLDOWN}</p>
              <p className="mt-0.5 leading-relaxed">
                {formatCooldownLabel(openingStockImportCooldownHours)}
                {lastImportedAtLabel
                  ? ` ${UI_TEXT.INVENTORY.OVERVIEW.SEP_DOT} ${OPENING_STOCK.LAST_IMPORT_TIME} ${lastImportedAtLabel}`
                  : ""}
                {nextImportAllowedAtLabel
                  ? ` ${UI_TEXT.INVENTORY.OVERVIEW.SEP_DOT} ${OPENING_STOCK.NEXT_IMPORT_ALLOWED} ${nextImportAllowedAtLabel}`
                  : ""}
              </p>
            </div>
          ) : null}
        </div>

        <div className={INVENTORY_TABLE_SURFACE_CLASS}>
          <OpeningStockTable
            ingredients={filteredIngredients}
            entryItems={entryItems}
            disabled={isLocked}
            onInputChange={handleInputChange}
          />
        </div>
      </div>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <TriangleAlert className="h-5 w-5" />
              {OVERWRITE_DIALOG.title}
            </DialogTitle>
            <DialogDescription>{OVERWRITE_DIALOG.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">{OPENING_STOCK.PREVIEW_TOTAL_ITEMS}</p>
              <p className="mt-1 text-lg font-semibold">{submittedIngredients.length}</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">
                {OPENING_STOCK.PREVIEW_TOTAL_QUANTITY}
              </p>
              <p className="mt-1 text-lg font-semibold">{totalPreviewQuantity.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">{OPENING_STOCK.PREVIEW_TOTAL_VALUE}</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(totalPreviewValue)}</p>
            </div>
            <div className="rounded-lg border bg-amber-50 p-3">
              <p className="text-xs text-muted-foreground">
                {OPENING_STOCK.PREVIEW_OVERWRITE_ITEMS}
              </p>
              <p className="mt-1 text-lg font-semibold">{overwriteCandidates.length}</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">
                {OPENING_STOCK.PREVIEW_EXISTING_STOCK_ITEMS}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {ingredients.filter((item) => item.currentStock > 0).length}
              </p>
            </div>
          </div>

          {overwriteCandidates.length > 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold">{OPENING_STOCK.PREVIEW_LIST_TITLE}</p>
              <div className="mt-2 max-h-56 space-y-2 overflow-y-auto">
                {overwriteCandidates.map((item) => {
                  const nextQuantity = entryItems[item.ingredientId]?.quantity ?? 0;

                  return (
                    <div
                      key={item.ingredientId}
                      className="flex items-start justify-between gap-3 rounded-md border border-amber-100 bg-white px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.code}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p>
                          {UI_TEXT.INVENTORY.FORM.CURRENT_STOCK}
                          {": "}
                          {item.currentStock.toLocaleString()}
                        </p>
                        <p>
                          {UI_TEXT.INVENTORY.OPENING_STOCK.IMPORT_QTY}
                          {": "}
                          {nextQuantity.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-slate-50 px-3 py-4 text-center text-sm text-muted-foreground">
              {submittedIngredients.length > 0
                ? OPENING_STOCK.PREVIEW_NO_OVERWRITE
                : OPENING_STOCK.VALIDATION_REQUIRED}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(false)}
              disabled={saving}
            >
              {OVERWRITE_DIALOG.cancel}
            </Button>
            <Button
              onClick={handleConfirmOverwrite}
              disabled={saving || submittedIngredients.length === 0}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              {saving ? <Spinner className="mr-2" /> : null}
              {OVERWRITE_DIALOG.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
