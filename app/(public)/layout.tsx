"use client";

import { LangProvider, useLang } from "@/context/LangContext";
import { Languages } from "lucide-react";
import { Noto_Sans_Tamil, Inter } from "next/font/google"; // <-- Add a native Latin font
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// Configure Latin Sub-Family
const interFont = Inter({
    subsets: ["latin"],
    variable: "--font-inter", // Creates a clean configuration token
});

// Configure Tamil Sub-Family
const tamilFont = Noto_Sans_Tamil({
    subsets: ["tamil"],
    weight: ["400", "500", "700"],
    variable: "--font-noto-tamil", // Creates a clean configuration token
});

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { lang, t, toggleLanguage } = useLang();

    return (
        /* CHANGED: Added dynamic font variables, and importantly, 'w-full max-w-full overflow-x-hidden' to isolate bleeders */
        <div
            className={`${interFont.variable} ${tamilFont.variable} font-sans min-h-screen w-full max-w-full overflow-x-hidden flex flex-col justify-between bg-white`}
        >

            {/* Floating Language Switch Button */}
            {/* CHANGED: Adjusted bottom/right spacing to stay inside safe screen real estate on smaller viewports */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 bg-slate-950 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl hover:bg-amber-600 hover:text-slate-950 transition-all font-medium text-xs sm:text-sm border border-slate-800 cursor-pointer active:scale-95"
                >
                    <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{lang === "en" ? "தமிழ்" : "English"}</span>
                </button>
            </div>

            {/* CHANGED: Wrapped in an isolated container block to prevent children from swelling standard dimensions */}
            <div className="w-full max-w-full overflow-x-hidden">
                <Navigation parishName={t.parishName} adminText={t.navAdmin} />
                <main className="w-full max-w-full">{children}</main>
            </div>

            <Footer parishName={t.parishName} />
        </div>
    );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <LangProvider>
            <LayoutContent>{children}</LayoutContent>
        </LangProvider>
    );
}