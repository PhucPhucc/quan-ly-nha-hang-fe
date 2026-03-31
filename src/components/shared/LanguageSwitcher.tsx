"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Locale } from "@/store/useLanguageStore";
import { useLanguageStore } from "@/store/useLanguageStore";

const LANGUAGE_OPTIONS: { value: Locale; label: string; flag: string; css: string }[] = [
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳", css: "mb-2" },
  { value: "en", label: "English", flag: "🇬🇧", css: "" },
];

type LanguageSwitcherProps = {
  value?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  reloadOnChange?: boolean;
  align?: "start" | "center" | "end";
  buttonClassName?: string;
  contentClassName?: string;
};

export function LanguageSwitcher({
  value,
  onLocaleChange,
  reloadOnChange = true,
  align = "end",
  buttonClassName,
  contentClassName,
}: LanguageSwitcherProps) {
  const locale = useLanguageStore((state) => value ?? state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  const currentLang = LANGUAGE_OPTIONS.find((l) => l.value === locale);

  const handleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
    onLocaleChange?.(newLocale);
    if (reloadOnChange) {
      window.location.reload();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-2", buttonClassName)}>
          <span className="hidden sm:inline">
            {currentLang?.flag} {currentLang?.label}
          </span>
          <span className="sm:hidden">{currentLang?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentClassName}>
        {LANGUAGE_OPTIONS.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => handleChange(lang.value)}
            className={cn(lang.css, locale === lang.value ? "bg-accent" : "")}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
