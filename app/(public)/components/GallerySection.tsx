"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, ArrowLeft, ArrowRight } from "lucide-react";

export default function GallerySection() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const items = [

        {
            title: "Anbiyam Assembly Council",
            tag: "Ministry",
            image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "Sacramental Consecration",
            tag: "Liturgical",
            image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "Anbiyam Assembly Council",
            tag: "Ministry",
            image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "Sacramental Consecration",
            tag: "Liturgical",
            image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?auto=format&fit=crop&q=80&w=600"
        },
    ];

    // Mouse Drag Interaction Handlers
    const startDragging = (e: React.MouseEvent) => {
        if (!sliderRef.current) return;
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
                </div>

                {/* Smooth Action Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="p-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-amber-600 transition-all active:scale-95 shadow-sm"
                        aria-label="Scroll left"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-amber-600 transition-all active:scale-95 shadow-sm"
                        aria-label="Scroll right"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Movable Card Container */}
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
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="relative h-64 w-[280px] sm:w-[340px] flex-shrink-0 bg-stone-900 border border-stone-200 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 snap-start"
                    >
                        {/* Interactive Zoom Background Image */}
                        <img
                            src={item.image}
                            alt={item.title}
                            draggable="false"
                            className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.85]"
                        />

                        {/* Interactive Shading Layer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-80" />
                        <div className="absolute inset-0 bg-amber-950/10 mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Context Floating Metadata */}
                        <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-start transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-md shadow-sm">
                                {item.tag}
                            </span>

                            <h4 className="text-white text-base font-serif font-bold mt-2.5 drop-shadow-sm group-hover:text-amber-300 transition-colors duration-300">
                                {item.title}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}