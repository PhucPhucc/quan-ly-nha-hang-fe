"use client";

import { Edit, MoreVertical, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OptionGroup, OptionItem } from "@/types/Menu";

interface OptionItemListProps {
  selectedGroup: OptionGroup | null;
  onOpenItemForm: (item?: OptionItem) => void;
  onDeleteItem: (item: OptionItem) => void;
}

export function OptionItemList({
  selectedGroup,
  onOpenItemForm,
  onDeleteItem,
}: OptionItemListProps) {
  if (!selectedGroup) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-white">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <MoreVertical className="h-8 w-8 text-slate-300" />
        </div>
        <p>Chọn một nhóm tùy chọn để xem chi tiết</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="p-4 border-b bg-white flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-bold text-lg text-slate-800">{selectedGroup.name}</h3>
          <p className="text-xs text-slate-500">
            {selectedGroup.isRequired ? "Bắt buộc chọn" : "Không bắt buộc"} • Chọn từ{" "}
            {selectedGroup.minSelect} đến {selectedGroup.maxSelect}
          </p>
        </div>
        <Button size="sm" onClick={() => onOpenItemForm()}>
          <Plus className="h-4 w-4 mr-1" /> Thêm lựa chọn
        </Button>
      </div>

      <div className="flex-1 p-0 overflow-hidden bg-slate-50/30">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b bg-slate-50 font-bold text-xs text-slate-500 uppercase">
          <div className="col-span-6">Tên hiển thị</div>
          <div className="col-span-4 text-right">Phụ thu</div>
          <div className="col-span-2 text-right"></div>
        </div>

        <ScrollArea className="h-full">
          <div className="px-6 py-2">
            {(!selectedGroup.optionItems || selectedGroup.optionItems.length === 0) && (
              <div className="text-center py-12 text-slate-400 italic">
                Chưa có lựa chọn nào trong nhóm này
              </div>
            )}

            {selectedGroup.optionItems?.map((item) => (
              <div
                key={item.optionItemId}
                className="grid grid-cols-12 gap-4 py-3 border-b last:border-0 items-center hover:bg-slate-50 transition-colors rounded-lg px-2 -mx-2"
              >
                <div className="col-span-6 font-medium text-slate-700">{item.label}</div>
                <div className="col-span-4 text-right font-bold text-slate-600">
                  {item.extraPrice > 0 ? `+${item.extraPrice.toLocaleString()}đ` : "0đ"}
                </div>
                <div className="col-span-2 flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => onOpenItemForm(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteItem(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
