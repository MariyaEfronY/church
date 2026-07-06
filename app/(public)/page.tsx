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
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };

        window.addEventListener(
            "church-lang-change" as any,
            handleLangChange
        );

        const savedLang = localStorage.getItem("church-lang") as | "en" | "ta";
        if (savedLang) setLang(savedLang);

        return () => {
            window.removeEventListener(
                "church-lang-change" as any,
                handleLangChange
            );
        };
    }, []);

    const t = lang === "en" ? en : ta;

    return (
        /* Enforced w-full and overflow-x-hidden globally to stop horizontal layout bleeding on mobile devices */
        <main className="min-h-screen w-full bg-stone-100 text-stone-900 font-sans antialiased selection:bg-amber-600/20 selection:text-amber-900 pb-24 overflow-x-hidden">

            {/* ================= HERO ================= */}
            <section id="home" className="w-full">
                <HeroBanner lang={lang} t={t} />
            </section>

            {/* ================= DEVOTIONS ================= */}
            {/* Added relative adjustments and clear horizontal padding controls */}
            <section
                id="devotions"
                className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full"
            >
                <ScrollReveal direction="up" delay={0.2}>
                    <DevotionCards lang={lang} t={t} />
                </ScrollReveal>
            </section>

            {/* ================= ABOUT ================= */}
            <section
                id="AboutSection"
                className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full"
            >
                <ScrollReveal direction="up">
                    <AboutSection />
                </ScrollReveal>
            </section>

            {/* ================= GALLERY ================= */}
            {/* Critical: Left/Right sliding animations bleed outward. Added isolation wrappers. */}
            <section
                id="GallerySection"
                className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full overflow-hidden"
            >
                <ScrollReveal direction="left">
                    <GallerySection lang={lang} t={t} />
                </ScrollReveal>
            </section>

            {/* ================= TESTIMONIAL ================= */}
            <section
                id="testimonials"
                className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full overflow-hidden"
            >
                <ScrollReveal direction="right">
                    <TestimonialSection />
                </ScrollReveal>
            </section>

            {/* ================= Announcements ================= */}
            {/* Critical: Left/Right sliding animations bleed outward. Added isolation wrappers. */}
            <section
                id="announcements"
                className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full overflow-hidden"
            >
                <ScrollReveal direction="left">
                    <AnnouncementSection />
                </ScrollReveal>
            </section>


            {/* ================= SUB VILLAGES ================= */}
            <section
                id="villages"
                className="mt-16 md:mt-32 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28 w-full"
            >
                <ScrollReveal direction="up">
                    <SubVillage t={t} />
                </ScrollReveal>
            </section>

            {/* ================= MASS TIMINGS ================= */}
            <section
                id="timings"
                className="mt-16 md:mt-32 px-4 sm:px-0 scroll-mt-28 w-full"
            >
                <ScrollReveal direction="up">
                    <LiturgicalTimings lang={lang} t={t} />
                </ScrollReveal>
            </section>

            {/* ================= QUICK ACTIONS ================= */}
            <section
                id="quickActions"
                className="mt-16 scroll-mt-28 w-full"
            >
                <ScrollReveal direction="up">
                    <QuickActions lang={lang} t={t} />
                </ScrollReveal>
            </section>

            {/* ================= YOUTUBE ================= */}
            <section
                id="youtubeVideos"
                className="w-full scroll-mt-28 px-4 sm:px-0 mt-16"
            >
                <ScrollReveal direction="up">
                    <YoutubeVideos />
                </ScrollReveal>
            </section>

        </main>
    );
}