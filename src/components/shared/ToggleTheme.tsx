import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { useTheme } from "@/store/ThemeContext";
import { ThemeMode } from "@/types/enums";

import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex gap-2 items-center justify-between">
      <Switch id="toggle-theme" checked={theme === ThemeMode.DARK} onCheckedChange={toggleTheme} />
      <Label htmlFor="toggle-theme">{UI_TEXT.BUTTON.TOGGLE_THEME}</Label>
    </div>
  );
};

export default ToggleTheme;
