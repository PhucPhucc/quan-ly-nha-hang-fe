"use client";

import { Eye, List, Pencil, Power, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UI_TEXT } from "@/lib/UI_Text";
import { Voucher } from "@/types/voucher";

const V = UI_TEXT.VOUCHER;

interface VoucherActionProps {
  voucher: Voucher;
  onView: (voucher: Voucher) => void;
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
  onToggleStatus: (voucher: Voucher) => void;
}

export default function VoucherAction({
  voucher,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: VoucherActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <List className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-2xl p-1.5 shadow-2xl border-slate-100"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuItem
          onClick={() => onView(voucher)}
          className="rounded-xl p-2.5 gap-3 cursor-pointer focus:bg-slate-50"
        >
          <div className="bg-blue-50 p-2 rounded-lg">
            <Eye className="size-4 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span>{V.ACTION_VIEW}</span>
            <span className="text-xs text-muted-foreground">{V.ACTION_VIEW_DESC}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onEdit(voucher)}
          className="rounded-xl p-2.5 gap-3 cursor-pointer focus:bg-slate-50"
        >
          <div className="bg-amber-50 p-2 rounded-lg">
            <Pencil className="size-4 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <span>{V.ACTION_EDIT}</span>
            <span className="text-xs text-muted-foreground">{V.ACTION_EDIT_DESC}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onToggleStatus(voucher)}
          className="rounded-xl p-2.5 gap-3 cursor-pointer focus:bg-slate-50"
        >
          <div className="bg-emerald-50 p-2 rounded-lg">
            <Power className="size-4 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {voucher.isActive ? V.ACTION_DEACTIVATE : V.ACTION_ACTIVATE}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
              {V.ACTION_TOGGLE_DESC}
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 mx-2" />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(voucher)}
          className="rounded-xl p-2.5 gap-3 cursor-pointer focus:bg-rose-50"
        >
          <div className="bg-rose-50 p-2 rounded-lg">
            <Trash2 className="size-4 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{V.ACTION_DELETE}</span>
            <span className="text-[10px] text-rose-400 uppercase tracking-tight">
              {V.ACTION_DELETE_DESC}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
