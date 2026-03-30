"use client";

import { useEffect } from "react";

import { useLanguageStore } from "@/store/useLanguageStore";

/**
 * Rehydrates the language store from localStorage after client mount.
 *
 * The store always initialises with "vi" (matching the server),
 * so there is no SSR/hydration mismatch. This component then
 * syncs the real stored locale on the client side — causing a
 * single, intentional re-render if the user had selected "en".
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const rehydrate = useLanguageStore((s) => s.rehydrate);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  return <>{children}</>;
}
