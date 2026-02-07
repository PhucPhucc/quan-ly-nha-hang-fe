"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
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
    <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      {/* Search */}
      <InputGroup className="relative flex-1 min-w-50 ">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Tìm tên / mã món..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {/* Loại món */}
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Tất cả loại" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Trạm */}
      <Select value={filterStation} onValueChange={setFilterStation}>
        <SelectTrigger className="w-[140px] border-slate-200 focus:ring-[#cc0000]">
          <SelectValue placeholder="Tất cả trạm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạm</SelectItem>
          <SelectItem value="BAR">Quầy Bar</SelectItem>
          <SelectItem value="KITCHEN_HOT">Bếp Nóng</SelectItem>
          <SelectItem value="KITCHEN_COLD">Bếp Lạnh</SelectItem>
        </SelectContent>
      </Select>

      {/* Giá */}
      <Select value={filterPrice} onValueChange={setFilterPrice}>
        <SelectTrigger className="w-[140px] border-slate-200 focus:ring-[#cc0000]">
          <SelectValue placeholder="Mức giá" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Mọi mức giá</SelectItem>
          <SelectItem value="low">Dưới 30k</SelectItem>
          <SelectItem value="mid">30k - 60k</SelectItem>
          <SelectItem value="high">Trên 60k</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      <Button
        variant="ghost"
        onClick={onReset}
        className="text-slate-500 hover:text-[#cc0000] hover:bg-red-50 gap-2"
      >
        <RotateCcw size={16} />
        <span className="hidden lg:inline">Làm mới</span>
      </Button>
    </div>
  );
}
