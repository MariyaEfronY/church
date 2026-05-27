"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Church, LogIn } from "lucide-react";

interface NavProps {
    parishName: string;
    adminText: string; // Added to fix the 'Property adminText does not exist' compilation crash
}

export default function Navigation({ parishName, adminText }: NavProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Triggers the geometric shrink after scrolling past 20px
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="sticky top-0 z-50 w-full transition-all duration-500 ease-out pointer-events-none">
            {/* Structural alignment padding box container */}
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-500 ease-in-out ${isScrolled ? "pt-2 max-w-5xl" : "pt-4"
                }`}>
                <nav className={`pointer-events-auto border transition-all duration-500 ease-in-out ${isScrolled
                    ? "bg-white/80 backdrop-blur-xl border-stone-200/60 shadow-[0_12px_40px_rgba(0,0,0,0.06)] rounded-xl px-4 py-2 scale-[0.97]"
                    : "bg-white/40 backdrop-blur-md border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-2xl px-5 py-4 scale-100"
                    }`}>
                    <div className="flex justify-between items-center gap-4">

                        {/* 🏛️ Left: Branding Section */}
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 group select-none min-w-0"
                        >
                            <div className={`rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-all duration-500 flex-shrink-0 ${isScrolled ? "w-8 h-8" : "w-9 h-9"
                                }`}>
                                <Church className={`text-amber-600 transition-transform duration-500 group-hover:scale-105 ${isScrolled ? "w-4 h-4" : "w-5 h-5"
                                    }`} />
                            </div>
                            <span className={`font-serif font-black text-stone-900 tracking-wide truncate group-hover:text-stone-700 transition-all duration-500 ${isScrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                                }`}>
                                {parishName}
                            </span>
                        </Link>

                        {/* ⚡ Right: Login Interactive CTA Unit */}
                        <div className="flex items-center flex-shrink-0">
                            <Link
                                href="/auth"
                                className="relative inline-flex items-center gap-2 overflow-hidden bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-bold font-sans tracking-wide transition-all duration-300 border border-stone-950/20 active:scale-95 group shadow-xs hover:shadow-[0_4px_20px_rgba(217,119,6,0.15)]"
                            >
                                {/* Moving Amber Ambient Light Glare Effect on Hover */}
                                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shine pointer-events-none" />

                                <LogIn className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform duration-300" />

                                {/* Dynamically displays the value provided by your parent layout translation locales */}
                                <span>{adminText || "Login"}</span>
                            </Link>
                        </div>

                    </div>
                </nav>
            </div>
        </div>
    );
}