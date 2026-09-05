"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "EN" | "CN";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, cn: string) => string;
}>({ lang: "EN", setLang: () => {}, t: (en) => en });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("EN");

  useEffect(() => {
    const saved = localStorage.getItem("stryde-lang");
    if (saved === "EN" || saved === "CN") setLangState(saved as Lang);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("stryde-lang", l);
    window.dispatchEvent(new Event("stryde-lang-change"));
  }

  function t(en: string, cn: string) {
    return lang === "CN" ? cn : en;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
