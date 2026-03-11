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

export const getElapsedTime = (createdAt: string): string => {
  const createdTime = new Date(createdAt).getTime();
  const currentTime = Date.now();

  // Tính khoảng cách thời gian bằng giây
  const diffInSeconds = Math.floor((currentTime - createdTime) / 1000);

  if (diffInSeconds < 0) return "0s"; // Xử lý nếu thời gian client chạy trước server

  // Dưới 1 phút: trả về giây (VD: "10s")
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  // Dưới 1 giờ: trả về phút (VD: "36m")
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  }

  // Từ 1 giờ trở lên: trả về giờ + phút (VD: "1h32m", "2h45m")
  const hours = Math.floor(diffInSeconds / 3600);
  const remainingMinutes = Math.floor((diffInSeconds % 3600) / 60);

  // Nếu số phút lẻ > 0 thì ghép vào, nếu không thì chỉ hiện giờ (VD: "2h0m" -> "2h")
  return remainingMinutes > 0 ? `${hours}h${remainingMinutes}m` : `${hours}h`;
};

export function toFormData(obj: Record<string, unknown>): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  return formData;
}
