"use client";

import { Heart, Flame, Tv, Phone } from "lucide-react";

interface QuickActionsProps {
    t: any;
}

export default function QuickActions({ t }: QuickActionsProps) {
    return (
        <section className="max-w-5xl mx-auto px-4 pt-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Donate Portal */}
                <a href="#donate" className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 border border-slate-850 rounded-2xl shadow-md hover:border-amber-500/40 hover:bg-slate-900/80 hover:translate-y-[-2px] transition-all duration-300 gap-3 group">
                    <div className="w-11 h-11 bg-amber-500/5 rounded-xl flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 border border-amber-500/10 transition-colors duration-300">
                        <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-xs md:text-sm text-slate-300 tracking-wider uppercase font-serif">{t.actions.donate}</span>
                </a>

                {/* Prayer Request Portal */}
                <a href="#prayer" className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 border border-slate-850 rounded-2xl shadow-md hover:border-red-500/40 hover:bg-slate-900/80 hover:translate-y-[-2px] transition-all duration-300 gap-3 group">
                    <div className="w-11 h-11 bg-red-500/5 rounded-xl flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white border border-red-500/10 transition-colors duration-300">
                        <Flame className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-xs md:text-sm text-slate-300 tracking-wider uppercase font-serif">{t.actions.prayerRequest}</span>
                </a>

                {/* Live Portal */}
                <a href="#live" className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 border border-slate-850 rounded-2xl shadow-md hover:border-indigo-500/40 hover:bg-slate-900/80 hover:translate-y-[-2px] transition-all duration-300 gap-3 group">
                    <div className="w-11 h-11 bg-indigo-500/5 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white border border-indigo-500/10 transition-colors duration-300">
                        <Tv className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-xs md:text-sm text-slate-300 tracking-wider uppercase font-serif">{t.actions.watchLive}</span>
                </a>

                {/* Contact Portal */}
                <a href="#contact" className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 border border-slate-850 rounded-2xl shadow-md hover:border-slate-500/40 hover:bg-slate-900/80 hover:translate-y-[-2px] transition-all duration-300 gap-3 group">
                    <div className="w-11 h-11 bg-slate-500/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-950 border border-slate-500/10 transition-colors duration-300">
                        <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-xs md:text-sm text-slate-300 tracking-wider uppercase font-serif">{t.actions.contact}</span>
                </a>
            </div>
        </section>
    );
}