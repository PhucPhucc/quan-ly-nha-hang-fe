"use client";

import {
  Beer,
  Coffee,
  Edit,
  MoreVertical,
  Store,
  Tag,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

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
import type { MenuItem, SetMenu } from "@/types/Menu";

function withCloudinaryThumb(
  original: string,
  opts?: { w?: number; h?: number; crop?: "fill" | "fit" | "pad" | "thumb"; q?: string }
) {
  // Không phải URL Cloudinary thì trả nguyên
  if (!/https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(original)) return original;

  // Nếu URL đã có transform sau /image/upload/ thì giữ nguyên
  const hasTransform = /\/image\/upload\/[^/]*(f_|w_|h_|c_)/.test(original);
  if (hasTransform) return original;

  const { w = 96, h = 96, crop = "fill", q = "auto" } = opts || {};
  // Chèn transform ngay sau "/image/upload/" (đứng trước v123...)
  return original.replace("/image/upload/", `/image/upload/f_auto,q_${q},w_${w},h_${h},c_${crop}/`);
}
export type TableItem =
  | (MenuItem & { id: string; type: "item" })
  | (SetMenu & { id: string; type: "combo" });

interface MenuTableProps {
  items: TableItem[];
  role: string;
  onToggleStock: (id: string) => void;
  onEdit: (item: TableItem) => void;
  onDelete: (item: TableItem) => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}

function getStationBadge(station?: number) {
  switch (station) {
    case 1:
      return (
        <Badge className="bg-danger/10 text-danger border-none flex gap-1 items-center">
          <UtensilsCrossed size={13} /> Bếp Nóng
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-info/10 text-info border-none flex gap-1 items-center">
          <Coffee size={13} /> Bếp Lạnh
        </Badge>
      );
    case 3:
      return (
        <Badge className="bg-warning/10 text-warning border-none flex gap-1 items-center">
          <Beer size={13} /> Quầy Bar
        </Badge>
      );
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
}

/** Lấy id thống nhất */
function getRowId(it: TableItem): string {
  return it.id;
}

export function MenuTable({ items, role, onToggleStock, onEdit, onDelete }: MenuTableProps) {
  const isManager = role === "Manager";
  const canSeeCost = role === "Manager" || role === "Cashier";

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 border-border">
            <TableHead className="w-[280px] py-4 uppercase text-[11px] font-semibold">
              Món ăn
            </TableHead>
            <TableHead className="uppercase text-[11px]">Danh mục</TableHead>
            <TableHead className="uppercase text-[11px]">Mã SKU</TableHead>
            <TableHead className="uppercase text-[11px]">Giá</TableHead>
            {canSeeCost && (
              <TableHead className="uppercase text-[11px] text-danger">Giá vốn</TableHead>
            )}
            <TableHead className="uppercase text-[11px]">Thời gian</TableHead>
            <TableHead className="uppercase text-[11px]">Khu vực</TableHead>
            <TableHead className="uppercase text-[11px]">Tồn kho</TableHead>
            <TableHead className="uppercase text-[11px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length > 0 ? (
            items.map((item) => {
              const rowId = getRowId(item);
              const isItem = item.type === "item";
              console.debug("[MenuTable] img:", item.name, item.imageUrl);
              const placeholder = "https://placehold.co/100x100?text=No+Image";
              const imgSrc = item.imageUrl
                ? withCloudinaryThumb(item.imageUrl, { w: 96, h: 96, crop: "fill" })
                : placeholder;
              const desc = item.description || "Không có mô tả";
              const category = isItem ? item.categoryName || "—" : "Combo";

              return (
                <TableRow
                  key={rowId}
                  className={item.isOutOfStock ? "opacity-60 bg-secondary/10" : ""}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden border bg-secondary">
                        <img
                          src={imgSrc}
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://placehold.co/100x100?text=No+Image";
                          }}
                          className={`h-full w-full object-cover ${item.isOutOfStock ? "grayscale" : ""}`}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm truncate">{item.name}</span>
                        <span className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                          {desc}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Tag size={12} className={!isItem ? "text-primary" : ""} />
                      <span
                        className={`text-[12px] font-medium ${!isItem ? "text-primary font-bold" : ""}`}
                      >
                        {category}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-[11px] font-semibold bg-secondary px-2 py-0.5 rounded border">
                      {item.code}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Store size={12} />
                      <span className="font-bold text-sm">{formatCurrency(item.price)}</span>
                    </div>
                  </TableCell>

                  {canSeeCost && (
                    <TableCell className="text-danger font-bold text-sm">
                      {item.type === "combo"
                        ? formatCurrency(item.costPrice)
                        : formatCurrency(item.costPrice)}
                    </TableCell>
                  )}

                  <TableCell>
                    <span className="text-xs font-semibold bg-secondary px-2 py-1 rounded">
                      {isItem && item.expectedTime > 0 ? `${item.expectedTime} phút` : "--"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {isItem ? getStationBadge(item.station) : getStationBadge(undefined)}
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={!item.isOutOfStock}
                      onCheckedChange={() => onToggleStock(rowId)}
                      disabled={!isManager}
                      className="data-[state=checked]:bg-success scale-90"
                    />
                  </TableCell>

                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" /> Sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(item)} className="text-danger">
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-16 text-muted-foreground">
                Không tìm thấy món ăn nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
