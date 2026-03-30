import { enTexts } from "./en";
import { viTexts } from "./vi";

export type Locale = "vi" | "en";
export type UITextMap = typeof viTexts;

export const LOCALE_MAP: Record<Locale, UITextMap> = {
  vi: viTexts,
  en: enTexts,
};
