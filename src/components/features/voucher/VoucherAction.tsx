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
          className="h-8 w-8 rounded-lg hover:bg-muted-foreground/10 text-muted-foreground1 transition-colors"
        >
          <List className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52 rounded-xl shadow-xl text-card-foreground"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuItem onClick={() => onView(voucher)}>
          <Eye className="size-4" />
          <div className="flex flex-col">
            <span>{V.ACTION_VIEW}</span>
            <span className="text-xs text-muted-foreground">{V.ACTION_VIEW_DESC}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEdit(voucher)}>
          <Pencil className="size-4 " />
          <div className="flex flex-col">
            <span>{V.ACTION_EDIT}</span>
            <span className="text-xs text-muted-foreground">{V.ACTION_EDIT_DESC}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onToggleStatus(voucher)}>
          <Power className="size-4 " />
          <div className="flex flex-col">
            <span className="text-sm">
              {voucher.isActive ? V.ACTION_DEACTIVATE : V.ACTION_ACTIVATE}
            </span>
            <span className="text-xs text-muted-foreground ">{V.ACTION_TOGGLE_DESC}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 mx-2" />

        <DropdownMenuItem onClick={() => onDelete(voucher)}>
          <Trash2 className="size-4" />
          <div className="flex flex-col">
            <span className="text-sm">{V.ACTION_DELETE}</span>
            <span className="text-xs">{V.ACTION_DELETE_DESC}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
