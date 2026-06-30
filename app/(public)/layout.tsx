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
        /* Combine both CSS variables here, along with your default tailwind classes */
        <div className={`${interFont.variable} ${tamilFont.variable} font-sans min-h-screen flex flex-col justify-between bg-[#0f0a0a]`}>

            {/* Floating Language Switch Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-full shadow-2xl hover:bg-amber-600 hover:text-slate-950 transition-all font-medium text-sm border border-slate-800 cursor-pointer active:scale-95"
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

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <LangProvider>
            <LayoutContent>{children}</LayoutContent>
        </LangProvider>
    );
}