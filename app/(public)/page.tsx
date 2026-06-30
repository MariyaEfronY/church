"use client";

import { useState, useEffect } from "react";
import HeroBanner from "./components/HeroBanner";
import DevotionCards from "./components/DevotionCards";
import LiturgicalTimings from "./components/LiturgicalTimings";
import QuickActions from "./components/QuickActions";
import YoutubeVideos from "./components/YoutubeVideos";
import AboutSection from "./components/AboutSection";
import GallerySection from "./components/GallerySection";
import TestimonialSection from "./components/TestimonialSection";
import SubVillage from "./components/SubVillage"

import en from "../locales/en.json";
import ta from "../locales/ta.json";

export default function PublicHomePage() {
    const [lang, setLang] = useState<"en" | "ta">("en");

    useEffect(() => {
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };

        window.addEventListener("church-lang-change" as any, handleLangChange);

        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        if (savedLang) setLang(savedLang);

        return () => {
            window.removeEventListener("church-lang-change" as any, handleLangChange);
        };
    }, []);

    const t = lang === "en" ? en : ta;

    return (
        <div className="pb-24 bg-stone-100 text-stone-900 min-h-screen font-sans antialiased selection:bg-amber-600/20 selection:text-amber-900">
            {/* 1. Alabaster White Header */}
            <HeroBanner lang={lang} t={t} />


            {/* 2. Overlapping Radiant Color Blocks */}
            <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6">
                <DevotionCards lang={lang} t={t} />
            </div>

            {/* UPGRADE: Styled Wrapper for About Section with perfect spacing & width constraints */}
            <div className="mt-20 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6">
                <AboutSection />
            </div>

            {/* Optional Wrappers for Gallery and Testimonials if they need alignment too */}
            <div className="mt-20 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6">
                <GallerySection />
            </div>

            <div className="mt-20 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6">
                <TestimonialSection />
            </div>

            <div className="mt-20 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6">
                <SubVillage t={t} />
            </div>


            {/* 3. Minimal Timings Grid */}
            <div className="mt-20 md:mt-32">
                <LiturgicalTimings lang={lang} t={t} />
            </div>

            {/* 4. Elegant Dynamic Utility Grid */}
            <div className="mt-20">
                <QuickActions t={t} lang={lang} />
            </div>

            <YoutubeVideos />
        </div>
    );
}