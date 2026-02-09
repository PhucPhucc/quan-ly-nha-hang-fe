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

  if (newPassword.length < 8) {
    return UI_TEXT.CHANGE_PASSWORD.MIN_LENGTH;
  }

  if (!/[A-Z]/.test(newPassword)) {
    return UI_TEXT.CHANGE_PASSWORD.UPPERCASE_REQUIRED;
  }

  if (!/[a-z]/.test(newPassword)) {
    return UI_TEXT.CHANGE_PASSWORD.LOWERCASE_REQUIRED;
  }

  if (!/[0-9]/.test(newPassword)) {
    return UI_TEXT.CHANGE_PASSWORD.NUMBER_REQUIRED;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    return UI_TEXT.CHANGE_PASSWORD.SPECIAL_CHAR_REQUIRED;
  }

  if (newPassword !== confirmPassword) {
    return UI_TEXT.CHANGE_PASSWORD.CONFIRM_NOT_MATCH;
  }

  return "";
}
