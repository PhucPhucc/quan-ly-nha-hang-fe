import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { MenuItem } from "@/types/Menu";

type ComboPreviewItem = {
  menuItemId: string;
  quantity: number;
  menuItemName?: string;
};

const isComboItem = (item: MenuItem) => Boolean(item.setMenuId);

const OrderList = ({
  menuList,
  onItemClick,
}: {
  menuList: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}) => {
  const gridColumns = useOrderGridColumns();

  return (
    <ul className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
      {menuList.map((item, index) => (
        <OrderMenuCard
          key={item.menuItemId}
          item={item}
          onItemClick={onItemClick}
          index={index}
          gridColumns={gridColumns}
          totalItems={menuList.length}
        />
      ))}
    </ul>
  );
};

export default OrderList;

function OrderMenuCard({
  item,
  onItemClick,
  index,
  gridColumns,
  totalItems,
}: {
  item: MenuItem;
  onItemClick: (item: MenuItem) => void;
  index: number;
  gridColumns: number;
  totalItems: number;
}) {
  const combo = isComboItem(item);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const previewItems = (item.items ?? []) as ComboPreviewItem[];
  const rowIndex = Math.floor(index / gridColumns);
  const totalRows = Math.ceil(totalItems / gridColumns);
  const openUpward = rowIndex >= Math.max(totalRows - 1, 0);
  const openDownward = rowIndex === 0;
  const shouldOpenUp = combo && (openUpward || (!openDownward && rowIndex > 0));

  return (
    <li
      onClick={() => onItemClick(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onItemClick(item);
        }
      }}
      role="button"
      tabIndex={0}
      className={`
        group relative flex flex-col justify-between aspect-3/4 bg-white border border-border shadow-sm p-3 rounded-2xl 
        hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50
        ${item.isOutOfStock ? "opacity-60 grayscale pointer-events-none" : ""}
      `}
      onMouseEnter={() => combo && setIsPreviewOpen(true)}
      onMouseLeave={() => setIsPreviewOpen(false)}
    >
      <div className="flex-1 mb-2 rounded-xl overflow-hidden bg-slate-50 relative group/image">
        <Image
          src={!item.imageUrl ? "/placeholderMenu.webp" : item.imageUrl}
          alt={item.name}
          fill
          className="object-cover group-hover/image:scale-110 transition-transform duration-500"
        />
        {item.isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-black uppercase text-xs tracking-widest border border-border px-2 py-1">
              {UI_TEXT.COMMON.OUT_OF_STOCK}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight">
            {item.name}
          </h3>
          {combo ? (
            <Badge
              variant="outline"
              className="shrink-0 border-0 bg-[color-mix(in_oklab,var(--primary)_10%,var(--card)_90%)] text-primary"
            >
              {UI_TEXT.ORDER.COMBO.BADGE_LABEL}
            </Badge>
          ) : null}
        </div>
        <p className="font-black text-primary text-base">{formatCurrency(item.price || 0)}</p>
      </div>

      {combo && isPreviewOpen ? (
        <div
          className={`
            pointer-events-none absolute left-0 z-20
            ${shouldOpenUp ? "bottom-full pb-2" : "top-full pt-2"}
          `}
        >
          <Card className="w-72 overflow-hidden border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_95%,var(--primary)_5%)_0%,var(--card)_100%)] shadow-xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {UI_TEXT.ORDER.COMBO.ITEMS_HEADING}
                  </p>
                  <p className="text-[11px] text-table-text-muted">
                    {UI_TEXT.ORDER.COMBO.ITEMS_HOVER_HINT}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>

              {previewItems.length > 0 ? (
                <div className="space-y-2">
                  {previewItems.map((comboItem, index) => (
                    <div
                      key={`${comboItem.menuItemId}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2 text-sm transition-colors hover:bg-[color-mix(in_oklab,var(--primary)_6%,var(--card)_94%)]"
                    >
                      <p className="min-w-0 truncate font-medium text-table-text-strong">
                        {comboItem.menuItemName ?? comboItem.menuItemId}
                      </p>
                      <Badge
                        variant="outline"
                        className="table-pill table-pill-neutral border-0 shrink-0"
                      >
                        {UI_TEXT.ORDER.COMBO.QUANTITY_SEPARATOR}
                        {comboItem.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 py-4 text-sm text-table-text-muted">
                  {UI_TEXT.ORDER.COMBO.NO_ITEMS_MESSAGE}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </li>
  );
}

function useOrderGridColumns() {
  const getColumns = React.useCallback(() => {
    if (typeof window === "undefined") return 2;
    if (window.matchMedia("(min-width: 1280px)").matches) return 5;
    if (window.matchMedia("(min-width: 1024px)").matches) return 4;
    if (window.matchMedia("(min-width: 768px)").matches) return 3;
    if (window.matchMedia("(min-width: 640px)").matches) return 2;
    return 1;
  }, []);

  const [columns, setColumns] = React.useState<number>(() => getColumns());

  React.useEffect(() => {
    const update = () => setColumns(getColumns());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getColumns]);

  return columns;
}
