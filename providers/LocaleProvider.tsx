"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale } from "@/lib/i18n";

const LocaleContext = createContext<string>(defaultLocale);
export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({ locale, children }: { locale: string; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
