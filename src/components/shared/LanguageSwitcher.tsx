"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/store/useLanguageStore";
import { useLanguageStore } from "@/store/useLanguageStore";

const LANGUAGE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageStore();

  const currentLang = LANGUAGE_OPTIONS.find((l) => l.value === locale);

  const handleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
    // Reload to ensure all UI_TEXT references update
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="px-1">
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="hidden sm:inline">
            {currentLang?.flag} {currentLang?.label}
          </span>
          <span className="sm:hidden">{currentLang?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_OPTIONS.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => handleChange(lang.value)}
            className={locale === lang.value ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
