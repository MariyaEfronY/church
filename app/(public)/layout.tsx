"use client";

import { useState } from "react";
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
    const t = lang === "en" ? en : ta;

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Dynamic Floating Language Selector Switch */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setLang(lang === "en" ? "ta" : "en")}
                    className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-full shadow-2xl hover:bg-amber-600 hover:text-slate-950 transition-all font-medium text-sm border border-slate-800"
                >
                    <Languages className="w-4 h-4" />
                    <span>{lang === "en" ? "தமிழ்" : "English"}</span>
                </button>
            </div>

            <div>
                <Navigation parishName={t.parishName} adminText={t.navAdmin} />
                {/* Pass down selected dictionary language features safely */}
                <main>{children}</main>
            </div>

            <Footer parishName={t.parishName} />
        </div>
    );
}