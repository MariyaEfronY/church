"use client";

import { useState, useEffect } from "react";
import { Languages } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import en from "../locales/en.json";
import ta from "../locales/ta.json";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [lang, setLang] = useState<"en" | "ta">("en");

    // Load saved preference on mount
    useEffect(() => {
        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedLang) setLang(savedLang);
    }, []);

    const toggleLanguage = () => {
        const nextLang = lang === "en" ? "ta" : "en";
        setLang(nextLang);
        localStorage.setItem("church-lang", nextLang);

        // Broadcast language change to the active pages inside this group layout
        const event = new CustomEvent("church-lang-change", { detail: nextLang });
        window.dispatchEvent(event);
    };

    const t = lang === "en" ? en : ta;

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Dynamic Floating Language Switch Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-full shadow-2xl hover:bg-amber-600 hover:text-slate-950 transition-all font-medium text-sm border border-slate-800"
                >
                    <Languages className="w-4 h-4" />
                    <span>{lang === "en" ? "தமிழ்" : "English"}</span>
                </button>
            </div>

            <div>
                <Navigation parishName={t.parishName} adminText={t.navAdmin} />
                <main>{children}</main>
            </div>

            <Footer parishName={t.parishName} />
        </div>
    );
}