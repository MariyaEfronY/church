"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Tv, ArrowRight, CalendarDays, ArrowUpRight } from "lucide-react";

export default function YoutubeVideos() {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<"en" | "ta">("en");

    useEffect(() => {
        // 1. Sync layout configuration state variables instantly with custom events
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };
        window.addEventListener("church-lang-change" as any, handleLangChange);

        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        if (savedLang) setLang(savedLang);

        // 2. Fetch recent streams and slice for feed bounds limit
        fetch("/api/youtube")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setVideos(data.slice(0, 3)); // Perfectly balanced row of 3 items for home screen clarity
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Home feed fetch failure:", err);
                setLoading(false);
            });

        return () => window.removeEventListener("church-lang-change" as any, handleLangChange);
    }, []);

    return (
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 antialiased text-stone-900">
            {/* 🌟 Row Header Section Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 border-b border-stone-200/60 pb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-700 border border-indigo-500/20">
                        <Tv className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
                            {lang === "en" ? "Latest Broadcasts" : "சமீபத்திய ஒளிபரப்புகள்"}
                        </h2>
                        <p className="text-xs text-stone-500 italic mt-0.5 font-serif">
                            {lang === "en" ? "Join our services online" : "எங்கள் ஆன்மீக நிகழ்வுகளில் ஆன்லைனில் இணையுங்கள்"}
                        </p>
                    </div>
                </div>

                <Link
                    href="/videos"
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-700 hover:text-indigo-900 transition-colors group self-end sm:self-auto"
                >
                    <span>{lang === "en" ? "View All Videos" : "அனைத்தையும் பார்க்க"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* 📱 Fluid Interactive Video Grid Matrix */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-xs animate-pulse min-h-[300px]" />
                    ))}
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-10 bg-stone-50 border border-stone-200 rounded-2xl">
                    <p className="text-stone-400 italic text-sm">
                        {lang === "en" ? "No recent media available." : "சமீபத்திய பதிவுகள் எதுவும் இல்லை."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {videos.map((video, index) => {
                        // Support both playlist items format & standard search results format safely
                        const videoId = video?.snippet?.resourceId?.videoId || video?.id?.videoId;
                        if (!videoId) return null;

                        return (
                            <Link
                                key={`${videoId}-${index}`}
                                href={`/videos/${videoId}`}
                                className="group"
                            >
                                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-500/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer">

                                    {/* Thumbnail Cover Wrapper */}
                                    <div className="relative aspect-video w-full bg-stone-200 border-b border-stone-200 overflow-hidden">
                                        <img
                                            src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                                            alt={video.snippet.title}
                                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute right-3 bottom-3 w-8 h-8 rounded-lg bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-white opacity-90 border border-white/10 shadow-xs">
                                            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Card Metadata/Text Content Block */}
                                    <div className="p-4 flex flex-col justify-between flex-grow gap-3">
                                        <h3 className="font-serif font-bold text-stone-800 text-base leading-snug tracking-wide line-clamp-2 group-hover:text-indigo-700 transition-colors">
                                            {video.snippet.title}
                                        </h3>

                                        <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-stone-400 mt-auto">
                                            <CalendarDays className="w-3.5 h-3.5" />
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
        </section>
    );
}