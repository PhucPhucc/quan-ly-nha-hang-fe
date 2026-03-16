"use client";

import { Save, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

import { OpeningStockSummary } from "./components/OpeningStockSummary";
import { OpeningStockTable } from "./components/OpeningStockTable";
import { useOpeningStockIngredients } from "./useOpeningStockIngredients";
import { useOpeningStockSubmit } from "./useOpeningStockSubmit";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;
const OVERWRITE_DIALOG = {
  title: "Xác nhận ghi đè tồn kho",
  description: "NVL này đã có tồn kho. Bạn có chắc muốn ghi đè?",
  cancel: UI_TEXT.COMMON.CANCEL,
  confirm: "Xác nhận ghi đè",
} as const;

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
    handleInputChange,
  } = useOpeningStockIngredients();
  const { handleSaveAsync, saving, isOverwriteConfirmationError } = useOpeningStockSubmit();
  const [isOverwriteDialogOpen, setIsOverwriteDialogOpen] = useState(false);

  const hasOverwriteCandidates = useMemo(
    () =>
      ingredients.some((item) => {
        const entryItem = entryItems[item.ingredientId];

        return item.currentStock > 0 && (entryItem?.quantity ?? 0) > 0;
      }),
    [entryItems, ingredients]
  );

  const submitOpeningStock = async (confirmOverwrite: boolean) => {
    try {
      await handleSaveAsync(entryItems, confirmOverwrite);
      setIsOverwriteDialogOpen(false);
    } catch (submitError) {
      if (isOverwriteConfirmationError(submitError)) {
        setIsOverwriteDialogOpen(true);
      }
    }
  };

  const handlePrimarySave = async () => {
    if (isLocked || saving) {
      return;
    }

    if (hasOverwriteCandidates) {
      setIsOverwriteDialogOpen(true);
      return;
    }

    await submitOpeningStock(false);
  };

  const handleConfirmOverwrite = async () => {
    await submitOpeningStock(true);
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
      <div className="space-y-6 p-4 pb-10 md:p-6 md:pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={OPENING_STOCK.SEARCH_PLACEHOLDER}
              className="pl-9"
              value={search}
              disabled={isLocked}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <OpeningStockSummary totalValue={totalValue} />
            <Button
              onClick={handlePrimarySave}
              disabled={saving || isLocked}
              className="bg-primary hover:bg-primary-hover"
            >
              {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
              {OPENING_STOCK.BTN_SAVE}
            </Button>
          </div>
        </div>

        {isLocked ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">{OPENING_STOCK.LOCKED_TITLE}</p>
            <p>
              {OPENING_STOCK.LOCKED_DESC}
              {lockedAt
                ? ` ${OPENING_STOCK.LOCKED_TIME} ${new Date(lockedAt).toLocaleString()}.`
                : ""}
            </p>
          </div>
        ) : null}

        <Card className="overflow-hidden border-border shadow-soft">
          <CardContent className="p-0">
            <OpeningStockTable
              ingredients={filteredIngredients}
              entryItems={entryItems}
              disabled={isLocked}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>
        <OpeningStockSummary totalValue={totalValue} mobile />
      </div>

      <Dialog open={isOverwriteDialogOpen} onOpenChange={setIsOverwriteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <TriangleAlert className="h-5 w-5" />
              {OVERWRITE_DIALOG.title}
            </DialogTitle>
            <DialogDescription>{OVERWRITE_DIALOG.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsOverwriteDialogOpen(false)}
              disabled={saving}
            >
              {OVERWRITE_DIALOG.cancel}
            </Button>
            <Button
              onClick={handleConfirmOverwrite}
              disabled={saving}
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
