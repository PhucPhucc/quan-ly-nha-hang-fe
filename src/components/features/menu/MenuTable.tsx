import { Beer, Coffee, Edit, MoreVertical, Trash2, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MenuItem } from "@/types/Menu";

interface MenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  role: string;
  onToggleStock: (id: string) => void;
  onManageOptions: (item: MenuItem) => void;
}

export function MenuTable({
  items,
  role,
  onToggleStock,
  onEdit,
  onDelete,
  onManageOptions,
}: MenuTableProps) {
  const isManager = role === "Manager";
  const canSeeCost = role === "Manager" || role === "Cashier";

  const getStationBadge = (station: number) => {
    switch (station) {
      case 1: // HotKitchen
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none flex gap-1 items-center">
            <UtensilsCrossed size={12} /> Bếp Nóng
          </Badge>
        );
      case 2: // ColdKitchen
        return (
          <Badge variant="secondary" className="flex gap-1 items-center">
            <Coffee size={12} /> Bếp Lạnh
          </Badge>
        );
      case 3: // Bar
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none flex gap-1 items-center">
            <Beer size={12} /> Quầy Bar
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex gap-1 items-center">
            <UtensilsCrossed size={12} /> Không xác định
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="w-[350px] font-bold text-slate-700 text-sm">
              Thông tin món ăn
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-sm">Mã SKU</TableHead>
            <TableHead className="font-bold text-slate-700 text-sm">Giá bán</TableHead>
            {canSeeCost && (
              <TableHead className="font-bold text-red-600 text-sm">Giá vốn</TableHead>
            )}
            <TableHead className="font-bold text-slate-700 text-sm">Trạm</TableHead>
            <TableHead className="font-bold text-slate-700 text-sm">Trạng thái</TableHead>
            <TableHead className="text-right font-bold text-slate-700 text-sm pr-6">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow
              key={item.menuItemId}
              className={`hover:bg-slate-50/80 transition-colors ${item.isOutOfStock ? "opacity-60 bg-slate-50/30" : ""}`}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0 relative">
                    <Image
                      src={"https://placehold.co/100x100?text=No+Image"}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 leading-none mb-1">{item.name}</span>
                    <span className="text-xs text-slate-500 line-clamp-1 italic">
                      {item.description || "Không có mô tả"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-bold border border-slate-200">
                  {item.code}
                </code>
              </TableCell>
              <TableCell className="font-bold text-slate-800">
                {item.priceDineIn?.toLocaleString()}đ
              </TableCell>
              {canSeeCost && (
                <TableCell className="text-red-600 font-bold bg-red-50/20">
                  {(item.cost || 0).toLocaleString()}đ
                </TableCell>
              )}
              <TableCell>{getStationBadge(item.station)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!item.isOutOfStock}
                    onCheckedChange={() => onToggleStock(item.menuItemId)}
                    disabled={!isManager}
                    className="data-[state=checked]:bg-green-600 scale-90"
                  />
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${item.isOutOfStock ? "text-slate-400" : "text-green-600"}`}
                  >
                    {item.isOutOfStock ? "Hết" : "Bán"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-slate-100 h-8 w-8 p-0 rounded-full"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 shadow-xl border-slate-200 p-1">
                    <DropdownMenuItem
                      onClick={() => onEdit(item)}
                      className="cursor-pointer py-2 text-slate-700 font-medium focus:bg-slate-50"
                    >
                      <Edit className="mr-2 h-4 w-4 text-[#cc0000]" /> Sửa thông tin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onManageOptions(item)}
                      className="cursor-pointer py-2 text-slate-700 font-medium focus:bg-slate-50"
                    >
                      <MoreVertical className="mr-2 h-4 w-4 text-slate-500" /> Cấu hình tùy chọn
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(item)}
                      className="cursor-pointer py-2 text-red-600 font-medium focus:text-red-700 focus:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Xóa món ăn
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
