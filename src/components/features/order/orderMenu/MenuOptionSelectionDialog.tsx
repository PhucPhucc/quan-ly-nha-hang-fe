"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { optionService } from "@/services/optionService";
import { CartItemOptionGroup, useOrderStore } from "@/store/useOrderStore";
import { MenuItem, OptionGroup, OptionItem } from "@/types/Menu";

interface MenuOptionSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem | null;
}

export function MenuOptionSelectionDialog({
  open,
  onOpenChange,
  menuItem,
}: MenuOptionSelectionDialogProps) {
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  // Selection State: Record<OptionGroupId, OptionItem[]>
  const [selectedOptions, setSelectedOptions] = useState<Record<string, OptionItem[]>>({});

  const addItemToCart = useOrderStore((state) => state.addItem);

  useEffect(() => {
    if (open && menuItem) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await optionService.getOptionGroupsByMenuItem(menuItem.menuItemId);
          if (res.isSuccess && res.data) {
            setOptionGroups(res.data);
            // Reset selection
            setSelectedOptions({});
            // Auto select default for single select required?
            // Logic: process if needed. For now, empty.
          }
        } catch {
          toast.error("Không thể tải tùy chọn món ăn");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      setQuantity(1);
      setNote("");
    } else {
      setOptionGroups([]);
      setSelectedOptions({});
      setNote("");
    }
  }, [open, menuItem]);

  // Calculate Total Price
  const totalPrice = useMemo(() => {
    if (!menuItem) return 0;

    let base = menuItem.priceDineIn; // Default to DineIn for now

    // Add extra price from options
    Object.values(selectedOptions)
      .flat()
      .forEach((item) => {
        base += item.extraPrice;
      });

    return base * quantity;
  }, [menuItem, selectedOptions, quantity]);

  // Handle Option Toggle
  const handleToggleOption = (group: OptionGroup, item: OptionItem, isChecked: boolean) => {
    setSelectedOptions((prev) => {
      const currentSelection = prev[group.optionGroupId] || [];

      if (group.optionType === 1) {
        // Single Select
        // Replace with new selection
        return {
          ...prev,
          [group.optionGroupId]: [item],
        };
      } else {
        // Multi Select
        if (isChecked) {
          // Check Max Limit
          if (currentSelection.length >= group.maxSelect) {
            toast.warning(`Chỉ được chọn tối đa ${group.maxSelect} tùy chọn`);
            return prev;
          }
          return {
            ...prev,
            [group.optionGroupId]: [...currentSelection, item],
          };
        } else {
          return {
            ...prev,
            [group.optionGroupId]: currentSelection.filter(
              (i) => i.optionItemId !== item.optionItemId
            ),
          };
        }
      }
    });
  };

  const handleAddToCart = () => {
    if (!menuItem) return;

    // Validate Required Groups
    for (const group of optionGroups) {
      const selection = selectedOptions[group.optionGroupId] || [];
      if (group.isRequired && selection.length < group.minSelect) {
        // MinSelect usually 1 for required
        toast.error(`Vui lòng chọn "${group.name}"`);
        return;
      }
      if (selection.length < group.minSelect) {
        toast.error(`"${group.name}" cần chọn tối thiểu ${group.minSelect} tùy chọn`);
        return;
      }
    }

    // Transform to Cart Structure
    const finalOptions: CartItemOptionGroup[] = Object.entries(selectedOptions).map(
      ([groupId, items]) => ({
        optionGroupId: groupId,
        selectedValues: items.map((i) => ({
          optionItemId: i.optionItemId,
          quantity: 1, // Default quantity 1 for each option value for now
          label: i.label,
          extraPrice: i.extraPrice,
        })),
      })
    );

    addItemToCart(menuItem, quantity, finalOptions, note);
    toast.success("Đã thêm vào giỏ hàng");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-slate-50 shrink-0">
          <DialogTitle className="text-lg font-bold">{menuItem?.name}</DialogTitle>
          <DialogDescription className="text-xs">{menuItem?.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="space-y-6">
              {optionGroups.map((group) => {
                const currentSelection = selectedOptions[group.optionGroupId] || [];

                return (
                  <div key={group.optionGroupId} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">
                          {group.name}
                          {group.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {group.optionType === 1 ? "Chọn 1" : `Chọn tối đa ${group.maxSelect}`}
                        </p>
                      </div>
                      {group.isRequired && (
                        <Badge
                          variant={currentSelection.length > 0 ? "secondary" : "destructive"}
                          className="text-[10px] px-1.5 h-5"
                        >
                          {currentSelection.length > 0 ? "Đã chọn" : "Bắt buộc"}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {group.optionItems?.map((item) => {
                        const isSelected = currentSelection.some(
                          (i) => i.optionItemId === item.optionItemId
                        );

                        return (
                          <div
                            key={item.optionItemId}
                            className={`
                                                    flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                                                    ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 hover:border-slate-300"}
                                                `}
                            onClick={() => handleToggleOption(group, item, !isSelected)}
                          >
                            <div className="flex items-center gap-3">
                              {group.optionType === 1 ? (
                                <div
                                  className={`
                                                             w-4 h-4 rounded-full border flex items-center justify-center
                                                             ${isSelected ? "border-primary" : "border-slate-300"}
                                                         `}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </div>
                              ) : (
                                <Checkbox checked={isSelected} className="pointer-events-none" />
                              )}
                              <span
                                className={`text-sm ${isSelected ? "font-bold text-primary" : "font-medium text-slate-700"}`}
                              >
                                {item.label}
                              </span>
                            </div>
                            {item.extraPrice > 0 && (
                              <span className="text-xs font-bold text-slate-600">
                                +{item.extraPrice.toLocaleString()}đ
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                );
              })}

              <div className="space-y-2">
                <Label>Ghi chú món ({menuItem?.name})</Label>
                <Input
                  placeholder="Ví dụ: Ít cay, không hành..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-4 border-t bg-white shrink-0 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md bg-white shadow-sm hover:bg-white/80"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold w-4 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md bg-white shadow-sm hover:bg-white/80"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="flex-1 h-10 font-bold shadow-lg shadow-primary/20"
            onClick={handleAddToCart}
            disabled={loading}
          >
            Thêm vào đơn - {totalPrice.toLocaleString()}đ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
