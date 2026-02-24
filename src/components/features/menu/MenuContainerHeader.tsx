"use client";

import { Plus, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MenuContainerHeaderProps {
  onAddNew: () => void;
}

export default function MenuContainerHeader({ onAddNew }: MenuContainerHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <UtensilsCrossed className="text-[#cc0000]" /> Quản lý Thực đơn
        </h1>
        <p className="text-muted-foreground text-sm">
          Hệ thống quản lý món ăn, giá bán và kho hàng tập trung.
        </p>
      </div>
      <Button
        onClick={onAddNew}
        className="bg-[#cc0000] hover:bg-[#aa0000] shadow-md gap-2 px-6 font-bold"
      >
        <Plus size={18} strokeWidth={3} /> THÊM MÓN MỚI
      </Button>
    </div>
  );
}
