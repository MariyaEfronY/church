"use client";

import { useEffect, useState } from "react";
import { Megaphone, Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function AnnouncementSection() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<"en" | "ta">("en");

    // Track active image slide indices for documents with multiple images
    const [slideIndices, setSlideIndices] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        // Language synchronization listener matrix
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };
        window.addEventListener("church-lang-change" as any, handleLangChange);

        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        if (savedLang) setLang(savedLang);

        // Fetch announcements collection from API
        fetch("/api/announcements")
            .then((res) => res.json())
            .then((resData) => {
                if (resData.success) {
                    setAnnouncements(resData.data || []);

                    // Initialize image slider states at index 0
                    const initialIndices: { [key: string]: number } = {};
                    resData.data?.forEach((item: any) => {
                        initialIndices[item._id] = 0;
                    });
                    setSlideIndices(initialIndices);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error reading announcements data:", err);
                setLoading(false);
            });

        return () => window.removeEventListener("church-lang-change" as any, handleLangChange);
    }, []);

    // Slider controls navigation handlers
    const nextSlide = (id: string, maxImages: number) => {
        setSlideIndices((prev) => ({
            ...prev,
            [id]: (prev[id] + 1) % maxImages,
        }));
    };

    const prevSlide = (id: string, maxImages: number) => {
        setSlideIndices((prev) => ({
            ...prev,
            [id]: (prev[id] - 1 + maxImages) % maxImages,
        }));
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white border border-stone-200 h-80 rounded-2xl animate-pulse shadow-xs" />
                ))}
            </div>
        );
    }

    if (announcements.length === 0) return null; // Gracefully hides if no announcements exist

    return (
        <section className="bg-stone-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-200/60 relative z-10">
            <div className="max-w-6xl mx-auto">

                {/* --- Section Header --- */}
                <div className="flex flex-col items-center text-center mb-12 gap-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                        <Megaphone className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                        {lang === "en" ? "Latest Notice" : "சமீபத்திய அறிவிப்பு"}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-stone-900">
                        {lang === "en" ? "Parish Announcements" : "பங்கு அறிவிப்புகள்"}
                    </h2>
                    <div className="w-12 h-0.5 bg-amber-600/50 rounded-full" />
                </div>

                {/* --- Grid Layout Stack --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {announcements.map((item) => {
                        const totalImages = item.images?.length || 0;
                        const currentActiveIndex = slideIndices[item._id] || 0;

                        return (
                            <div
                                key={item._id}
                                className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full group"
                            >
                                {/* --- Multi-Image Micro Slider Cover --- */}
                                {totalImages > 0 && (
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border-b border-stone-100">

                                        {/* Slider Window Container */}
                                        <div
                                            className="flex h-full w-full transition-transform duration-500 ease-out"
                                            style={{ transform: `translateX(-${currentActiveIndex * 100}%)` }}
                                        >
                                            {item.images.map((img: any, idx: number) => (
                                                <div key={idx} className="w-full h-full flex-shrink-0 relative">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={img.url}
                                                        alt={`Announcement visual item ${idx + 1}`}
                                                        className="w-full h-full object-cover select-none"
                                                        loading="lazy"
                                                        draggable="false"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Arrow Buttons HUD Navigation controls (Only visible if > 1 image exists) */}
                                        {totalImages > 1 && (
                                            <>
                                                <button
                                                    onClick={() => prevSlide(item._id, totalImages)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/80 backdrop-blur-md text-stone-800 shadow-sm border border-stone-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 active:scale-95"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => nextSlide(item._id, totalImages)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/80 backdrop-blur-md text-stone-800 shadow-sm border border-stone-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 active:scale-95"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>

                                                {/* Dots Index indicator indicators array deck */}
                                                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
                                                    {item.images.map((_: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${currentActiveIndex === idx ? "w-4 bg-amber-600" : "w-1.5 bg-stone-300/80"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* --- Card Metadata Deck Frame Footer --- */}
                                <div className="p-4 flex items-center justify-between mt-auto border-t border-stone-100 bg-stone-50/50">
                                    <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-stone-400 tracking-wide">
                                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                        <span>
                                            {new Date(item.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "ta-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold font-sans text-amber-700/80 uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                                        <span>Notice</span>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}