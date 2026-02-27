"use client";

import {
  Beer,
  Coffee,
  Edit,
  MoreVertical,
  Trash2,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  Clock,
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
import { MenuItem } from "@/types/Menu";
import { UI_TEXT } from "@/lib/UI_Text";

interface MenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  role: string;
  onToggleStock: (id: string) => void;
}

export function MenuTable({ items, role, onToggleStock, onEdit, onDelete }: MenuTableProps) {
  const isManager = role === "Manager";
  const canSeeCost = role === "Manager" || role === "Cashier";

  const getStationBadge = (station: any) => {
    const rawStation = station;
    let stationValue = "Unknown";

    if (rawStation === 3 || String(rawStation).toLowerCase() === "bar") stationValue = "Bar";
    else if (
      rawStation === 1 ||
      String(rawStation).toLowerCase().includes("hot") ||
      rawStation === "kitchenhot"
    )
      stationValue = "KitchenHot";
    else if (
      rawStation === 2 ||
      String(rawStation).toLowerCase().includes("cold") ||
      rawStation === "kitchencold"
    )
      stationValue = "KitchenCold";

    switch (stationValue) {
      case "Bar":
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20 border-none px-2 py-1 font-medium flex gap-1.5 items-center w-fit">
            <Beer size={13} /> Quầy Bar
          </Badge>
        );
      case "KitchenHot":
        return (
          <Badge className="bg-danger/10 text-danger hover:bg-danger/20 border-none px-2 py-1 font-medium flex gap-1.5 items-center w-fit">
            <UtensilsCrossed size={13} /> Bếp Nóng
          </Badge>
        );
      case "KitchenCold":
        return (
          <Badge className="bg-info/10 text-info hover:bg-info/20 border-none px-2 py-1 font-medium flex gap-1.5 items-center w-fit">
            <Coffee size={13} /> Bếp Lạnh
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground font-normal">
            {rawStation ?? UI_TEXT.COMMON.EMPTY}
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[320px] py-4 font-semibold text-foreground uppercase tracking-wider text-[11px]">
              {UI_TEXT.EMPLOYEE.INFO}
            </TableHead>
            <TableHead className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              {UI_TEXT.FORM.SKU_CODE}
            </TableHead>
            <TableHead className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              {UI_TEXT.FORM.PRICE_CONFIG}
            </TableHead>
            {canSeeCost && (
              <TableHead className="font-semibold text-danger uppercase tracking-wider text-[11px]">
                {UI_TEXT.FORM.COST_PRICE}
              </TableHead>
            )}
            <TableHead className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              {UI_TEXT.FORM.STATION}
            </TableHead>
            <TableHead className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              {UI_TEXT.FORM.PREP_TIME}
            </TableHead>
            <TableHead className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              {UI_TEXT.EMPLOYEE.STATUS}
            </TableHead>
            <TableHead className="text-right font-semibold text-foreground uppercase tracking-wider text-[11px] pr-6">
              {UI_TEXT.COMMON.ACTION}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.length > 0 ? (
            items.map((item) => {
              // --- PHẦN XỬ LÝ DỮ LIỆU ---
              const itemId =
                (item as any).menuItemId || (item as any).MenuItemId || (item as any).id;
              const isOutOfStock =
                (item as any).isOutOfStock ?? (item as any).IsOutOfStock ?? false;

              const priceDineIn = (item as any).priceDineIn ?? (item as any).PriceDineIn ?? 0;
              const priceTakeAway = (item as any).priceTakeAway ?? (item as any).PriceTakeAway ?? 0;
              const costPrice = (item as any).costPrice ?? (item as any).CostPrice ?? 0;

              // LOGIC FIX ẢNH Ở ĐÂY
              const rawImg = (item as any).imageUrl || (item as any).ImageUrl || "";
              let finalImg = "https://placehold.co/100x100?text=No+Food";

              if (rawImg) {
                // Nếu là link Cloudinary (có http) thì dùng luôn, nếu không thì coi là file nội bộ
                finalImg = rawImg.startsWith("http") ? rawImg : `/${rawImg}`;
              }

              return (
                <TableRow
                  key={itemId}
                  className={`group transition-colors hover:bg-muted/30 ${isOutOfStock ? "bg-muted/10 opacity-70" : ""}`}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-lg overflow-hidden border border-border bg-muted/50 flex-shrink-0 shadow-sm">
                        <img
                          src={finalImg}
                          alt={item.name}
                          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? "grayscale" : ""}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/100x100?text=Error";
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-foreground text-[15px] tracking-tight leading-tight">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                          {item.description || UI_TEXT.COMMON.EMPTY}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-[12px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50">
                      {(item as any).code || "---"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Store size={10} className="text-info" />
                        <span className="text-[11px] font-medium text-muted-foreground uppercase">
                          Trực tiếp:
                        </span>
                        <span className="font-bold text-foreground text-sm">
                          {formatCurrency(priceDineIn)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={10} className="text-warning" />
                        <span className="text-[11px] font-medium text-muted-foreground uppercase">
                          Mang về:
                        </span>
                        <span className="text-[12px] font-semibold text-muted-foreground">
                          {formatCurrency(priceTakeAway)}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {canSeeCost && (
                    <TableCell>
                      <span className="text-danger font-bold text-sm bg-danger/5 px-2 py-1 rounded-md border border-danger/10">
                        {formatCurrency(costPrice)}
                      </span>
                    </TableCell>
                  )}

                  <TableCell>{getStationBadge((item as any).station)}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Clock size={14} className="text-muted-foreground/60" />
                      <span className="text-sm">{(item as any).expectedTime || 0}</span>
                      <span className="text-[11px] text-muted-foreground font-normal">phút</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={!isOutOfStock}
                        onCheckedChange={() => onToggleStock(itemId)}
                        disabled={!isManager}
                        className="data-[state=checked]:bg-success"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer">
                          <Edit className="mr-2.5 h-4 w-4" />
                          <span>Sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(item)}
                          className="cursor-pointer text-danger focus:text-danger"
                        >
                          <Trash2 className="mr-2.5 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-20 text-muted-foreground">
                Trống
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
