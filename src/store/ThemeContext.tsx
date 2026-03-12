"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { ThemeMode } from "@/types/enums";

type ThemeContextType = {
  theme: string;
  selectTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || ThemeMode.LIGHT;
    }
    return ThemeMode.LIGHT;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === ThemeMode.DARK);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const selectTheme = (theme: ThemeMode) => {
    setTheme(theme);
  };

  return <ThemeContext.Provider value={{ theme, selectTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
