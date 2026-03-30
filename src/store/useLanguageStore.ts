import { create } from "zustand";

export type Locale = "vi" | "en";

const STORAGE_KEY = "foodhub-locale";

type LanguageState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Gọi sau khi client mount để đồng bộ từ localStorage */
  rehydrate: () => void;
};

export const useLanguageStore = create<LanguageState>()((set) => ({
  // Luôn khởi tạo bằng "vi" — giống server, tránh hydration mismatch
  locale: "vi",
  setLocale: (locale: Locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, locale);
    }
    set({ locale });
  },
  rehydrate: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "vi" || stored === "en") {
      set({ locale: stored });
    }
  },
}));
