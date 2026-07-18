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
import ScrollReveal from "./components/ScrollReveal";
import AnnouncementSection from "./components/AnnouncementSection";

import en from "../locales/en.json";
import ta from "../locales/ta.json";

export default function PublicHomePage() {
    const [lang, setLang] = useState<"en" | "ta">("en");

    useEffect(() => {
        // --- CLIENT ENVIRONMENT PROTECTION LOCKS ---

        // 1. Prevent Right-Click Context Menus
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();

        // 2. Block Common Inspection/Developer Keyboard Shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
            }
        };

        // Apply visual & interaction blocks
        document.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("keydown", handleKeyDown);

        // --- LANGUAGE MANAGER ---
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };

        window.addEventListener("church-lang-change" as any, handleLangChange);
        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        if (savedLang) setLang(savedLang);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("church-lang-change" as any, handleLangChange);
        };
    }, []);

    const t = lang === "en" ? en : ta;

    return (
        /* 
          Enforced UI Protections via Tailwind:
          - select-none: Stops users from highlighting text to copy content easily.
          - pointer-events-none on images (applied custom logic if needed) to stop dragging assets.
        */
        <main className="min-h-screen w-full bg-stone-100 text-stone-900 font-sans antialiased selection:bg-amber-600/20 selection:text-amber-900 pb-24 overflow-x-hidden select-none">

            {/* ================= HERO ================= */}
            <section id="home" className="w-full">
                <HeroBanner lang={lang} t={t} />
            </section>

            {/* ================= DEVOTIONS ================= */}
            <section id="devotions" className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full">
                <ScrollReveal direction="up" delay={0.2}>
                    <DevotionCards lang={lang} t={t} />
                </ScrollReveal>
            </section>

            {/* ================= ABOUT ================= */}
            <section id="AboutSection" className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full">
                <ScrollReveal direction="up">
                    <AboutSection />
                </ScrollReveal>
            </section>

            {/* ================= GALLERY ================= */}
            <section id="GallerySection" className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full overflow-hidden">
                <ScrollReveal direction="left">
                    <GallerySection lang={lang} t={t} />
                </ScrollReveal>
            </section>

            {/* ================= TESTIMONIAL ================= */}
            <section id="testimonials" className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full overflow-hidden">
                <ScrollReveal direction="right">
                    <TestimonialSection />
                </ScrollReveal>
            </section>

            {/* ================= ANNOUNCEMENTS ================= */}
            <section id="announcements" className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full overflow-hidden">
                <ScrollReveal direction="left">
                    <AnnouncementSection />
                </ScrollReveal>
            </section>

            {/* ================= SUB VILLAGES ================= */}
            <section id="villages" className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full">
                <ScrollReveal direction="up">
                    <SubVillage t={t} />
                </ScrollReveal>
            </section>

            {/* ================= MASS TIMINGS ================= */}
            <section id="timings" className="mt-16 md:mt-32 px-4 sm:px-0 scroll-mt-28 w-full">
                <ScrollReveal direction="up">
                    <LiturgicalTimings lang={lang} t={t} />
                </ScrollReveal>
            </section>

            {/* ================= QUICK ACTIONS ================= */}
            <section id="quickActions" className="mt-16 scroll-mt-28 w-full">
                <ScrollReveal direction="up">
                    <QuickActions lang={lang} t={t} />
                </ScrollReveal>
            </section>

            {/* ================= YOUTUBE ================= */}
            <section id="youtubeVideos" className="w-full scroll-mt-28 px-4 sm:px-0 mt-16">
                <ScrollReveal direction="up">
                    <YoutubeVideos />
                </ScrollReveal>
            </section>

        </main>
    );
}