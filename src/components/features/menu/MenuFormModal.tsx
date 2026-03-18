import { ClipboardList, ImageIcon, Utensils } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { uploadImage } from "@/services/imageService";
import { menuService } from "@/services/menuService";
import { optionService } from "@/services/optionService";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuItem, SetMenu } from "@/types/Menu";
import { OptionGroup } from "@/types/Menu";

import { MenuBasicInfoFields } from "./MenuBasicInfoFields";
import { MenuComboItems } from "./MenuComboItems";
import { MenuImageUpload } from "./MenuImageUpload";
import { MenuOptionGroups } from "./MenuOptionGroups";
import { MenuStationTimeFields } from "./MenuStationTimeFields";

type SetMenuApiRes = SetMenu & {
  items?: { menuItemId: string; quantity: number }[];
};

interface MenuFormModalProps {
  categories: { id: string; name: string; type: number }[];
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({ categories }) => {
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
  } = useMenuStore();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [comboItems, setComboItems] = useState<{ menuItemId: string; quantity: number }[]>([]);
  const [isFetchingCombo, setIsFetchingCombo] = useState(false);
  const [optionGroups, setOptionGroups] = useState<Partial<OptionGroup>[]>([]);
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [deletedGroupIds, setDeletedGroupIds] = useState<string[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("details");

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
        // DELETIONS
        for (const gId of deletedGroupIds) {
          await optionService.deleteOptionGroup(gId);
        }
        for (const iId of deletedItemIds) {
          await optionService.deleteOptionItem(iId);
        }

        // CREATIONS & UPDATES
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
          } else {
            await optionService.updateOptionGroup(currentGroupId, {
              name: group.name,
              optionType: group.optionType,
              isRequired: group.isRequired,
            });
          }
          console.log(123123);
          if (currentGroupId && group.optionItems) {
            for (const item of group.optionItems) {
              const currentItemId = item.optionItemId;
              const isNewItem = !currentItemId || currentItemId.startsWith("temp-");
              console.log(isNewItem);
              if (isNewItem) {
                console.log(currentGroupId);
                await optionService.createOptionItem({
                  optionGroupId: currentGroupId,
                  label: item.label,
                  extraPrice: item.extraPrice,
                });
              } else {
                await optionService(currentItemId, {
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
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingItem(null);
    setSelectedImage(null);
    setComboItems([]);
    setOptionGroups([]);
    setDeletedGroupIds([]);
    setDeletedItemIds([]);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-6 overflow-auto ">
        <div className="p-6 border-b shrink-0 z-30">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {isEditing
                    ? editingItem?.name || UI_TEXT.MENU.MODAL_EDIT_TITLE
                    : UI_TEXT.MENU.MODAL_ADD_TITLE}
                </DialogTitle>
                <DialogDescription className="text-neutral-500 font-medium">
                  {isEditing ? UI_TEXT.MENU.MODAL_EDIT_DESC : UI_TEXT.MENU.MODAL_ADD_DESC}
                </DialogDescription>
              </div>
              {isEditing && (
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border">
                    {UI_TEXT.MENU.MODAL_ID_PREFIX} {itemId?.substring(0, 8)}
                    {UI_TEXT.COMMON.ELLIPSIS}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-neutral-100/50 p-1 rounded-lg border border-neutral-200">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                {UI_TEXT.MENU.TAB_DETAILS}
              </TabsTrigger>
              {isEditing && (
                <TabsTrigger
                  value="recipe"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 gap-2"
                >
                  <Utensils className="w-4 h-4" />
                  {UI_TEXT.MENU.TAB_RECIPE}
                </TabsTrigger>
              )}
              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {UI_TEXT.MENU.TAB_MEDIA}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <form onSubmit={handleSubmit} className="py-2">
          <FieldGroup className="grid grid-cols-2 gap-4">
            <MenuBasicInfoFields
              editingItem={editingItem}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
            />

            {!isSetMenuCategory ? (
              <>
                <MenuStationTimeFields editingItem={editingItem} />
                <MenuOptionGroups
                  optionGroups={optionGroups}
                  setOptionGroups={setOptionGroups}
                  isFetchingOptions={isFetchingOptions}
                  onDeleteGroup={(id) => setDeletedGroupIds((prev) => [...prev, id])}
                  onDeleteItem={(id) => setDeletedItemIds((prev) => [...prev, id])}
                />
              </>
            ) : (
              <MenuComboItems
                comboItems={comboItems}
                menuItems={menuItems}
                isFetchingCombo={isFetchingCombo}
                addComboItem={addComboItem}
                updateComboItem={updateComboItem}
                removeComboItem={removeComboItem}
              />
            )}

            <MenuImageUpload
              editingItem={editingItem}
              isUploading={isUploading}
              setSelectedImage={setSelectedImage}
            />
          </FieldGroup>

          <DialogFooter className="pt-4 px-0 flex flex-row gap-2 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="w-1/2"
            >
              {UI_TEXT.MENU.BUTTON_CANCEL}
            </Button>
            <Button type="submit" disabled={isUploading} className="w-1/2">
              {isUploading
                ? UI_TEXT.COMMON.LOADING
                : isEditing
                  ? UI_TEXT.MENU.BUTTON_UPDATE
                  : UI_TEXT.MENU.BUTTON_CREATE}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
