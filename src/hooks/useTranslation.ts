import type { UITextMap } from "@/constants/ui_text/locales";
import { LOCALE_MAP } from "@/constants/ui_text/locales";
import { useLanguageStore } from "@/store/useLanguageStore";

/**
 * React hook that returns the current locale's UI text map.
 *
 * Use this in components that need **reactive** language switching
 * (re-render when the language changes without a page reload).
 *
 * @example
 * ```tsx
 * const t = useTranslation();
 * return <p>{t.COMMON.LOADING}</p>;
 * ```
 */
export function useTranslation(): UITextMap {
  const locale = useLanguageStore((s) => s.locale);
  return LOCALE_MAP[locale];
}
