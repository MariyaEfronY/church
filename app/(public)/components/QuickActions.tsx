"use client";

import { Heart, Flame, Tv, Phone } from "lucide-react";

interface QuickActionsProps {
    t: any;
    lang: "en" | "ta";
}

export default function QuickActions({ t, lang }: QuickActionsProps) {
    return (
        <section className="max-w-5xl mx-auto px-4 pt-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* DONATE */}
                <a href="#donate" className="group p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex flex-col items-center justify-center text-stone-950 font-black shadow-sm group-hover:scale-105 transition-transform">
                        <Heart className="w-5 h-5 fill-stone-950" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black tracking-wider text-stone-800 uppercase font-sans">{lang === 'en' ? 'Donate' : 'நன்கொடை'}</span>
                        <span className="text-[10px] font-medium text-stone-400 font-serif lowercase italic">{t.actions.donate}</span>
                    </div>
                </a>

                {/* PRAYER */}
                <a href="#prayer" className="group p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs hover:border-red-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex flex-col items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-transform">
                        <Flame className="w-5 h-5 fill-white" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black tracking-wider text-stone-800 uppercase font-sans">{lang === 'en' ? 'Prayer Request' : 'ஜெப விண்ணப்பம்'}</span>
                        <span className="text-[10px] font-medium text-stone-400 font-serif lowercase italic">{t.actions.prayerRequest}</span>
                    </div>
                </a>

                {/* WATCH LIVE */}
                <a href="#live" className="group p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs hover:border-indigo-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 bg-indigo-700 rounded-xl flex flex-col items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-transform">
                        <Tv className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black tracking-wider text-stone-800 uppercase font-sans">{lang === 'en' ? 'Watch Live' : 'நேரலை'}</span>
                        <span className="text-[10px] font-medium text-stone-400 font-serif lowercase italic">{t.actions.watchLive}</span>
                    </div>
                </a>

                {/* CONTACT */}
                <a href="#contact" className="group p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs hover:border-stone-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 bg-stone-700 rounded-xl flex flex-col items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-transform">
                        <Phone className="w-5 h-5 fill-white" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black tracking-wider text-stone-800 uppercase font-sans">{lang === 'en' ? 'Contact' : 'தொடர்பு'}</span>
                        <span className="text-[10px] font-medium text-stone-400 font-serif lowercase italic">{t.actions.contact}</span>
                    </div>
                </a>
            </div>
        </section>
    );
}