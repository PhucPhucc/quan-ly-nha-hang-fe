"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer } from "react";
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
import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { CartItemOptionGroup } from "@/types/Cart";
import { MenuItem, OptionGroup, OptionItem } from "@/types/Menu";

interface MenuOptionSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem | null;
}

type State = {
  optionGroups: OptionGroup[];
  loading: boolean;
  quantity: number;
  note: string;
  selectedOptions: Record<string, OptionItem[]>;
};

type Action =
  | { type: "SET_GROUPS"; payload: OptionGroup[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_QUANTITY"; payload: number | ((prev: number) => number) }
  | { type: "SET_NOTE"; payload: string }
  | { type: "SET_OPTIONS"; payload: Record<string, OptionItem[]> }
  | { type: "RESET" };

const initialState: State = {
  optionGroups: [],
  loading: false,
  quantity: 1,
  note: "",
  selectedOptions: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_GROUPS":
      return { ...state, optionGroups: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_QUANTITY":
      const newQuantity =
        typeof action.payload === "function" ? action.payload(state.quantity) : action.payload;
      return { ...state, quantity: newQuantity };
    case "SET_NOTE":
      return { ...state, note: action.payload };
    case "SET_OPTIONS":
      return { ...state, selectedOptions: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function MenuOptionSelectionDialog({
  open,
  onOpenChange,
  menuItem,
}: MenuOptionSelectionDialogProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { optionGroups, loading, quantity, note, selectedOptions } = state;

  const addItem = useCartStore((state) => state.addItem);

  // -- Helpers --
  const resetLocalState = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // -- Data Fetching --
  useEffect(() => {
    if (open && menuItem) {
      const fetchData = async () => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const res = await optionService.getOptionGroupsByMenuItem(menuItem.menuItemId);
          if (res.isSuccess && res.data) dispatch({ type: "SET_GROUPS", payload: res.data });
        } catch {
          toast.error("Không thể tải tùy chọn món ăn");
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      };
      fetchData();
    } else {
      resetLocalState();
    }
  }, [open, menuItem, resetLocalState]);

  // -- Calculations --
  const extraPrice = useMemo(
    () =>
      Object.values(selectedOptions)
        .flat()
        .reduce((acc, item) => acc + item.extraPrice, 0),
    [selectedOptions]
  );

  const totalPrice = menuItem ? (menuItem.priceDineIn + extraPrice) * quantity : 0;

  // -- Handlers --
  const handleToggleOption = (group: OptionGroup, item: OptionItem, isChecked: boolean) => {
    const currentSelection = selectedOptions[group.optionGroupId] || [];

    if (group.optionType === 1) {
      // Single Select
      dispatch({
        type: "SET_OPTIONS",
        payload: { ...selectedOptions, [group.optionGroupId]: [item] },
      });
      return;
    }

    // Multi Select
    if (isChecked) {
      if (currentSelection.length >= group.maxSelect) {
        toast.warning(`Chỉ được chọn tối đa ${group.maxSelect} tùy chọn`);
        return;
      }
      dispatch({
        type: "SET_OPTIONS",
        payload: { ...selectedOptions, [group.optionGroupId]: [...currentSelection, item] },
      });
      return;
    }

    dispatch({
      type: "SET_OPTIONS",
      payload: {
        ...selectedOptions,
        [group.optionGroupId]: currentSelection.filter((i) => i.optionItemId !== item.optionItemId),
      },
    });
  };

  const validateSelection = () => {
    for (const group of optionGroups) {
      const selection = selectedOptions[group.optionGroupId] || [];
      if (group.isRequired && selection.length < group.minSelect) {
        toast.error(`Vui lòng chọn "${group.name}"`);
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;

    const { selectedOrderId } = useOrderBoardStore.getState();

    if (!selectedOrderId) {
      toast.error("Vui lòng chọn bàn trước khi thêm món");
      return;
    }

    if (!menuItem) {
      toast.error("Không thể thêm món - dữ liệu không hợp lệ");
      return;
    }

    const optionGroups: CartItemOptionGroup[] = Object.entries(selectedOptions).map(
      ([groupId, items]) => ({
        optionGroupId: groupId,
        selectedValues: items.map((item) => ({
          optionItemId: item.optionItemId,
          quantity: 1,
          label: item.label,
          extraPrice: item.extraPrice,
        })),
      })
    );

    addItem(selectedOrderId, menuItem, quantity, optionGroups, note, menuItem.priceDineIn);
    toast.success("Đã thêm vào đơn hàng");
    resetLocalState();
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
                          {group.name} {group.isRequired && <span className="text-red-500">*</span>}
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
                            onClick={() => handleToggleOption(group, item, !isSelected)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleToggleOption(group, item, !isSelected);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            className={`
                              flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary/50
                              ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 hover:border-slate-300"}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              {group.optionType === 1 ? (
                                <div
                                  className={`size-4 rounded-full border flex items-center justify-center ${isSelected ? "border-primary" : "border-slate-300"}`}
                                >
                                  {isSelected && <div className="size-2 rounded-full bg-primary" />}
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
                  onChange={(e) => dispatch({ type: "SET_NOTE", payload: e.target.value })}
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
              onClick={() =>
                dispatch({ type: "SET_QUANTITY", payload: (prev) => Math.max(1, prev - 1) })
              }
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold w-4 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md bg-white shadow-sm hover:bg-white/80"
              onClick={() => dispatch({ type: "SET_QUANTITY", payload: (prev) => prev + 1 })}
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
