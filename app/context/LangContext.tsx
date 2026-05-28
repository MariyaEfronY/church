"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import ta from "@/locales/ta.json";

type LangType = "en" | "ta";

interface LangContextProps {
    lang: LangType;
    t: any;
    toggleLanguage: () => void;
}

const LangContext = createContext<LangContextProps | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<LangType>("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("church-lang") as LangType;
        if (savedLang) setLang(savedLang);
    }, []);

    const toggleLanguage = () => {
        const nextLang = lang === "en" ? "ta" : "en";
        setLang(nextLang);
        localStorage.setItem("church-lang", nextLang);

        // Keep your custom window events broadcasting cleanly
        window.dispatchEvent(new CustomEvent("church-lang-change", { detail: nextLang }));
    };

    const t = lang === "en" ? en : ta;

    return (
        <LangContext.Provider value={{ lang, t, toggleLanguage }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const context = useContext(LangContext);
    if (!context) throw new Error("useLang must be executed inside a LangProvider container block");
    return context;
}