"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  // ✅ تحميل اللغة من localStorage أول ما الموقع يفتح
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang;
    if (savedLang) {
      applyLang(savedLang);
      setLangState(savedLang);
    } else {
      applyLang("ar");
    }
  }, []);

  const applyLang = (l: Lang) => {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    applyLang(l);
    localStorage.setItem("lang", l); // ✅ حفظ اللغة
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        isRTL: lang === "ar",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);