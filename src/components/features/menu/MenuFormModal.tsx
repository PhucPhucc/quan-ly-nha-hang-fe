import React, { useState } from "react";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { uploadImage } from "@/services/imageService";
import { useMenuStore } from "@/store/useMenuStore";
import { Station } from "@/types/enums";
import { MenuItem } from "@/types/Menu";

interface MenuFormModalProps {
  categories: { id: string; name: string }[];
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({ categories }) => {
  const { isModalOpen, setModalOpen, editingItem, setEditingItem, addMenuItem, updateMenuItem } =
    useMenuStore();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const costPrice = Number(formData.get("cost"));
    const categoryId = formData.get("categoryId") as string;
    const station = Number(formData.get("station"));
    const expectedTime = Number(formData.get("expectedTime"));

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
      } finally {
        setIsUploading(false);
      }
    }

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
    console.log(menuItemData);
    if (editingItem) {
      await updateMenuItem(editingItem.menuItemId, menuItemData);
    } else {
      await addMenuItem(menuItemData);
    }
    handleClose();
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingItem(null);
    setSelectedImage(null);
  };

  const isEditing = !!editingItem;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-150 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? UI_TEXT.MENU.MODAL_EDIT_TITLE : UI_TEXT.MENU.MODAL_ADD_TITLE}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? UI_TEXT.MENU.MODAL_EDIT_DESC : UI_TEXT.MENU.MODAL_ADD_DESC}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name" className="text-right">
                {UI_TEXT.MENU.LABEL_NAME}{" "}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingItem?.name || ""}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_NAME}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description" className="text-right">
                {UI_TEXT.MENU.LABEL_DESC}
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description || ""}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_DESC}
                className="min-h-25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-right">
                {UI_TEXT.MENU.LABEL_PRICE}{" "}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                defaultValue={editingItem?.price || ""}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_PRICE}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost" className="text-right">
                {UI_TEXT.MENU.LABEL_COST}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                defaultValue={editingItem?.costPrice || ""}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_COST}
                required
              />
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="categoryId" className="text-right">
                {UI_TEXT.MENU.LABEL_CATEGORY}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Select name="categoryId" defaultValue={editingItem?.categoryId || "null"} required>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder={UI_TEXT.MENU.PLACEHOLDER_CATEGORY} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">{UI_TEXT.MENU.OPTION_SELECT_DEFAULT}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="station" className="text-right">
                {UI_TEXT.MENU.LABEL_STATION}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Select
                name="station"
                defaultValue={editingItem?.station?.toString() || "null"}
                required
              >
                <SelectTrigger id="station">
                  <SelectValue placeholder={UI_TEXT.MENU.PLACEHOLDER_STATION} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">{UI_TEXT.MENU.OPTION_SELECT_DEFAULT}</SelectItem>
                  <SelectItem value={Station.HOT_KITCHEN.toString()}>
                    {UI_TEXT.MENU.STATION.HOTKITCHEN}
                  </SelectItem>
                  <SelectItem value={Station.COLD_KITCHEN.toString()}>
                    {UI_TEXT.MENU.STATION.COLDKITCHEN}
                  </SelectItem>
                  <SelectItem value={Station.BAR.toString()}>
                    {UI_TEXT.MENU.STATION.DRINKS}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="expectedTime" className="text-right">
                {UI_TEXT.MENU.LABEL_EXPECTED_TIME}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Input
                id="expectedTime"
                name="expectedTime"
                type="number"
                min="1"
                defaultValue={editingItem?.expectedTime || ""}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_EXPECTED_TIME}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="imageFile" className="text-right">
                {UI_TEXT.MENU.LABEL_IMAGE_VIEW}
                {isUploading && (
                  <span className="text-muted-foreground ml-2 text-sm">
                    {UI_TEXT.MENU.LOADING_IMAGE}
                  </span>
                )}
              </Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedImage(e.target.files[0]);
                  } else {
                    setSelectedImage(null);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">{UI_TEXT.MENU.LABEL_IMAGE_URL}</p>
              <Input
                id="imageUrl"
                name="imageUrl"
                className="mt-1"
                defaultValue={editingItem?.imageUrl || ""}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_IMAGE_URL}
              />
            </div>

            <div className="flex items-center space-x-2 col-span-2 mt-2 bg-gray-50 p-4 rounded-md border text-sm">
              <Switch
                id="isOutOfStock"
                name="isOutOfStock"
                defaultChecked={editingItem?.isOutOfStock || false}
              />
              <Label htmlFor="isOutOfStock" className="cursor-pointer font-medium pt-1">
                {UI_TEXT.MENU.LABEL_MARK_OUT_OF_STOCK}
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
              {UI_TEXT.MENU.BUTTON_CANCEL}
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading
                ? "Đang xử lý..."
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
