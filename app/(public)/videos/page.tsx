"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Tv, CalendarDays, ArrowUpRight, Search, Play, Radio, Flame, Sparkles, Filter } from "lucide-react";

export default function VideosPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<"en" | "ta">("en");

    // UX Features: Search and Categories Matrix Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };
        window.addEventListener("church-lang-change" as any, handleLangChange);

        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        if (savedLang) setLang(savedLang);

        fetch("/api/youtube")
            .then((res) => res.json())
            .then((data) => {
                setVideos(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error reading internal youtube route:", err);
                setLoading(false);
            });

        return () => window.removeEventListener("church-lang-change" as any, handleLangChange);
    }, []);

    const filteredVideos = useMemo(() => {
        return videos.filter((video) => {
            const title = (video?.snippet?.title || "").toLowerCase();
            const matchesSearch = title.includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;
            if (activeTab === "all") return true;

            if (activeTab === "mass") return title.includes("mass") || title.includes("திருப்பலி");
            if (activeTab === "feast") return title.includes("feast") || title.includes("திருவிழா") || title.includes("perunnal");

            return true;
        });
    }, [videos, searchQuery, activeTab]);

    return (
        /* White themed background with high-fidelity padding offsets to safely stack below navigation bar components */
        <section className="min-h-screen bg-stone-50 text-stone-900 pt-28 pb-20 sm:pt-36 sm:pb-28 antialiased relative z-10">

            {/* 🛡️ THE ABSOLUTE MASKING LAYER: 
                This forces a solid stone-50 color plate directly underneath the top navbar viewport range. 
                Even if the layout root body tag has a dark bg background, this layer completely covers it up!
            */}
            <div className="absolute top-0 inset-x-0 h-40 bg-stone-50 pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- 1. Dynamic Translation Header --- */}
                <div className="flex flex-col items-center text-center mb-12 gap-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider font-sans">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        {lang === "en" ? "Broadcast Stream" : "ஒளிபரப்பு தளம்"}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
                        {lang === "en" ? "Media Ministry" : "ஊடக அமைச்சகம்"}
                    </h1>

                    <p className="text-sm sm:text-base text-stone-600 font-sans max-w-xl leading-relaxed">
                        {lang === "en"
                            ? "Watch our latest holy masses, feast celebrations, and spiritual reflections online."
                            : "எங்கள் சமீபத்திய திருப்பலிகள், திருவிழா கொண்டாட்டங்கள் மற்றும் ஆன்மீக சிந்தனைகளை ஆன்லைனில் பாருங்கள்."}
                    </p>
                </div>

                {/* --- 2. Live Controls Deck (Search + Filter Pills Matrix) --- */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 shadow-xs mb-10 max-w-5xl mx-auto space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                        {/* Search input field text interaction track */}
                        <div className="relative w-full md:max-w-xs">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={lang === "en" ? "Search media files..." : "தேடுக..."}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>

                        {/* Category filter controls bar */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none snap-x">
                            {[
                                { id: "all", labelEn: "All Media", labelTa: "அனைத்தும்", icon: Tv },
                                { id: "mass", labelEn: "Holy Mass", labelTa: "திருப்பலி", icon: Radio },
                                { id: "feast", labelEn: "Feasts", labelTa: "திருவிழாக்கள்", icon: Flame },
                            ].map((tab) => {
                                const TabIcon = tab.icon;
                                const isSelected = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-sans tracking-wide transition-all snap-start whitespace-nowrap active:scale-[0.97] ${isSelected
                                            ? "bg-stone-900 text-white shadow-md shadow-stone-900/10"
                                            : "bg-stone-100 text-stone-600 hover:bg-stone-200/70"
                                            }`}
                                    >
                                        <TabIcon className="w-3.5 h-3.5" />
                                        {lang === "en" ? tab.labelEn : tab.labelTa}
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                </div>

                {/* --- 3. Dynamic Card Grid Layout Execution --- */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs animate-pulse min-h-[340px]" />
                        ))}
                    </div>
                ) : filteredVideos.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 max-w-5xl mx-auto p-8 shadow-xs">
                        <Filter className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                        <p className="text-stone-500 font-medium text-sm">
                            {lang === "en"
                                ? "No matching live records or streams found."
                                : "தற்போது புதிய வீடியோக்கள் எதுவும் கிடைக்கவில்லை."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                        {filteredVideos.map((video, index) => {
                            const videoId = video?.snippet?.resourceId?.videoId || video?.id?.videoId;
                            if (!videoId) return null;

                            return (
                                <Link
                                    key={`${videoId}-${index}`}
                                    href={`/videos/${videoId}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:border-amber-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer">

                                        <div className="relative aspect-video w-full overflow-hidden bg-stone-100 border-b border-stone-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                                                alt={video.snippet.title}
                                                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                draggable="false"
                                            />

                                            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                    <Play className="w-5 h-5 fill-current text-stone-900 ml-0.5" />
                                                </div>
                                            </div>

                                            <div className="absolute right-3 bottom-3 w-7 h-7 rounded-lg bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-white opacity-90 border border-white/10 shadow-sm">
                                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                                            <h3 className="font-serif font-bold text-stone-800 text-base leading-snug tracking-wide line-clamp-2 group-hover:text-amber-800 transition-colors">
                                                {video.snippet.title}
                                            </h3>

                                            <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-stone-400 tracking-wide mt-auto border-t border-stone-100 pt-3">
                                                <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
                                                <span>
                                                    {new Date(video.snippet.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "ta-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

            </div>
        </section>
    );
}