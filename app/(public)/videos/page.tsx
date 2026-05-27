"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Tv, CalendarDays, ArrowUpRight } from "lucide-react";

export default function VideosPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<"en" | "ta">("en");

    useEffect(() => {
        // 1. Sync global template language listener matrix
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };
        window.addEventListener("church-lang-change" as any, handleLangChange);

        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        if (savedLang) setLang(savedLang);

        // 2. Fetch all uploads from internal dynamic channel endpoint
        fetch("/api/youtube")
            .then((res) => res.json())
            .then((data) => {
                setVideos(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error reading internal youtube route:", err);
                setLoading(false);
            });

        return () => window.removeEventListener("church-lang-change" as any, handleLangChange);
    }, []);

    return (
        <section className="py-16 sm:py-24 bg-stone-100 text-stone-900 min-h-screen antialiased">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Section Dynamic Translation Header */}
                <div className="flex flex-col items-center text-center mb-12 sm:mb-16 gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-700 border border-indigo-500/20">
                        <Tv className="w-5 h-5" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
                        {lang === "en" ? "Media Ministry" : "ஊடக அமைச்சகம்"}
                    </h1>
                    <div className="w-12 h-0.5 bg-indigo-600/50 rounded-full my-0.5" />
                    <p className="text-xs sm:text-sm text-stone-500 font-serif italic max-w-md leading-relaxed">
                        {lang === "en"
                            ? "Watch our latest holy masses, feast celebrations, and spiritual reflections online."
                            : "எங்கள் சமீபத்திய திருப்பலிகள், திருவிழா கொண்டாட்டங்கள் மற்றும் ஆன்மீக சிந்தனைகளை ஆன்லைனில் பாருங்கள்."}
                    </p>
                </div>

                {/* Loading Skeleton Matrix State */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-xs animate-pulse min-h-[340px]" />
                        ))}
                    </div>
                ) : videos.length === 0 ? (
                    /* Clean Fallback view when empty */
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200/80 p-8">
                        <p className="text-stone-500 italic text-sm">
                            {lang === "en" ? "No recent videos or updates found at this time." : "தற்போது புதிய வீடியோக்கள் எதுவும் கிடைக்கவில்லை."}
                        </p>
                    </div>
                ) : (
                    /* 📱 Fully Mobile Responsive Fluid Video Card Matrix Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {videos.map((video, index) => {
                            // Support both playlist item schema reference trees safely
                            const videoId = video?.snippet?.resourceId?.videoId || video?.id?.videoId;
                            if (!videoId) return null;

                            return (
                                <Link
                                    key={`${videoId}-${index}`}
                                    href={`/videos/${videoId}`}
                                    className="group"
                                >
                                    <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:border-indigo-500/40 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer">

                                        {/* Video Frame Thumbnail Cover Box */}
                                        <div className="relative aspect-video w-full overflow-hidden bg-stone-200 border-b border-stone-200">
                                            <img
                                                src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                                                alt={video.snippet.title}
                                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            {/* Glass play interactive badge overlay */}
                                            <div className="absolute right-3 bottom-3 w-8 h-8 rounded-lg bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-white opacity-90 border border-white/10 shadow-sm">
                                                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                                            </div>
                                        </div>

                                        {/* Typography Text Content Container */}
                                        <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                                            <h3 className="font-serif font-bold text-stone-800 text-base md:text-lg leading-snug tracking-wide line-clamp-2 group-hover:text-indigo-700 transition-colors">
                                                {video.snippet.title}
                                            </h3>

                                            {/* Localized Calendar Stamp Row */}
                                            <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-stone-400 tracking-wide mt-auto">
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