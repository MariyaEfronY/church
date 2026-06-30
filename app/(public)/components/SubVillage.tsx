"use client";

import { useState, useEffect } from "react";
import { MapPin, Users, Church, ChevronRight, CalendarDays } from "lucide-react";

interface SubVillageProps {
    t: any;
}

export default function SubVillage({ t }: SubVillageProps) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [currentImgIdx, setCurrentImgIdx] = useState(0);

    // Asset arrays remain identical across languages
    const villageImages = [
        [
            "https://images.unsplash.com/photo-1548625361-155deee259f6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1515516969-d4008cc6241a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800"
        ],
        [
            "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800"
        ],
        [
            "https://images.unsplash.com/photo-1445445290350-18a3b76e3154?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&q=80&w=800"
        ]
    ];

    const subVillagesData = t.subVillages || { list: [] };
    const villagesList = subVillagesData.list || [];
    const currentVillage = villagesList[activeIdx] || {};
    const activeImages = villageImages[activeIdx] || [];

    useEffect(() => {
        setCurrentImgIdx(0);
        if (activeImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImgIdx((prev) => (prev + 1) % activeImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIdx, activeImages.length]);

    if (villagesList.length === 0) return null;

    return (
        <section className="space-y-6">
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">
                            {subVillagesData.title}
                        </h3>
                        <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                            {subVillagesData.subtitle}
                        </p>
                    </div>
                </div>
                <span className="text-[11px] text-stone-600 font-mono bg-white border border-stone-200 px-3 py-1 rounded-full shadow-xs">
                    {villagesList.length} {subVillagesData.badgeConnected}
                </span>
            </div>

            {/* Layout Cards Grid Frame */}
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">

                {/* LEFT SIDE: Navigation */}
                <div className="lg:col-span-5 bg-stone-50/60 border-b lg:border-b-0 lg:border-r border-stone-200/60 p-6 flex flex-col justify-center space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">
                            {subVillagesData.menuHeader}
                        </p>
                        <h4 className="text-stone-800 font-serif font-bold text-xl px-1 mt-0.5">
                            {subVillagesData.menuSub}
                        </h4>
                    </div>

                    <div className="space-y-3">
                        {villagesList.map((v: any, idx: number) => {
                            const isSelected = activeIdx === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIdx(idx)}
                                    className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all duration-300 group ${isSelected
                                        ? "bg-gradient-to-r from-[#4a0e17] to-[#2d050a] text-white shadow-lg translate-x-1.5"
                                        : "bg-white text-stone-800 hover:bg-stone-100/80 border border-stone-200/80 shadow-xs"
                                        }`}
                                >
                                    <div className="space-y-0.5">
                                        <h4 className={`font-serif font-bold text-base transition-colors ${isSelected ? "text-amber-400" : "text-stone-900 group-hover:text-[#4a0e17]"}`}>
                                            {v.name}
                                        </h4>
                                        <p className={`text-xs font-medium ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                                            {v.families}
                                        </p>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSelected ? "text-amber-400 translate-x-1" : "text-stone-300 group-hover:text-stone-500"
                                        }`} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT SIDE: Dedicated Mini Page Display Area */}
                <div className="lg:col-span-7 relative flex flex-col justify-end p-8 sm:p-10 text-white min-h-[360px] lg:min-h-auto overflow-hidden bg-stone-950">

                    {activeImages.map((imgSrc, imgIdx) => {
                        const isCurrentPhoto = currentImgIdx === imgIdx;
                        return (
                            <img
                                key={imgIdx}
                                src={imgSrc}
                                alt="Substation layout visual background"
                                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out ${isCurrentPhoto ? "opacity-50 scale-100 blur-0" : "opacity-0 scale-105 blur-xs pointer-events-none"
                                    }`}
                            />
                        );
                    })}

                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent z-10" />

                    {activeImages.length > 1 && (
                        <div className="absolute top-6 right-6 z-20 flex gap-1.5 bg-stone-950/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                            {activeImages.map((_, imgIdx) => (
                                <button
                                    key={imgIdx}
                                    onClick={() => setCurrentImgIdx(imgIdx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentImgIdx === imgIdx ? "w-4 bg-amber-400" : "w-1.5 bg-white/40"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="relative z-20 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-md shadow-sm">
                                {currentVillage.distance}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md text-stone-200 px-2.5 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                                <CalendarDays className="w-3 h-3 text-amber-400" />
                                {currentVillage.established}
                            </span>
                        </div>

                        <h3 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white">
                            {currentVillage.name}
                        </h3>

                        <p className="text-stone-200 text-xs sm:text-sm leading-relaxed max-w-xl font-normal min-h-[60px]">
                            {currentVillage.desc}
                        </p>

                        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-stone-300">
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-amber-400" />
                                <span>{currentVillage.families} {subVillagesData.totalSuffix}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Church className="w-4 h-4 text-amber-400" />
                                <span>{subVillagesData.patronLabel}: <strong className="text-white font-normal">{currentVillage.patron}</strong></span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}