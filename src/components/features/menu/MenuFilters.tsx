"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/Menu";

// Định nghĩa lại Interface chuẩn để hết đỏ
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
  onAddNew,
}: MenuFiltersProps) {
  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Tìm tên / mã món..."
            className="h-10 pl-10 border-slate-200 focus-visible:ring-[#cc0000] rounded-xl bg-slate-50/50 border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px] h-10 border-slate-100 bg-slate-50/50 rounded-xl focus:ring-[#cc0000] font-medium text-slate-600">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Tất cả loại</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStation} onValueChange={setFilterStation}>
          <SelectTrigger className="w-[140px] h-10 border-slate-100 bg-slate-50/50 rounded-xl focus:ring-[#cc0000] font-medium text-slate-600">
            <SelectValue placeholder="Tất cả trạm" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Tất cả trạm</SelectItem>
            <SelectItem value="1">Bếp Nóng</SelectItem>
            <SelectItem value="2">Bếp Lạnh</SelectItem>
            <SelectItem value="3">Quầy Bar</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPrice} onValueChange={setFilterPrice}>
          <SelectTrigger className="w-[140px] h-10 border-slate-100 bg-slate-50/50 rounded-xl focus:ring-[#cc0000] font-medium text-slate-600">
            <SelectValue placeholder="Mức giá" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Mọi mức giá</SelectItem>
            <SelectItem value="low">Dưới 30k</SelectItem>
            <SelectItem value="mid">30k - 60k</SelectItem>
            <SelectItem value="high">Trên 60k</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="h-10 w-10 text-slate-400 hover:text-[#cc0000] hover:bg-red-50 rounded-xl transition-colors"
          title="Làm mới"
        >
          <RotateCcw size={18} />
        </Button>
      </div>

      {onAddNew && (
        <div className="flex shrink-0">
          <Button
            onClick={onAddNew}
            className="h-10 bg-[#cc0000] hover:bg-[#aa0000] shadow-lg shadow-red-200 gap-2 px-6 font-semibold rounded-xl uppercase tracking-wider text-xs w-full lg:w-auto transition-all active:scale-95"
          >
            <span className="flex items-center justify-center size-5 bg-white/20 rounded-lg">
              <span className="text-white text-lg">+</span>
            </span>
            THÊM MÓN MỚI
          </Button>
        </div>
      )}
    </div>
  );
}
