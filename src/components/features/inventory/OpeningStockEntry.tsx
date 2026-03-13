"use client";

import { Save, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";

import { OpeningStockSummary } from "./components/OpeningStockSummary";
import { OpeningStockTable } from "./components/OpeningStockTable";
import { useOpeningStockIngredients } from "./useOpeningStockIngredients";
import { useOpeningStockSubmit } from "./useOpeningStockSubmit";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

export function OpeningStockEntry() {
  const {
    search,
    setSearch,
    filteredIngredients,
    entryItems,
    totalValue,
    loading,
    isError,
    error,
    handleInputChange,
  } = useOpeningStockIngredients();
  const { handleSave, saving } = useOpeningStockSubmit();

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
    <div className="space-y-6 p-4 pb-10 md:p-6 md:pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={OPENING_STOCK.SEARCH_PLACEHOLDER}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <OpeningStockSummary totalValue={totalValue} />
          <Button
            onClick={() => handleSave(entryItems)}
            disabled={saving}
            className="bg-primary hover:bg-primary-hover"
          >
            {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {OPENING_STOCK.BTN_SAVE}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-border py-0 shadow-soft">
        <CardContent className="p-0">
          <OpeningStockTable
            ingredients={filteredIngredients}
            entryItems={entryItems}
            onInputChange={handleInputChange}
          />
        </CardContent>
      </Card>
      <OpeningStockSummary totalValue={totalValue} mobile />
    </div>
  );
}
