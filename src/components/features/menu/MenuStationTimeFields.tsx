import React from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { Station } from "@/types/enums";
import { MenuItem, SetMenu } from "@/types/Menu";

interface MenuStationTimeFieldsProps {
  editingItem: MenuItem | SetMenu | null;
}

export const MenuStationTimeFields: React.FC<MenuStationTimeFieldsProps> = ({ editingItem }) => {
  return (
    <>
      <Field className="space-y-2 col-span-2 md:col-span-1">
        <Label htmlFor="station" className="text-right">
          {UI_TEXT.MENU.LABEL_STATION}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </Label>
        <Select
          name="station"
          defaultValue={
            "station" in (editingItem || {})
              ? String((editingItem as MenuItem).station)
              : Station.HOT_KITCHEN.toString()
          }
          required
        >
          <SelectTrigger id="station">
            <SelectValue placeholder={UI_TEXT.MENU.PLACEHOLDER_STATION} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Station.HOT_KITCHEN.toString()}>
              {UI_TEXT.MENU.STATION.HOTKITCHEN}
            </SelectItem>
            <SelectItem value={Station.COLD_KITCHEN.toString()}>
              {UI_TEXT.MENU.STATION.COLDKITCHEN}
            </SelectItem>
            <SelectItem value={Station.BAR.toString()}>{UI_TEXT.MENU.STATION.DRINKS}</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field className="space-y-2 col-span-2">
        <Label htmlFor="expectedTime" className="text-right">
          {UI_TEXT.MENU.LABEL_EXPECTED_TIME}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </Label>
        <Input
          id="expectedTime"
          name="expectedTime"
          type="number"
          min="1"
          defaultValue={
            "expectedTime" in (editingItem || {}) ? (editingItem as MenuItem).expectedTime : ""
          }
          placeholder={UI_TEXT.MENU.PLACEHOLDER_EXPECTED_TIME}
          required
        />
      </Field>
    </>
  );
};
