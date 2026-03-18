import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { uploadImage } from "@/services/imageService";
import { menuService } from "@/services/menuService";
import { optionService } from "@/services/optionService";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuItem, OptionGroup, SetMenu } from "@/types/Menu";

type SetMenuApiRes = SetMenu & {
  items?: { menuItemId: string; quantity: number }[];
};

export const useMenuForm = (categories: { id: string; name: string; type: number }[]) => {
  const {
    isModalOpen,
    setModalOpen,
    editingItem,
    setEditingItem,
    addMenuItem,
    updateMenuItem,
    addSetMenu,
    updateSetMenu,
    menuItems,
    fetchMenuItems,
  } = useMenuStore();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [comboItems, setComboItems] = useState<{ menuItemId: string; quantity: number }[]>([]);
  const [isFetchingCombo, setIsFetchingCombo] = useState(false);
  const [optionGroups, setOptionGroups] = useState<Partial<OptionGroup>[]>([]);
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [deletedGroupIds, setDeletedGroupIds] = useState<string[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);

  const isEditing = !!editingItem;
  const isSetMenu = isEditing && editingItem && "setMenuId" in editingItem;
  const itemId = editingItem
    ? isSetMenu
      ? (editingItem as SetMenu).setMenuId
      : (editingItem as MenuItem).menuItemId
    : null;
  const isSetMenuCategory = categories.find((c) => c.id === selectedCategoryId)?.type === 2;

  useEffect(() => {
    if (isModalOpen) {
      if (editingItem) {
        if ("categoryId" in editingItem && editingItem.categoryId) {
          setSelectedCategoryId(editingItem.categoryId);
        } else {
          const defaultCatId =
            categories.find((c) => c.type === (isSetMenu ? 2 : 1))?.id || categories[0]?.id || "";
          setSelectedCategoryId(defaultCatId);
        }

        if (isSetMenu && itemId) {
          setIsFetchingCombo(true);
          menuService
            .getSetMenuById(itemId)
            .then((res) => {
              if (res.isSuccess && res.data) {
                const setMenuData = res.data as SetMenuApiRes;
                if ("categoryId" in setMenuData && setMenuData.categoryId !== undefined) {
                  setSelectedCategoryId(setMenuData.categoryId as string);
                }

                if (setMenuData.items) {
                  setComboItems(
                    setMenuData.items.map((i) => ({
                      menuItemId: i.menuItemId,
                      quantity: i.quantity,
                    }))
                  );
                }
              }
            })
            .finally(() => setIsFetchingCombo(false));
        } else {
          setComboItems([]);
        }

        if (!isSetMenu && itemId) {
          setIsFetchingOptions(true);
          optionService
            .getOptionGroupsByMenuItem(itemId)
            .then((res) => {
              if (res.isSuccess && res.data) {
                setOptionGroups(res.data);
              }
            })
            .finally(() => setIsFetchingOptions(false));
        } else {
          setOptionGroups([]);
        }
      } else {
        setSelectedCategoryId(categories[0]?.id || "");
        setComboItems([]);
        setOptionGroups([]);
        setDeletedGroupIds([]);
        setDeletedItemIds([]);
      }
    }
  }, [editingItem, categories, isModalOpen, isSetMenu, itemId]);

  const addComboItem = () => setComboItems([...comboItems, { menuItemId: "", quantity: 1 }]);
  const updateComboItem = (
    index: number,
    field: "menuItemId" | "quantity",
    value: string | number
  ) => {
    const newItems = [...comboItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setComboItems(newItems);
  };
  const removeComboItem = (index: number) =>
    setComboItems(comboItems.filter((_, i) => i !== index));

  const handleClose = () => {
    setModalOpen(false);
    setEditingItem(null);
    setSelectedImage(null);
    setActiveTab("details");
    setComboItems([]);
    setOptionGroups([]);
    setDeletedGroupIds([]);
    setDeletedItemIds([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const costPrice = Number(formData.get("cost"));
    const categoryId = selectedCategoryId;

    let imageUrl = formData.get("imageUrl") as string;
    if (selectedImage) {
      setIsUploading(true);
      try {
        const uploadRes = await uploadImage(selectedImage);
        if (
          uploadRes.isSuccess &&
          uploadRes.data &&
          typeof uploadRes.data === "object" &&
          "imageUrl" in uploadRes.data
        ) {
          imageUrl = (uploadRes.data as { imageUrl: string }).imageUrl;
        }
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error(error instanceof Error ? error.message : "Image upload failed");
      } finally {
        setIsUploading(false);
      }
    }
    if (isEditing && !itemId) {
      toast.error("Không tìm thấy ID món cần cập nhật");
      return;
    }

    try {
      if (isSetMenuCategory) {
        const setMenuData: Partial<SetMenu> & {
          categoryId: string;
          items: typeof comboItems;
        } = {
          name,
          description,
          price,
          costPrice,
          imageUrl,
          categoryId,
          items: comboItems.filter((i) => i.menuItemId && i.quantity > 0),
        };
        if (isEditing && isSetMenu) {
          await updateSetMenu(itemId!, setMenuData);
        } else {
          await addSetMenu(setMenuData);
        }
      } else {
        const station = Number(formData.get("station"));
        const expectedTime = Number(formData.get("expectedTime"));
        const menuItemData: Partial<MenuItem> = {
          name,
          description,
          price,
          costPrice,
          imageUrl,
          categoryId,
          expectedTime,
          station,
        };

        let savedMenuItemId = itemId;

        if (isEditing && !isSetMenu) {
          await updateMenuItem(itemId!, menuItemData);
        } else {
          const newItem = await addMenuItem(menuItemData);
          if (newItem) {
            savedMenuItemId = newItem.menuItemId;
          }
        }

        if (savedMenuItemId) {
          for (const gId of deletedGroupIds) {
            await optionService.deleteOptionGroup(gId);
          }
          for (const iId of deletedItemIds) {
            await optionService.deleteOptionItem(iId);
          }

          for (const group of optionGroups) {
            let currentGroupId = group.optionGroupId;
            const isNewGroup = !currentGroupId || currentGroupId.startsWith("temp-");

            if (isNewGroup) {
              const groupRes = await optionService.createOptionGroup({
                menuItemId: savedMenuItemId,
                name: group.name,
                optionType: group.optionType,
                isRequired: group.isRequired,
              });
              if (groupRes.isSuccess && groupRes.data) {
                currentGroupId = groupRes.data;
              }
            } else if (currentGroupId) {
              await optionService.updateOptionGroup(currentGroupId, {
                name: group.name,
                optionType: group.optionType,
                isRequired: group.isRequired,
              });
            }

            if (currentGroupId && group.optionItems) {
              for (const item of group.optionItems) {
                const currentItemId = item.optionItemId;
                const isNewItem = !currentItemId || currentItemId.startsWith("temp-");

                if (isNewItem) {
                  await optionService.createOptionItem({
                    optionGroupId: currentGroupId,
                    label: item.label,
                    extraPrice: item.extraPrice,
                  });
                } else {
                  await optionService.updateOptionItem(currentItemId, {
                    label: item.label,
                    extraPrice: item.extraPrice,
                  });
                }
              }
            }
          }
        }
      }
      toast.success(UI_TEXT.MENU.SAVE_SUCCESS);
      handleClose();
    } catch (error) {
      console.error("Failed to save menu item", error);
      toast.error(error instanceof Error ? error.message : "Failed to save menu item");
    }
  };

  return {
    isModalOpen,
    isEditing,
    isSetMenu,
    itemId,
    isSetMenuCategory,
    editingItem,
    menuItems,
    fetchMenuItems,

    selectedImage,
    setSelectedImage,
    isUploading,
    activeTab,
    setActiveTab,
    selectedCategoryId,
    setSelectedCategoryId,
    comboItems,
    isFetchingCombo,
    optionGroups,
    setOptionGroups,
    isFetchingOptions,
    setDeletedGroupIds,
    setDeletedItemIds,

    addComboItem,
    updateComboItem,
    removeComboItem,
    handleSubmit,
    handleClose,
  };
};
