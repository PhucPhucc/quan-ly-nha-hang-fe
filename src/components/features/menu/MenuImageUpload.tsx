import React from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UI_TEXT } from "@/lib/UI_Text";
import { MenuItem, SetMenu } from "@/types/Menu";

interface MenuImageUploadProps {
  editingItem: MenuItem | SetMenu | null;
  isUploading: boolean;
  setSelectedImage: (file: File | null) => void;
}

export const MenuImageUpload: React.FC<MenuImageUploadProps> = ({
  editingItem,
  isUploading,
  setSelectedImage,
}) => {
  return (
    <Field className="space-y-2 col-span-2">
      <Label htmlFor="imageFile" className="text-right">
        {UI_TEXT.MENU.LABEL_IMAGE_VIEW}
        {isUploading && (
          <span className="text-muted-foreground ml-2 text-sm">{UI_TEXT.MENU.LOADING_IMAGE}</span>
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
      <Input
        id="imageUrl"
        name="imageUrl"
        type="hidden"
        defaultValue={editingItem?.imageUrl || "/placeholderMenu.webp"}
      />
    </Field>
  );
};
