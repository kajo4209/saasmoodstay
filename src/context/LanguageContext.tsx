"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Lang } from "@/lib/translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  isRTL: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
