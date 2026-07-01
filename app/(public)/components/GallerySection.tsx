"use client";

import { useRef, useState, useEffect } from "react";
import { Image as ImageIcon, ArrowLeft, ArrowRight, Loader2, Calendar } from "lucide-react";

interface IGalleryImage {
    url: string;
    s3Key: string;
}

interface IGalleryEvent {
    _id: string;
    titleEn: string;
    titleTa: string;
    descriptionEn?: string;
    descriptionTa?: string;
    category: string;
    eventDate: string;
    images: IGalleryImage[];
    isExpired: boolean;
}

export default function GallerySection() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Dynamic Data States
    const [events, setEvents] = useState<IGalleryEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [lang, setLang] = useState<"en" | "ta">("en"); // Support language switching toggle if needed

    // Fetch from live database layer endpoint execution
    useEffect(() => {
        async function fetchGallery() {
            try {
                const res = await fetch("/api/gallery");
                const result = await res.json();
                if (result.success) {
                    setEvents(result.data || []);
                }
            } catch (err) {
                console.error("Failed fetching live chronicles content stream:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchGallery();
    }, []);

    // Mouse Drag Interaction Handlers
    const startDragging = (e: React.MouseEvent) => {
        if (!sliderRef.current || loading || events.length === 0) return;
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    const handleDrag = (e: React.MouseEvent) => {
        if (!isDragging || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed modifier
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    // Button Navigation Click Handlers
    const scroll = (direction: "left" | "right") => {
        if (!sliderRef.current) return;
        const scrollAmount = 340;
        sliderRef.current.scrollTo({
            left: sliderRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
            behavior: "smooth"
        });
    };

    return (
        <section className="space-y-6 select-none">
            {/* Header with Navigation Controls */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600">
                        <ImageIcon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">
                        Parish Chronicles
                    </h3>
                    {/* Subtle runtime language toggle for validation testing */}
                    <button
                        onClick={() => setLang(l => l === "en" ? "ta" : "en")}
                        className="ml-3 text-[10px] font-mono border border-stone-200 px-1.5 py-0.5 rounded bg-white text-stone-600 active:bg-stone-50"
                    >
                        {lang === "en" ? "EN" : "தமிழ்"}
                    </button>
                </div>

                {/* Smooth Action Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={loading || events.length === 0}
                        className="p-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-amber-600 transition-all active:scale-95 shadow-sm disabled:opacity-40"
                        aria-label="Scroll left"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={loading || events.length === 0}
                        className="p-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-amber-600 transition-all active:scale-95 shadow-sm disabled:opacity-40"
                        aria-label="Scroll right"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Movable Card Container Layout Entry Point */}
            {loading ? (
                <div className="flex h-64 w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-400">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                    <span className="text-sm font-medium">Syncing archives stack...</span>
                </div>
            ) : events.length === 0 ? (
                <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-stone-150 bg-stone-50/30 text-stone-400 text-sm">
                    No records or media assets found in database cluster.
                </div>
            ) : (
                <div
                    ref={sliderRef}
                    onMouseDown={startDragging}
                    onMouseLeave={stopDragging}
                    onMouseUp={stopDragging}
                    onMouseMove={handleDrag}
                    className={`flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory ${isDragging ? "cursor-grabbing scale-[0.99]" : "cursor-grab"
                        } transition-transform duration-300 ease-out`}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {events.map((event) => {
                        // Safe Asset Extraction Fallback: Target first index in array if populated
                        const fallbackImage = "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=600";
                        const currentImgUrl = event.images && event.images.length > 0 ? event.images[0].url : fallbackImage;

                        // Multilingual title structural mapping selector
                        const resolvedTitle = lang === "en" ? event.titleEn : event.titleTa;

                        return (
                            <div
                                key={event._id}
                                className="relative h-64 w-[280px] sm:w-[340px] flex-shrink-0 bg-stone-900 border border-stone-200 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 snap-start"
                            >
                                {/* Interactive Zoom Background Image */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={currentImgUrl}
                                    alt={resolvedTitle}
                                    draggable="false"
                                    className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8]"
                                />

                                {/* Interactive Gradient Shading Layers */}
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent opacity-90" />
                                <div className="absolute inset-0 bg-amber-950/10 mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Floating Meta Items (Top Segment Integration) */}
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-md bg-stone-950/60 backdrop-blur-sm px-2 py-1 text-[10px] text-stone-300 font-mono">
                                    <Calendar className="h-3 w-3 text-amber-500" />
                                    {new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>

                                {/* Context Floating Metadata (Bottom Segment) */}
                                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-start transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-md shadow-sm capitalize">
                                        {event.category}
                                    </span>

                                    <h4 className="text-white text-base font-serif font-bold mt-2.5 drop-shadow-md group-hover:text-amber-300 transition-colors duration-300 line-clamp-2">
                                        {resolvedTitle}
                                    </h4>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}