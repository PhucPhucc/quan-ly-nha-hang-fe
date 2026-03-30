import { enTexts } from "./en";
import { viTexts } from "./vi";

export type Locale = "vi" | "en";

export const LOCALE_MAP = {
  vi: viTexts,
  en: enTexts,
} as const;

export type UITextMap = typeof viTexts;
