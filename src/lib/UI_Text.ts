import type { UITextMap } from "@/constants/ui_text/locales";
import { LOCALE_MAP } from "@/constants/ui_text/locales";
import { useLanguageStore } from "@/store/useLanguageStore";

/**
 * Get the current locale's UI text map.
 * Works in both React and non-React contexts.
 */
export function getUIText(): UITextMap {
  const locale = useLanguageStore.getState().locale;
  return LOCALE_MAP[locale];
}

/**
 * UI_TEXT — backward-compatible, locale-aware proxy.
 *
 * Every property access (e.g. `UI_TEXT.COMMON.LOADING`) is resolved
 * at read-time from the active locale in `useLanguageStore`.
 *
 * React components can keep using `UI_TEXT.X.Y` without any changes.
 * When the app re-renders after a locale switch (page reload),
 * all text automatically reflects the new language.
 */
export const UI_TEXT: UITextMap = new Proxy({} as UITextMap, {
  get(_target, prop: string) {
    const texts = getUIText();
    return texts[prop as keyof UITextMap];
  },
});
