import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ERROR_MESSAGES,
  initialMenuOptionState,
  menuOptionReducer,
} from "@/hooks/useMenuOptionReducer";
import { UI_TEXT } from "@/lib/UI_Text";
import { optionService } from "@/services/optionService";
import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { CartItemOptionGroup } from "@/types/Cart";
import { MenuItem, MenuItemOptionGroup, OptionItem } from "@/types/Menu";

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
  const [comboOptionGroupsByChildId, setComboOptionGroupsByChildId] = useState<
    Record<string, MenuItemOptionGroup[]>
  >({});
  const [comboSelectedOptionsByChildId, setComboSelectedOptionsByChildId] = useState<
    Record<string, Record<string, OptionItem[]>>
  >({});
  const [comboNotesByChildId, setComboNotesByChildId] = useState<Record<string, string>>({});
  const [comboLoading, setComboLoading] = useState(false);
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

          if (menuItem.items?.length) {
            setComboLoading(true);
            const grouped: Record<string, MenuItemOptionGroup[]> = {};

            await Promise.all(
              menuItem.items.map(async (child) => {
                const childRes = await optionService.getOptionGroupsByMenuItem(child.menuItemId);
                grouped[child.menuItemId] =
                  childRes.isSuccess && childRes.data ? childRes.data : [];
              })
            );

            setComboOptionGroupsByChildId(grouped);
            setComboSelectedOptionsByChildId({});
            setComboNotesByChildId({});
          } else {
            setComboOptionGroupsByChildId({});
            setComboSelectedOptionsByChildId({});
            setComboNotesByChildId({});
          }
        } catch {
          toast.error(ERROR_MESSAGES.loadOptions);
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
          setComboLoading(false);
        }
      };
      fetchData();
    } else {
      resetLocalState();
      setComboOptionGroupsByChildId({});
      setComboSelectedOptionsByChildId({});
      setComboNotesByChildId({});
      setComboLoading(false);
    }
  }, [open, menuItem, resetLocalState]);

  const extraPrice = useMemo(
    () =>
      Object.values(selectedOptions)
        .flat()
        .reduce((acc, item) => acc + item.extraPrice, 0),
    [selectedOptions]
  );

  const comboExtraPrice = useMemo(() => {
    return (menuItem?.items ?? []).reduce((total, child) => {
      const childGroups = comboOptionGroupsByChildId[child.menuItemId] || [];
      const childSelected = comboSelectedOptionsByChildId[child.menuItemId] || {};

      const childOptionPrice = Object.entries(childSelected).reduce(
        (groupTotal, [groupId, items]) => {
          const groupInfo = childGroups.find((g) => g.optionGroupId === groupId);
          const groupMultiplier = groupInfo?.optionType === OPTION_TYPE_SINGLE_SELECT ? 1 : 1;
          const itemTotal = items.reduce((itemSum, item) => itemSum + item.extraPrice, 0);
          return groupTotal + itemTotal * groupMultiplier;
        },
        0
      );

      return total + childOptionPrice * child.quantity;
    }, 0);
  }, [comboOptionGroupsByChildId, comboSelectedOptionsByChildId, menuItem?.items]);

  const totalPrice = menuItem ? (menuItem.price + extraPrice + comboExtraPrice) * quantity : 0;

  const handleToggleOption = (group: MenuItemOptionGroup, item: OptionItem, isChecked: boolean) => {
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
        toast.warning(UI_TEXT.MENU.MAX_SELECT_REACHED(group.maxSelect));
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
        toast.error(UI_TEXT.MENU.PLEASE_SELECT_GROUP(group.name));
        return false;
      }
    }
    return true;
  };

  const buildCartOptionGroups = (): CartItemOptionGroup[] => {
    return Object.entries(selectedOptions).map(([groupId, items]) => {
      const groupInfo = optionGroups.find((g) => g.optionGroupId === groupId);
      return {
        optionGroupId: groupId,
        groupName: groupInfo?.name || "",
        selectedValues: items.map((item) => ({
          optionItemId: item.optionItemId,
          quantity: 1,
          label: item.label,
          extraPrice: item.extraPrice,
        })),
      };
    });
  };

  const buildComboChildren = () =>
    (menuItem?.items ?? []).map((child) => {
      const childGroups = comboOptionGroupsByChildId[child.menuItemId] || [];
      const childSelected = comboSelectedOptionsByChildId[child.menuItemId] || {};

      return {
        menuItemId: child.menuItemId,
        menuItemName: child.menuItemName,
        quantity: child.quantity,
        note: comboNotesByChildId[child.menuItemId] || "",
        selectedOptions: Object.entries(childSelected).map(([groupId, items]) => {
          const groupInfo = childGroups.find((g) => g.optionGroupId === groupId);
          return {
            optionGroupId: groupId,
            groupName: groupInfo?.name || "",
            selectedValues: items.map((item) => ({
              optionItemId: item.optionItemId,
              quantity: 1,
              label: item.label,
              extraPrice: item.extraPrice,
            })),
          };
        }),
      };
    });

  const validateComboSelection = (): boolean => {
    for (const child of menuItem?.items ?? []) {
      const groups = comboOptionGroupsByChildId[child.menuItemId] || [];
      const selected = comboSelectedOptionsByChildId[child.menuItemId] || {};

      for (const group of groups) {
        const selection = selected[group.optionGroupId] || [];
        if (group.isRequired && selection.length < group.minSelect) {
          toast.error(
            UI_TEXT.MENU.PLEASE_SELECT_GROUP(
              `${child.menuItemName || child.menuItemId} - ${group.name}`
            )
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleToggleComboOption = (
    childMenuItemId: string,
    group: MenuItemOptionGroup,
    item: OptionItem,
    isChecked: boolean
  ) => {
    const currentChild = comboSelectedOptionsByChildId[childMenuItemId] || {};
    const currentSelection = currentChild[group.optionGroupId] || [];

    if (group.optionType === OPTION_TYPE_SINGLE_SELECT) {
      setComboSelectedOptionsByChildId({
        ...comboSelectedOptionsByChildId,
        [childMenuItemId]: { ...currentChild, [group.optionGroupId]: [item] },
      });
      return;
    }

    if (isChecked) {
      if (currentSelection.length >= group.maxSelect) {
        toast.warning(UI_TEXT.MENU.MAX_SELECT_REACHED(group.maxSelect));
        return;
      }
      setComboSelectedOptionsByChildId({
        ...comboSelectedOptionsByChildId,
        [childMenuItemId]: {
          ...currentChild,
          [group.optionGroupId]: [...currentSelection, item],
        },
      });
      return;
    }

    setComboSelectedOptionsByChildId({
      ...comboSelectedOptionsByChildId,
      [childMenuItemId]: {
        ...currentChild,
        [group.optionGroupId]: currentSelection.filter((i) => i.optionItemId !== item.optionItemId),
      },
    });
  };

  const handleComboNoteChange = (childMenuItemId: string, value: string) => {
    setComboNotesByChildId((prev) => ({ ...prev, [childMenuItemId]: value }));
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    if (!validateComboSelection()) return;

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
    const comboChildren = buildComboChildren();

    // Chỉ lưu vào CartStore local, không gọi API
    // API sẽ được gọi khi nhấn "Gửi yêu cầu" (submitToKitchen)
    addItem(
      selectedOrderId,
      menuItem,
      quantity,
      cartOptionGroups,
      comboChildren,
      note,
      menuItem.price
    );
    toast.success(UI_TEXT.MENU.ADDED_TO_ORDER);
    resetLocalState();
    onOpenChange(false);
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
      <DialogContent className="max-w-md max-h-[90vh] min-h-0 grid grid-rows-[auto_minmax(0,1fr)_auto] p-0 gap-0 overflow-hidden shadow-2xl border-none">
        <SelectionDialogHeader menuItem={menuItem} />

        <SelectionOptionsContent
          optionGroups={optionGroups}
          selectedOptions={selectedOptions}
          loading={loading}
          comboLoading={comboLoading}
          comboChildren={menuItem?.items || []}
          comboOptionGroupsByChildId={comboOptionGroupsByChildId}
          comboSelectedOptionsByChildId={comboSelectedOptionsByChildId}
          comboNotesByChildId={comboNotesByChildId}
          note={note}
          menuItemName={menuItem?.name || ""}
          onToggleOption={handleToggleOption}
          onToggleComboOption={handleToggleComboOption}
          onComboNoteChange={handleComboNoteChange}
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
