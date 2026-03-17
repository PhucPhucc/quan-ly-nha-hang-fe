import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Station } from "@/types/enums";
import { MenuItem } from "@/types/Menu";

interface MenuDetailsTabProps {
  editingItem: MenuItem | null;
  categories: { id: string; name: string }[];
  isUploading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export const MenuDetailsTab: React.FC<MenuDetailsTabProps> = ({
  editingItem,
  categories,
  isUploading,
  onSubmit,
  onCancel,
}) => {
  const isEditing = !!editingItem;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name" className="text-neutral-700 font-semibold">
                {UI_TEXT.MENU.LABEL_NAME}{" "}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingItem?.name || ""}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_NAME}
                className="h-11 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description" className="text-neutral-700 font-semibold">
                {UI_TEXT.MENU.LABEL_DESC}
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description || ""}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_DESC}
                className="min-h-32 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-neutral-700 font-semibold">
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
                className="h-11 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost" className="text-neutral-700 font-semibold">
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
                className="h-11 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="categoryId" className="text-neutral-700 font-semibold">
                {UI_TEXT.MENU.LABEL_CATEGORY}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Select name="categoryId" defaultValue={editingItem?.categoryId || "null"} required>
                <SelectTrigger id="categoryId" className="h-11">
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
              <Label htmlFor="station" className="text-neutral-700 font-semibold">
                {UI_TEXT.MENU.LABEL_STATION}
                <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
              </Label>
              <Select
                name="station"
                defaultValue={editingItem?.station?.toString() || "null"}
                required
              >
                <SelectTrigger id="station" className="h-11">
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
              <Label htmlFor="expectedTime" className="text-neutral-700 font-semibold">
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
                className="h-11 focus:ring-primary/20"
                required
              />
            </div>

            <div className="flex items-center space-x-2 col-span-2 mt-2 bg-primary/5 p-4 rounded-xl border border-primary/10 text-sm">
              <Switch
                id="isOutOfStock"
                name="isOutOfStock"
                defaultChecked={editingItem?.isOutOfStock || false}
              />
              <Label
                htmlFor="isOutOfStock"
                className="cursor-pointer font-semibold text-neutral-800 pt-0.5"
              >
                {UI_TEXT.MENU.LABEL_MARK_OUT_OF_STOCK}
              </Label>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isUploading}
          className="h-11 px-8"
        >
          {UI_TEXT.MENU.BUTTON_CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={isUploading}
          className="h-11 px-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all active:scale-95"
        >
          {isUploading
            ? UI_TEXT.MENU.UPLOADING_IMAGE
            : isEditing
              ? UI_TEXT.MENU.BUTTON_UPDATE
              : UI_TEXT.MENU.BUTTON_CREATE}
        </Button>
      </div>
    </form>
  );
};
