"use client";

import React from "react";

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
import { UI_TEXT } from "@/lib/UI_Text";

interface OptionGroupInfoFieldsProps {
  name: string;
  onNameChange: (v: string) => void;
  optionType: "1" | "2";
  onTypeChange: (v: "1" | "2") => void;
  isActive: boolean;
  onActiveChange: (v: boolean) => void;
}

export const OptionGroupInfoFields: React.FC<OptionGroupInfoFieldsProps> = ({
  name,
  onNameChange,
  optionType,
  onTypeChange,
  isActive,
  onActiveChange,
}) => (
  <div className="grid grid-cols-2 gap-4">
    {/* Name */}
    <div className="col-span-2 space-y-1.5">
      <Label htmlFor="og-name" className="font-semibold">
        {UI_TEXT.MENU.OPTIONS.NAME_GROUP}
        <span className="text-destructive ml-0.5">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
      </Label>
      <Input
        id="og-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={UI_TEXT.MENU.OPTIONS.PLACEHOLDER_GROUP_NAME}
        className="h-10"
        autoFocus
      />
    </div>

    {/* Option Type */}
    <div className="space-y-1.5">
      <Label htmlFor="og-type" className="font-semibold">
        {UI_TEXT.MENU.OPTIONS.TYPE}
      </Label>
      <Select value={optionType} onValueChange={(v) => onTypeChange(v as "1" | "2")}>
        <SelectTrigger id="og-type" className="h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">{UI_TEXT.MENU.OPTIONS.TYPE_SINGLE}</SelectItem>
          <SelectItem value="2">{UI_TEXT.MENU.OPTIONS.TYPE_MULTI}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Active toggle */}
    <div className="space-y-3">
      <Label htmlFor="og-active" className="font-semibold cursor-pointer">
        {UI_TEXT.MENU.OPTIONS.IS_ACTIVE_LABEL}
      </Label>
      <Switch id="og-active" checked={isActive} onCheckedChange={onActiveChange} />
    </div>
  </div>
);
