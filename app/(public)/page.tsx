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
import SubVillage from "./components/SubVillage";
import ScrollReveal from "./components/ScrollReveal"; // <-- Import GSAP Wrapper

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
            {/* 1. Hero Entrance */}
            <HeroBanner lang={lang} t={t} />

            {/* 2. Cards (Slightly overlapping Hero) */}
            <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6">
                <ScrollReveal direction="up" delay={0.2}>
                    <DevotionCards lang={lang} t={t} />
                </ScrollReveal>
            </div>

            {/* 3. About Section */}
            <div className="mt-20 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6">
                <ScrollReveal direction="up">
                    <AboutSection />
                </ScrollReveal>
            </div>

            {/* 4. Gallery Layout */}
            <div className="mt-20 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6">
                <ScrollReveal direction="left">
                    {/* Pass down lang and t metrics cleanly here */}
                    <GallerySection lang={lang} t={t} />
                </ScrollReveal>
            </div>

            {/* 5. Testimonial Carousel */}
            <div className="mt-20 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6">
                <ScrollReveal direction="right">
                    <TestimonialSection />
                </ScrollReveal>
            </div>

            {/* 6. Sub-Villages Hub (Interactive Component) */}
            <div className="mt-20 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6">
                <ScrollReveal direction="up">
                    <SubVillage t={t} />
                </ScrollReveal>
            </div>

            {/* 7. Timings Structure */}
            <div className="mt-20 md:mt-32">
                <ScrollReveal direction="up">
                    <LiturgicalTimings lang={lang} t={t} />
                </ScrollReveal>
            </div>

            {/* 8. Quick Actions Utility Grid */}
            <div className="mt-20">
                <ScrollReveal direction="up">
                    <QuickActions t={t} lang={lang} />
                </ScrollReveal>
            </div>

            {/* 9. YouTube Video Frame Embeds */}
            <ScrollReveal direction="up">
                <YoutubeVideos />
            </ScrollReveal>
        </div>
    );
}