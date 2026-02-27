import { useCallback, useEffect, useMemo, useReducer } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ERROR_MESSAGES,
  initialMenuOptionState,
  menuOptionReducer,
} from "@/hooks/useMenuOptionReducer";
import { optionService } from "@/services/optionService";
import { orderService } from "@/services/orderService";
import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { CartItemOptionGroup } from "@/types/Cart";
import { MenuItem, OptionGroup, OptionItem } from "@/types/Menu";

import { SelectionDialogFooter } from "./components/dialog/SelectionDialogFooter";
import { SelectionDialogHeader } from "./components/dialog/SelectionDialogHeader";
import { SelectionOptionsContent } from "./components/dialog/SelectionOptionsContent";

const OPTION_TYPE_SINGLE_SELECT = 1;

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
  const [state, dispatch] = useReducer(menuOptionReducer, initialMenuOptionState);
  const { optionGroups, loading, quantity, note, selectedOptions } = state;
  const addItem = useCartStore((state) => state.addItem);

  const resetLocalState = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  useEffect(() => {
    if (open && menuItem) {
      const fetchData = async () => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const res = await optionService.getOptionGroupsByMenuItem(menuItem.menuItemId);
          if (res.isSuccess && res.data) {
            dispatch({ type: "SET_GROUPS", payload: res.data });
          }
        } catch {
          toast.error(ERROR_MESSAGES.loadOptions);
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      };
      fetchData();
    } else {
      resetLocalState();
    }
  }, [open, menuItem, resetLocalState]);

  const extraPrice = useMemo(
    () =>
      Object.values(selectedOptions)
        .flat()
        .reduce((acc, item) => acc + item.extraPrice, 0),
    [selectedOptions]
  );

  const totalPrice = menuItem ? (menuItem.priceDineIn + extraPrice) * quantity : 0;

  const handleToggleOption = (group: OptionGroup, item: OptionItem, isChecked: boolean) => {
    const currentSelection = selectedOptions[group.optionGroupId] || [];

    if (group.optionType === OPTION_TYPE_SINGLE_SELECT) {
      dispatch({
        type: "SET_OPTIONS",
        payload: { ...selectedOptions, [group.optionGroupId]: [item] },
      });
      return;
    }

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

  const validateSelection = (): boolean => {
    for (const group of optionGroups) {
      const selection = selectedOptions[group.optionGroupId] || [];
      if (group.isRequired && selection.length < group.minSelect) {
        toast.error(`Vui lòng chọn "${group.name}"`);
        return false;
      }
    }
    return true;
  };

  const buildCartOptionGroups = (): CartItemOptionGroup[] => {
    return Object.entries(selectedOptions).map(([groupId, items]) => ({
      optionGroupId: groupId,
      selectedValues: items.map((item) => ({
        optionItemId: item.optionItemId,
        quantity: 1,
        label: item.label,
        extraPrice: item.extraPrice,
      })),
    }));
  };

  const handleAddToCart = async () => {
    if (!validateSelection()) return;

    const { selectedOrderId } = useOrderBoardStore.getState();
    if (!selectedOrderId) {
      toast.error(ERROR_MESSAGES.selectTable);
      return;
    }

    if (!menuItem) {
      toast.error(ERROR_MESSAGES.invalidData);
      return;
    }

    const cartOptionGroups = buildCartOptionGroups();

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const res = await orderService.addOrderItem(selectedOrderId, {
        orderId: selectedOrderId,
        menuItemId: menuItem.menuItemId,
        quantity: quantity,
        note: note,
        selectedOptions: cartOptionGroups.map((g) => ({
          optionGroupId: g.optionGroupId,
          selectedValues: g.selectedValues.map((v) => ({
            optionItemId: v.optionItemId,
            quantity: v.quantity,
          })),
        })),
      });

      if (res.isSuccess) {
        addItem(selectedOrderId, menuItem, quantity, cartOptionGroups, note, menuItem.priceDineIn);
        toast.success("Đã thêm vào đơn hàng");
        resetLocalState();
        onOpenChange(false);
      } else {
        toast.error(ERROR_MESSAGES.addItemError + res.message);
      }
    } catch (error) {
      console.error("Add item failed:", error);
      toast.error(ERROR_MESSAGES.generalError);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleQuantityChange = (delta: number) => {
    dispatch({
      type: "SET_QUANTITY",
      payload: (prev) => Math.max(1, prev + delta),
    });
  };

  const handleNoteChange = (value: string) => {
    dispatch({ type: "SET_NOTE", payload: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl border-none">
        <SelectionDialogHeader menuItem={menuItem} />

        <SelectionOptionsContent
          optionGroups={optionGroups}
          selectedOptions={selectedOptions}
          loading={loading}
          note={note}
          menuItemName={menuItem?.name || ""}
          onToggleOption={handleToggleOption}
          onNoteChange={handleNoteChange}
        />

        <SelectionDialogFooter
          quantity={quantity}
          totalPrice={totalPrice}
          loading={loading}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
        />
      </DialogContent>
    </Dialog>
  );
}
