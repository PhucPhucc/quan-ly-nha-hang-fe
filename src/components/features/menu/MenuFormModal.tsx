import { ClipboardList, Image as ImageIcon, Plus, Utensils } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenuForm } from "@/hooks/useMenuForm";
import { UI_TEXT } from "@/lib/UI_Text";
import { uploadImage } from "@/services/imageService";
import { menuService } from "@/services/menuService";
import { optionService } from "@/services/optionService";
import { useMenuStore } from "@/store/useMenuStore";
import { Category } from "@/types/Menu";
import { MenuItem, MenuItemOptionGroup, SetMenu } from "@/types/Menu";

import { RecipeSetupForm } from "../recipe/RecipeSetupForm";
import { MenuDetailsTab } from "./MenuDetailsTab";
import { MenuMediaTab } from "./MenuMediaTab";
import { MenuItemOptionAssignment } from "./options/MenuItemOptionAssignment";

interface MenuFormModalProps {
  categories: Category[];
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({ categories }) => {
  const form = useMenuForm(categories);
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
  // -- NEW STATE FOR REUSABLE OPTIONS --
  const [optionAssignments, setOptionAssignments] = useState<MenuItemOptionGroup[]>([]);
  const [isFetchingAssignments, setIsFetchingAssignments] = useState(false);

  const isEditing = !!editingItem;
  const isSetMenu = isEditing && editingItem && "setMenuId" in editingItem;
  const itemId = editingItem
    ? isSetMenu
      ? (editingItem as SetMenu).setMenuId
      : (editingItem as MenuItem).menuItemId
    : null;
  const isSetMenuCategory = categories.find((c) => c.categoryId === selectedCategoryId)?.type === 2;

  useEffect(() => {
    if (isModalOpen) {
      if (editingItem) {
        if ("categoryId" in editingItem && editingItem.categoryId) {
          setSelectedCategoryId(editingItem.categoryId);
        } else {
          const defaultCatId =
            categories.find((c) => c.type === (isSetMenu ? 2 : 1))?.categoryId ||
            categories[0]?.categoryId ||
            "";
          setSelectedCategoryId(defaultCatId);
        }

        if (isSetMenu && itemId) {
          setIsFetchingCombo(true);
          menuService
            .getSetMenuById(itemId)
            .then((res) => {
              if (res.isSuccess && res.data) {
                const setMenuData = res.data as SetMenu & {
                  items?: { menuItemId: string; quantity: number }[];
                };
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
          // Fetch new reusable assignments
          setIsFetchingAssignments(true);
          optionService
            .getAssignmentsByMenuItem(itemId)
            .then((res) => {
              if (res.isSuccess && res.data) {
                setOptionAssignments(res.data);
              }
            })
            .finally(() => setIsFetchingAssignments(false));
        } else {
          setOptionAssignments([]);
        }
      } else {
        setSelectedCategoryId(categories[0]?.categoryId || "");
        setComboItems([]);
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
          // --- SAVE REUSABLE ASSIGNMENTS ---
          for (const assignment of optionAssignments) {
            if (assignment.menuItemOptionGroupId.startsWith("temp-")) {
              await optionService.assignToMenuItem({
                menuItemId: savedMenuItemId!,
                optionGroupId: assignment.optionGroupId,
                isRequired: assignment.isRequired,
                minSelect: assignment.minSelect,
                maxSelect: assignment.maxSelect,
                sortOrder: assignment.sortOrder,
              });
            } else {
              await optionService.updateAssignment(assignment.menuItemOptionGroupId, {
                isRequired: assignment.isRequired,
                minSelect: assignment.minSelect,
                maxSelect: assignment.maxSelect,
                sortOrder: assignment.sortOrder,
              });
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

  const handleClose = () => {
    setModalOpen(false);
    setEditingItem(null);
    setSelectedImage(null);
    setActiveTab("details");
    setComboItems([]);
  };

  return (
    <Dialog open={form.isModalOpen} onOpenChange={form.handleClose}>
      <DialogContent
        className={`flex flex-col gap-0 p-0 border-none overflow-hidden rounded-xl bg-background shadow-2xl transition-all duration-300 ${form.activeTab === "recipe" ? "sm:max-w-7xl h-[90vh]" : "sm:max-w-2xl max-h-[90vh]"}`}
      >
        <div className="bg-card p-6 border-b shrink-0 z-30">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {form.isEditing
                    ? form.editingItem?.name || UI_TEXT.MENU.MODAL_EDIT_TITLE
                    : UI_TEXT.MENU.MODAL_ADD_TITLE}
                </DialogTitle>
                <DialogDescription className="text-foreground font-medium">
                  {form.isEditing ? UI_TEXT.MENU.MODAL_EDIT_DESC : UI_TEXT.MENU.MODAL_ADD_DESC}
                </DialogDescription>
              </div>
              {form.isEditing && (
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border">
                    {UI_TEXT.MENU.MODAL_ID_PREFIX} {form.itemId?.substring(0, 8)}
                    {UI_TEXT.COMMON.ELLIPSIS}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>

          <Tabs value={form.activeTab} onValueChange={form.setActiveTab} className="w-full">
            <TabsList className="bg-background p-1 rounded-lg border border-border">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-6 py-2 gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                {UI_TEXT.MENU.TAB_DETAILS}
              </TabsTrigger>
              {form.isEditing && !form.isSetMenuCategory && (
                <TabsTrigger
                  value="options"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {UI_TEXT.MENU.OPTIONS.TITLE}
                </TabsTrigger>
              )}
              {isEditing && !isSetMenuCategory && (
                <TabsTrigger
                  value="recipe"
                  className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-6 py-2 gap-2"
                >
                  <Utensils className="w-4 h-4" />
                  {UI_TEXT.MENU.TAB_RECIPE}
                </TabsTrigger>
              )}
              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-6 py-2 gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {UI_TEXT.MENU.TAB_MEDIA}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Tabs value={form.activeTab} onValueChange={form.setActiveTab} className="w-full">
            <TabsContent value="details" className="mt-0">
              <MenuDetailsTab
                editingItem={editingItem}
                categories={categories}
                isUploading={isUploading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                isSetMenuCategory={isSetMenuCategory}
                comboItems={comboItems}
                menuItems={menuItems}
                isFetchingCombo={isFetchingCombo}
                addComboItem={addComboItem}
                updateComboItem={updateComboItem}
                removeComboItem={removeComboItem}
              />
            </TabsContent>

            <TabsContent value="options" className="mt-0 p-6">
              <MenuItemOptionAssignment
                assignments={optionAssignments}
                setAssignments={setOptionAssignments}
                menuItemId={itemId as string}
                isFetching={isFetchingAssignments}
              />
            </TabsContent>

            {form.isEditing && !form.isSetMenuCategory && (
              <TabsContent value="recipe" className="mt-0">
                <RecipeSetupForm
                  menuItemId={form.itemId as string}
                  onSuccess={() => {
                    form.fetchMenuItems();
                    form.setActiveTab("details");
                  }}
                  onCancel={form.handleClose}
                />
              </TabsContent>
            )}

            <TabsContent value="media" className="mt-0">
              <MenuMediaTab
                editingItem={form.editingItem}
                onFileChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    form.setSelectedImage(e.target.files[0]);
                  } else {
                    form.setSelectedImage(null);
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
