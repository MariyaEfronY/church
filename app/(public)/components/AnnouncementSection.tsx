"use client";

import { useEffect, useState } from "react";
import { Megaphone, Calendar, ChevronLeft, ChevronRight, Sparkles, X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementSection() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<"en" | "ta">("en");
    const [slideIndices, setSlideIndices] = useState<{ [key: string]: number }>({});

    // Lightbox Zoom States
    const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);

    useEffect(() => {
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };
        window.addEventListener("church-lang-change" as any, handleLangChange);

        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        if (savedLang) setLang(savedLang);

        fetch("/api/announcements")
            .then((res) => res.json())
            .then((resData) => {
                if (resData.success) {
                    setAnnouncements(resData.data || []);
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

    const nextSlide = (id: string, maxImages: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideIndices((prev) => ({
            ...prev,
            [id]: (prev[id] + 1) % maxImages,
        }));
    };

    const prevSlide = (id: string, maxImages: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideIndices((prev) => ({
            ...prev,
            [id]: (prev[id] - 1 + maxImages) % maxImages,
        }));
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-96 rounded-2xl animate-pulse bg-stone-200/40" />
                ))}
            </div>
        );
    }

    if (announcements.length === 0) return null;

    return (
        <section className="space-y-6 select-none  py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-200/60 relative z-10 w-full overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* --- Header with Mini Badge Layout (Perfect Match to your Gallery Style) --- */}
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600">
                            <Megaphone className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">
                            {lang === "en" ? "Parish Announcements" : "பங்கு அறிவிப்புகள்"}
                        </h3>
                    </div>
                </div>

                {/* --- Transparent Grid Layout Container --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {announcements.map((item) => {
                        const totalImages = item.images?.length || 0;
                        const currentActiveIndex = slideIndices[item._id] || 0;

                        const displayTitle = lang === "ta" ? (item.titleTa || item.title) : item.title;
                        const displayDescription = lang === "ta" ? (item.descriptionTa || item.description) : item.description;
                        const activeImageUrl = item.images?.[currentActiveIndex]?.url;

                        return (
                            <div
                                key={item._id}
                                className="transition-all duration-300 flex flex-col h-full group"
                            >
                                {/* --- Visual Media Window Cover --- */}
                                {totalImages > 0 && (
                                    <div
                                        onClick={() => activeImageUrl && setActiveZoomImage(activeImageUrl)}
                                        className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 rounded-2xl border border-stone-200/60 cursor-zoom-in"
                                    >
                                        <div
                                            className="flex h-full w-full transition-transform duration-500 ease-out"
                                            style={{ transform: `translateX(-${currentActiveIndex * 100}%)` }}
                                        >
                                            {item.images.map((img: any, idx: number) => (
                                                <div key={idx} className="w-full h-full flex-shrink-0 relative">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={img.url}
                                                        alt={displayTitle}
                                                        className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                                                        loading="lazy"
                                                        draggable="false"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Dynamic Gradient Shadows */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />

                                        {/* Zoom HUD Toggle */}
                                        <div className="absolute top-4 left-4 p-1.5 rounded-lg bg-stone-950/50 backdrop-blur-md border border-white/10 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            <Maximize2 className="w-3.5 h-3.5" />
                                        </div>

                                        {/* HUD Arrows Navigation Panel */}
                                        {totalImages > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => prevSlide(item._id, totalImages, e)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-stone-800 shadow-xs border border-stone-200/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 active:scale-95 z-20"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => nextSlide(item._id, totalImages, e)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-stone-800 shadow-xs border border-stone-200/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 active:scale-95 z-20"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>

                                                {/* Dots Navigation Track */}
                                                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20">
                                                    {item.images.map((_: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${currentActiveIndex === idx ? "w-4 bg-amber-600" : "w-1.5 bg-white/60"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* --- Text Info Content Frame --- */}
                                <div className="pt-4 pb-3 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold font-sans text-amber-800 uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3 text-amber-600" />
                                        <span>{lang === "en" ? "Notice" : "அறிவிப்பு"}</span>
                                    </div>

                                    <h3 className="text-lg font-serif font-bold text-stone-900 line-clamp-2 mb-2 group-hover:text-amber-800 transition-colors duration-200">
                                        {displayTitle}
                                    </h3>

                                    {displayDescription && (
                                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                            {displayDescription}
                                        </p>
                                    )}
                                </div>

                                {/* --- Clean Flat Metadata Footer --- */}
                                <div className="pt-3 border-t border-stone-200/60 flex items-center text-[11px] font-sans font-semibold text-stone-500 tracking-wide">
                                    <Calendar className="w-3.5 h-3.5 text-stone-400 mr-1.5" />
                                    <span>
                                        {new Date(item.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "ta-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- Zoom Lightbox Modal --- */}
            <AnimatePresence>
                {activeZoomImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveZoomImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 p-4 backdrop-blur-md cursor-zoom-out"
                    >
                        <button
                            onClick={() => setActiveZoomImage(null)}
                            className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all duration-200 active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={activeZoomImage}
                                alt="Expanded notice file preview"
                                className="w-full h-full max-h-[85vh] object-contain rounded-2xl select-none"
                                draggable="false"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}