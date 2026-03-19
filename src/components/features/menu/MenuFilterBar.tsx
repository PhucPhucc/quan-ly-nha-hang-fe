import { Plus, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { useMenuStore } from "@/store/useMenuStore";
import { Category } from "@/types/Menu";

interface MenuFilterBarProps {
  categories: Category[];
}

export const MenuFilterBar: React.FC<MenuFilterBarProps> = ({ categories }) => {
  const { searchQuery, setSearchQuery, categoryId, setCategoryId, setEditingItem, setModalOpen } =
    useMenuStore();

  const handleAddNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCategoryId("all");
  };

  return (
    <div className=" w-full rounded-xl border border-border bg-card shadow-sm shadow-slate-100/60 px-4 py-3 grid gap-2 lg:grid-cols-[1fr_auto_auto] justify-between lg:items-center">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          <Input
            type="text"
            placeholder={UI_TEXT.MENU.PLACEHOLDER_SEARCH}
            className="pl-10 bg-card text-foreground placeholder:text-slate-400 border border-border focus-visible:ring-2 focus-visible:ring-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Select value={categoryId || "all"} onValueChange={setCategoryId}>
        <SelectTrigger className="w-full sm:w-50rounded-2xl bg-card border border-border text-foreground">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <SelectValue placeholder={UI_TEXT.MENU.FILTER_ALL_CATEGORY} />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">{UI_TEXT.MENU.FILTER_ALL_CATEGORY}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.categoryId} value={category.categoryId}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="p-2 rounded-full text-foreground hover:bg-card-foreground/5 transition-colors duration-300"
          onClick={handleReset}
          title={UI_TEXT.COMMON.RESET}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleAddNew}
          className="shadow-lg hover:shadow-primary/20 transition-all font-semibold"
        >
          <Plus className="h-5 w-5" /> {UI_TEXT.MENU.ADD_NEW_ITEM}
        </Button>
      </div>
    </div>
  );
};
