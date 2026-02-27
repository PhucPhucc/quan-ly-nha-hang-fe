"use client";

import { Filter, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { Category } from "@/types/Menu";

interface MenuFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterStation: string;
  setFilterStation: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  filterPrice: string;
  setFilterPrice: (val: string) => void;
  categories: Category[];
  onReset: () => void;
  onAddNew?: () => void;
}

export default function MenuFilters({
  searchQuery,
  setSearchQuery,
  filterStation,
  setFilterStation,
  filterCategory,
  setFilterCategory,
  filterPrice,
  setFilterPrice,
  categories,
  onReset,
}: MenuFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-card p-5 rounded-2xl shadow-sm border border-border transition-all">
      {/* Search - Ưu tiên khoảng không gian rộng hơn */}
      <div className="relative flex-2 min-w-70">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <InputGroup className="w-full">
          <InputGroupInput
            placeholder={UI_TEXT.COMMON.SEARCH + "..."} // Dùng UI_TEXT
            className="pl-11 h-11 bg-muted/30 border-border focus:bg-background transition-all rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Loại món */}
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-44 h-11 border-border bg-background rounded-xl focus:ring-primary/20">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground" />
              <SelectValue placeholder={UI_TEXT.FORM.CATEGORY} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg border-border">
            <SelectItem value="all">
              {UI_TEXT.COMMON.ALL} {UI_TEXT.FORM.CATEGORY.toLowerCase()}
            </SelectItem>
            {categories?.map((cat) => {
              const catId = cat.categoryId || (cat as Category).categoryId;
              return (
                <SelectItem key={catId} value={catId} className="cursor-pointer">
                  {cat.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Trạm */}
        <Select value={filterStation} onValueChange={setFilterStation}>
          <SelectTrigger className="w-40 h-11 border-border bg-background rounded-xl focus:ring-primary/20">
            <SelectValue placeholder={UI_TEXT.FORM.STATION} />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg border-border">
            <SelectItem value="all">
              {UI_TEXT.COMMON.ALL} {UI_TEXT.FORM.STATION.toLowerCase()}
            </SelectItem>
            <SelectItem value="BAR">Quầy Bar</SelectItem>
            <SelectItem value="KITCHEN_HOT">Bếp Nóng</SelectItem>
            <SelectItem value="KITCHEN_COLD">Bếp Lạnh</SelectItem>
          </SelectContent>
        </Select>

        {/* Giá */}
        <Select value={filterPrice} onValueChange={setFilterPrice}>
          <SelectTrigger className="w-40 h-11 border-border bg-background rounded-xl focus:ring-primary/20">
            <SelectValue placeholder={UI_TEXT.FORM.PRICE_CONFIG} />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg border-border">
            <SelectItem value="all">{UI_TEXT.COMMON.ALL} mức giá</SelectItem>
            <SelectItem value="low">Dưới 30.000đ</SelectItem>
            <SelectItem value="mid">30.000đ - 60.000đ</SelectItem>
            <SelectItem value="high">Trên 60.000đ</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={onReset}
          className="h-11 px-4 border-dashed border-muted-foreground/30 text-muted-foreground hover:text-danger hover:bg-danger/5 hover:border-danger/30 transition-all rounded-xl gap-2 ml-auto"
        >
          <RotateCcw size={16} />
          <span className="font-semibold text-sm">{UI_TEXT.COMMON.RESET}</span>
        </Button>
      </div>
    </div>
  );
}
