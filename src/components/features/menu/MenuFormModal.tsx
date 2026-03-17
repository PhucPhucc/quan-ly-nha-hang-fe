import { ClipboardList, Image as ImageIcon, Utensils } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { uploadImage } from "@/services/imageService";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuItem } from "@/types/Menu";

import { RecipeSetupForm } from "../recipe/RecipeSetupForm";
import { MenuDetailsTab } from "./MenuDetailsTab";
import { MenuMediaTab } from "./MenuMediaTab";

interface MenuFormModalProps {
  categories: { id: string; name: string }[];
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({ categories }) => {
  const {
    isModalOpen,
    setModalOpen,
    editingItem,
    setEditingItem,
    addMenuItem,
    updateMenuItem,
    fetchMenuItems,
  } = useMenuStore();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<MenuItem> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      costPrice: Number(formData.get("cost")),
      categoryId: formData.get("categoryId") as string,
      station: Number(formData.get("station")),
      expectedTime: Number(formData.get("expectedTime")),
      imageUrl: formData.get("imageUrl") as string,
    };

    setIsUploading(true);
    let finalImageUrl = data.imageUrl;

    if (selectedImage) {
      try {
        const uploadRes = await uploadImage(selectedImage);
        if (
          uploadRes.isSuccess &&
          uploadRes.data &&
          typeof uploadRes.data === "object" &&
          "imageUrl" in uploadRes.data
        ) {
          finalImageUrl = (uploadRes.data as { imageUrl: string }).imageUrl;
        }
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error(error instanceof Error ? error.message : "Image upload failed");
      }
    }
    const menuItemData: Partial<MenuItem> = {
      ...data,
      imageUrl: finalImageUrl,
    };

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.menuItemId, menuItemData);
      } else {
        await addMenuItem(menuItemData);
      }
      handleClose();
    } catch (error) {
      console.error("Failed to save menu item", error);
      toast.error(error instanceof Error ? error.message : "Failed to save menu item");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingItem(null);
    setSelectedImage(null);
    setActiveTab("details");
  };

  const isEditing = !!editingItem;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`flex flex-col p-0 border-none overflow-hidden rounded-xl bg-neutral-50 shadow-2xl transition-all duration-300 ${activeTab === "recipe" ? "sm:max-w-7xl h-[90vh]" : "sm:max-w-2xl max-h-[90vh]"}`}
      >
        {/* Fixed Header */}
        <div className="bg-white p-6 border-b shrink-0 z-30">
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
                    {UI_TEXT.MENU.MODAL_ID_PREFIX} {editingItem.menuItemId.substring(0, 8)}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="details" className="mt-0">
              <MenuDetailsTab
                editingItem={editingItem}
                categories={categories}
                isUploading={isUploading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
              />
            </TabsContent>

            {isEditing && (
              <TabsContent value="recipe" className="mt-0">
                <RecipeSetupForm
                  menuItemId={editingItem.menuItemId}
                  onSuccess={() => {
                    fetchMenuItems();
                    setActiveTab("details");
                  }}
                  onCancel={handleClose}
                />
              </TabsContent>
            )}

            <TabsContent value="media" className="mt-0">
              <MenuMediaTab
                editingItem={editingItem}
                onFileChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedImage(e.target.files[0]);
                  } else {
                    setSelectedImage(null);
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
