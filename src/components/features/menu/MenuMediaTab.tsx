import { Image as ImageIcon } from "lucide-react";
import React from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UI_TEXT } from "@/lib/UI_Text";
import { MenuItem, SetMenu } from "@/types/Menu";

interface MenuMediaTabProps {
  editingItem: MenuItem | SetMenu | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MenuMediaTab: React.FC<MenuMediaTabProps> = ({ editingItem, onFileChange }) => {
  return (
    <div className="p-6">
      <Card className="p-12 text-center bg-white shadow-sm border-none">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <ImageIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold">{UI_TEXT.MENU.MEDIA_MANAGEMENT_TITLE}</h3>
        <p className="text-neutral-500 mb-6">{UI_TEXT.MENU.MEDIA_MANAGEMENT_DESC}</p>
        <div className="max-w-md mx-auto space-y-4">
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            className="h-12 border-dashed border-2 flex items-center"
            onChange={onFileChange}
          />
          <div className="relative">
            <Separator className="my-6" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
              {UI_TEXT.MENU.OR}
            </span>
          </div>
          <Input
            id="imageUrl"
            name="imageUrl"
            defaultValue={editingItem?.imageUrl || ""}
            placeholder={UI_TEXT.MENU.PLACEHOLDER_IMAGE_URL}
            className="h-11"
          />
        </div>
      </Card>
    </div>
  );
};
