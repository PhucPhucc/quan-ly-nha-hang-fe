"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Save, Search, TriangleAlert } from "lucide-react";
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

import { InventoryImportExcelDialog } from "./components/InventoryImportExcelDialog";
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
  const queryClient = useQueryClient();
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
    () =>
      submittedIngredients
        .filter((item) => item.currentStock > 0)
        .sort((a, b) => a.name.localeCompare(b.name, "vi")),
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
              <InventoryImportExcelDialog
                onImport={() =>
                  queryClient.invalidateQueries({ queryKey: ["opening-stock-ingredients"] })
                }
                disabled={isLocked}
              />

              <Button
                onClick={handlePrimarySave}
                disabled={saving || isLocked}
                size="sm"
                className="h-12 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary-hover"
              >
                {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-3.5 w-3.5" />}
                {OPENING_STOCK.BTN_SAVE}
              </Button>
            </div>
          </div>

          {isLocked ? (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <span className="font-semibold mr-1.5">{OPENING_STOCK.LOCKED_TITLE}</span>
              <span className="leading-relaxed">
                {OPENING_STOCK.LOCKED_DESC}
                {lockedAt
                  ? ` ${OPENING_STOCK.LOCKED_TIME} ${new Date(lockedAt).toLocaleString()}.`
                  : ""}
                {lastImportedAtLabel ? (
                  <>
                    <span className="mx-1 text-amber-300">
                      {UI_TEXT.INVENTORY.OVERVIEW.SEP_DOT}
                    </span>
                    {OPENING_STOCK.LAST_IMPORT_TIME} {lastImportedAtLabel}.
                  </>
                ) : null}
                {nextImportAllowedAtLabel ? (
                  <>
                    <span className="mx-1 text-amber-300">
                      {UI_TEXT.INVENTORY.OVERVIEW.SEP_DOT}
                    </span>
                    {OPENING_STOCK.NEXT_IMPORT_ALLOWED} {nextImportAllowedAtLabel}.
                  </>
                ) : null}
              </span>
            </div>
          ) : null}

          {!isLocked && (openingStockImportCooldownHours > 0 || lastImportedAtLabel) ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <span className="font-semibold">{OPENING_STOCK.IMPORT_COOLDOWN}</span>
              <span className="leading-relaxed">
                {formatCooldownLabel(openingStockImportCooldownHours)}
                {lastImportedAtLabel
                  ? ` ${UI_TEXT.INVENTORY.OVERVIEW.SEP_DOT} ${OPENING_STOCK.LAST_IMPORT_TIME} ${lastImportedAtLabel}`
                  : ""}
                {nextImportAllowedAtLabel
                  ? ` ${UI_TEXT.INVENTORY.OVERVIEW.SEP_DOT} ${OPENING_STOCK.NEXT_IMPORT_ALLOWED} ${nextImportAllowedAtLabel}`
                  : ""}
              </span>
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

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm transition-all hover:bg-slate-50">
              <div className="min-h-10">
                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                  {OPENING_STOCK.PREVIEW_TOTAL_ITEMS}
                </p>
              </div>
              <p className="mt-1 text-xl font-extrabold text-slate-900">
                {submittedIngredients.length.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm transition-all hover:bg-slate-50">
              <div className="min-h-10">
                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                  {OPENING_STOCK.PREVIEW_TOTAL_QUANTITY}
                </p>
              </div>
              <p className="mt-1 text-xl font-extrabold text-slate-900">
                {totalPreviewQuantity.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm transition-all hover:bg-slate-50">
              <div className="min-h-10">
                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                  {OPENING_STOCK.PREVIEW_TOTAL_VALUE}
                </p>
              </div>
              <p className="mt-1 break-all text-xl font-extrabold text-slate-900">
                {formatCurrency(totalPreviewValue)}
              </p>
            </div>

            <div className="flex flex-col rounded-xl border border-amber-200 bg-amber-50/60 p-3 shadow-sm transition-all hover:bg-amber-50">
              <div className="min-h-10">
                <p className="text-[10px] font-bold uppercase tracking-tight text-amber-700/80">
                  {OPENING_STOCK.PREVIEW_OVERWRITE_ITEMS}
                </p>
              </div>
              <p className="mt-1 text-xl font-extrabold text-amber-700">
                {overwriteCandidates.length.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm transition-all hover:bg-slate-50">
              <div className="min-h-10">
                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                  {OPENING_STOCK.PREVIEW_EXISTING_STOCK_ITEMS}
                </p>
              </div>
              <p className="mt-1 text-xl font-extrabold text-slate-900">
                {ingredients.filter((item) => item.currentStock > 0).length.toLocaleString()}
              </p>
            </div>
          </div>

          {overwriteCandidates.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 text-sm text-amber-900">
              <p className="flex items-center gap-2 font-bold text-amber-800">
                <TriangleAlert className="h-4 w-4" />
                {OPENING_STOCK.PREVIEW_LIST_TITLE}
              </p>
              <div className="mt-2.5 max-h-52 space-y-2 overflow-y-auto pr-1">
                {overwriteCandidates.map((item) => {
                  const nextQuantity = entryItems[item.ingredientId]?.quantity ?? 0;

                  return (
                    <div
                      key={item.ingredientId}
                      className="flex items-start justify-between gap-3 rounded-lg border border-amber-100 bg-white/80 p-2.5 transition-colors hover:bg-white"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-medium text-slate-400">{item.code}</p>
                      </div>
                      <div className="text-right text-[11px] leading-relaxed text-slate-600">
                        <p>
                          {UI_TEXT.INVENTORY.FORM.CURRENT_STOCK}:{" "}
                          <span className="font-bold">{item.currentStock.toLocaleString()}</span>
                        </p>
                        <p className="text-amber-600">
                          {UI_TEXT.INVENTORY.OPENING_STOCK.IMPORT_QTY}:{" "}
                          <span className="font-bold">{nextQuantity.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/60 py-5 text-center">
              {submittedIngredients.length > 0 ? (
                <>
                  <CheckCircle2 className="mb-2 h-6 w-6 text-emerald-500" />
                  <p className="text-sm font-medium text-slate-700">
                    {OPENING_STOCK.PREVIEW_NO_OVERWRITE}
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-slate-500">
                  {OPENING_STOCK.VALIDATION_REQUIRED}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="mt-2 flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(false)}
              disabled={saving}
              className="h-11 rounded-xl px-6 font-medium"
            >
              {OVERWRITE_DIALOG.cancel}
            </Button>
            <Button
              onClick={handleConfirmOverwrite}
              disabled={saving || submittedIngredients.length === 0}
              className="h-11 rounded-xl bg-amber-600 px-8 font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700"
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
