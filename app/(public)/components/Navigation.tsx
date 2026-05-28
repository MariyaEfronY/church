"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Church, LogIn } from "lucide-react";

interface NavProps {
    parishName: string;
    adminText: string;
}

export default function Navigation({ parishName, adminText }: NavProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 15) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="sticky top-0 z-50 w-full transition-all duration-300 ease-out pointer-events-none">
            {/* Structural alignment padding box container */}
            <div className={`mx-auto px-4 sm:px-6 transition-all duration-300 ease-in-out ${isScrolled ? "pt-2 max-w-5xl" : "pt-4 max-w-6xl"
                }`}>
                <nav className={`pointer-events-auto border transition-all duration-300 ease-in-out ${isScrolled
                    ? "bg-white/80 backdrop-blur-xl border-stone-200/60 shadow-[0_12px_30px_rgba(0,0,0,0.04)] rounded-xl px-4 py-2"
                    : "bg-white/50 backdrop-blur-md border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl px-5 py-3.5"
                    }`}>
                    <div className="flex justify-between items-center gap-3 sm:gap-4">

                        {/* 🏛️ Left: Branding Section */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 group select-none min-w-0 flex-1 sm:flex-initial"
                        >
                            <div className={`rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-all duration-300 flex-shrink-0 ${isScrolled ? "w-8 h-8" : "w-9 h-9"
                                }`}>
                                <Church className={`text-amber-700 transition-transform duration-300 group-hover:scale-105 ${isScrolled ? "w-4 h-4" : "w-5 h-5"
                                    }`} />
                            </div>

                            {/* Fixed text constraints to prevent jitter and maximize space for the Parish Name */}
                            <span className={`font-serif font-black text-stone-900 tracking-wide line-clamp-1 group-hover:text-stone-700 transition-all duration-300 ${isScrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                                }`}>
                                {parishName}
                            </span>
                        </Link>

                        {/* ⚡ Right: Login Interactive CTA Unit */}
                        <div className="flex items-center flex-shrink-0">
                            <Link
                                href="/auth/login-site"
                                className={`relative inline-flex items-center gap-1.5 overflow-hidden bg-[#4a0e17] hover:bg-[#3a0a10] text-white rounded-xl font-bold font-sans tracking-wide transition-all duration-300 border border-transparent active:scale-95 group shadow-xs ${isScrolled
                                    ? "px-2.5 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-xs"
                                    : "px-3 py-2 text-[11px] sm:px-4 sm:py-2 sm:text-xs"
                                    }`}
                            >
                                {/* Moving Amber Ambient Light Glare Effect on Hover */}
                                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shine pointer-events-none" />

                                <LogIn className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform duration-300 flex-shrink-0" />

                                {/* Dynamically displays translation strings */}
                                <span className="truncate max-w-[70px] sm:max-w-none">
                                    {adminText || "Login"}
                                </span>
                            </Link>
                        </div>

                    </div>
                </nav>
            </div>
        </div>
    );
}