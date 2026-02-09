import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { UI_TEXT } from "./UI_Text";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateNewPassword(newPassword: string, confirmPassword: string) {
  if (!newPassword || !confirmPassword) {
    return UI_TEXT.CHANGE_PASSWORD.REQUIRED;
  }

  if (newPassword !== confirmPassword) {
    return UI_TEXT.CHANGE_PASSWORD.CONFIRM_NOT_MATCH;
  }

  return "";
}
