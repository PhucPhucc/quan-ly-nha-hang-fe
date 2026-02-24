"use client";

import { Edit, MoreVertical, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OptionGroup } from "@/types/Menu";

interface OptionGroupListProps {
  optionGroups: OptionGroup[];
  selectedGroup: OptionGroup | null;
  loading: boolean;
  onSelectGroup: (group: OptionGroup) => void;
  onOpenGroupForm: (group?: OptionGroup) => void;
  onDeleteGroup: (group: OptionGroup) => void;
}

export function OptionGroupList({
  optionGroups,
  selectedGroup,
  loading,
  onSelectGroup,
  onOpenGroupForm,
  onDeleteGroup,
}: OptionGroupListProps) {
  return (
    <div className="w-1/3 border-r bg-slate-50 flex flex-col min-h-0">
      <div className="p-4 border-b bg-white flex items-center justify-between shrink-0">
        <h3 className="font-bold text-sm text-slate-700">Nhóm tùy chọn</h3>
        <Button size="sm" variant="outline" onClick={() => onOpenGroupForm()}>
          <Plus className="h-4 w-4 mr-1" /> Thêm
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {optionGroups.length === 0 && !loading && (
            <div className="text-center py-8 text-slate-400 text-sm italic">Chưa có nhóm nào</div>
          )}
          {optionGroups.map((group) => (
            <div
              key={group.optionGroupId}
              onClick={() => onSelectGroup(group)}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md
                ${
                  selectedGroup?.optionGroupId === group.optionGroupId
                    ? "bg-white border-primary shadow-sm ring-1 ring-primary/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }
              `}
            >
              <div className="flex justify-between items-start mb-1 h-5">
                <span className="font-bold text-sm truncate pr-2">{group.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mr-1 -mt-1 text-slate-400 hover:text-slate-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onOpenGroupForm(group)}>
                      <Edit className="h-4 w-4 mr-2" /> Sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => onDeleteGroup(group)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {group.isRequired ? (
                  <Badge variant="destructive" className="text-[10px] px-1 h-5">
                    Bắt buộc
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] px-1 h-5">
                    Tùy chọn
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px] px-1 h-5 text-slate-500">
                  {group.minSelect} - {group.maxSelect}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
