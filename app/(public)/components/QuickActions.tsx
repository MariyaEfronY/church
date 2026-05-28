"use client";

import Link from "next/link";
import { Heart, Flame, Tv, Phone } from "lucide-react";

interface QuickActionsProps {
    t: any;
    lang: "en" | "ta";
}

export default function QuickActions({ t, lang }: QuickActionsProps) {
    return (
        <section className="max-w-5xl mx-auto px-4 pt-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                {/* 💝 DONATE */}
                <Link
                    href="#donate"
                    className="group p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 active:scale-98 transition-all duration-300 ease-out flex flex-col items-center justify-center text-center gap-3"
                >
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex flex-col items-center justify-center text-stone-950 font-black shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
                        <Heart className="w-5 h-5 fill-stone-950 transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black tracking-wider text-stone-800 uppercase font-sans transition-colors duration-300 group-hover:text-amber-600">
                            {lang === 'en' ? 'Donate' : 'நன்கொடை'}
                        </span>
                        <span className="text-[10px] font-medium text-stone-400 font-serif lowercase italic">{t.actions.donate}</span>
                    </div>
                </Link>

                {/* 🔥 PRAYER REQUEST */}
                <Link
                    href="/prayer-request"
                    className="group p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs hover:border-red-500 hover:shadow-xl hover:-translate-y-1 active:scale-98 transition-all duration-300 ease-out flex flex-col items-center justify-center text-center gap-3"
                >
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex flex-col items-center justify-center text-white font-black shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ease-out">
                        <Flame className="w-5 h-5 fill-white transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black tracking-wider text-stone-800 uppercase font-sans transition-colors duration-300 group-hover:text-red-600">
                            {lang === 'en' ? 'Prayer Request' : 'ஜெப விண்ணப்பம்'}
                        </span>
                        <span className="text-[10px] font-medium text-stone-400 font-serif lowercase italic">{t.actions.prayerRequest}</span>
                    </div>
                </Link>

                {/* 📺 WATCH LIVE */}
                <Link
                    href="#live"
                    className="group p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs hover:border-indigo-600 hover:shadow-xl hover:-translate-y-1 active:scale-98 transition-all duration-300 ease-out flex flex-col items-center justify-center text-center gap-3"
                >
                    <div className="w-12 h-12 bg-indigo-700 rounded-xl flex flex-col items-center justify-center text-white font-black shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
                        <Tv className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black tracking-wider text-stone-800 uppercase font-sans transition-colors duration-300 group-hover:text-indigo-700">
                            {lang === 'en' ? 'Watch Live' : 'நேரலை'}
                        </span>
                        <span className="text-[10px] font-medium text-stone-400 font-serif lowercase italic">{t.actions.watchLive}</span>
                    </div>
                </Link>

                {/* 📞 CONTACT */}
                <Link
                    href="/contact"
                    className="group p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-xs hover:border-stone-600 hover:shadow-xl hover:-translate-y-1 active:scale-98 transition-all duration-300 ease-out flex flex-col items-center justify-center text-center gap-3"
                >
                    <div className="w-12 h-12 bg-stone-700 rounded-xl flex flex-col items-center justify-center text-white font-black shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ease-out">
                        <Phone className="w-5 h-5 fill-white transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black tracking-wider text-stone-800 uppercase font-sans transition-colors duration-300 group-hover:text-stone-700">
                            {lang === 'en' ? 'Contact' : 'தொடர்பு'}
                        </span>
                        <span className="text-[10px] font-medium text-stone-400 font-serif lowercase italic">{t.actions.contact}</span>
                    </div>
                </Link>

            </div>
        </section>
    );
}