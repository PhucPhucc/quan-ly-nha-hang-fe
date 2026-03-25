"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { menuService } from "@/services/menuService";
import { MenuItem } from "@/types/Menu";

interface ItemSearchSelectProps {
  value?: string;
  initialName?: string;
  onChange: (value: string) => void;
  className?: string;
}

const V = UI_TEXT.VOUCHER;

export const ItemSearchSelect: React.FC<ItemSearchSelectProps> = ({
  value,
  initialName,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await menuService.getAll(1, 100);
        if (response.isSuccess && response.data) {
          setItems(response.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = items.find((item) => item.menuItemId === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal h-10 px-3", className)}
        >
          {selectedItem ? (
            <span className="truncate">{selectedItem.name}</span>
          ) : value && initialName ? (
            <span className="truncate">{initialName}</span>
          ) : (
            <span className="text-muted-foreground">{V.FREE_ITEM_SELECT_LABEL}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 shadow-lg rounded-xl border-border/60"
        align="start"
        sideOffset={8}
      >
        <div className="flex items-center border-b px-3 bg-muted/20">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={V.FREE_ITEM_SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full border-0 bg-transparent py-3 text-sm outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <ScrollArea className="h-[200px]">
          <div className="p-1">
            {filteredItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {loading ? "Đang tải..." : UI_TEXT.COMMON.NO_RESULTS}
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.menuItemId}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors",
                    value === item.menuItemId && "bg-accent/50 text-accent-foreground"
                  )}
                  onClick={() => {
                    onChange(item.menuItemId);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.menuItemId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="truncate font-medium">{item.name}</span>
                    <span className="truncate text-[10px] text-muted-foreground">
                      {item.code} {"•"} {item.price.toLocaleString("vi-VN")}
                      {"đ"}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
