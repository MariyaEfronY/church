"use client";

import { Church, ShieldCheck, CalendarDays } from "lucide-react";

export default function AboutSection() {
    return (
        <section className="bg-stone-950/80 pt-5 border border-stone-800/80 backdrop-blur-md rounded-3xl p-6 md:p-12 space-y-8 shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Editorial Content */}
                <div className="space-y-6">
                    {/* Animated Badge */}
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                        <Church className="w-3.5 h-3.5" />
                        <span>Our Parish Sanctuary</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight">
                        Nurturing Faith Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Generations.</span>
                    </h2>

                    <p className="text-stone-300 text-base leading-relaxed font-normal">
                        Established as a pillar of spiritual devotion and local fellowship, our parish serves as a welcoming home for communal growth. We faithfully preserve our rich historical roots while embracing modern care to keep our community beautifully connected.
                    </p>

                    {/* Features Grid with Hover Effects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="group flex gap-4 items-start p-3 rounded-2xl hover:bg-stone-900/50 transition-all duration-300">
                            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-amber-400 group-hover:scale-110 group-hover:border-amber-500/50 transition-all duration-300 shadow-inner">
                                <CalendarDays className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-stone-100 font-bold text-sm uppercase tracking-wide">Sacred Tradition</h4>
                                <p className="text-stone-400 text-xs mt-1 leading-normal">Preserving liturgical timelines and community heritage with reverence.</p>
                            </div>
                        </div>

                        <div className="group flex gap-4 items-start p-3 rounded-2xl hover:bg-stone-900/50 transition-all duration-300">
                            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-300 shadow-inner">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-stone-100 font-bold text-sm uppercase tracking-wide">Protected Legacy</h4>
                                <p className="text-stone-400 text-xs mt-1 leading-normal">Ensuring strict privacy and utmost care across all family records.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Structural Graphical Callout Card with Floating Effect */}
                <div className="relative group/card bg-gradient-to-br from-[#4a0e17] via-[#2d080e] to-[#1c0205] rounded-3xl p-10 border border-[#6b1b26] shadow-2xl text-center overflow-hidden transition-all duration-500 hover:shadow-amber-900/20 hover:border-[#8c2532]">
                    {/* Glowing background animation */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)] opacity-50 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Floating Church Icon */}
                    <div className="relative inline-block animate-bounce [animation-duration:4s]">
                        <Church className="w-20 h-20 text-amber-400/90 mx-auto mb-6 stroke-[1.1] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-white tracking-wide">St. Thomas Cathedral</h3>
                    <p className="text-stone-300 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                        Serving as the core spiritual center for our regional worship and the loving union of our parish families.
                    </p>

                    {/* Animated Status Indicator */}
                    <div className="mt-8 inline-flex items-center gap-2 bg-stone-950/80 backdrop-blur-md border border-stone-800 px-5 py-2.5 rounded-xl text-xs font-mono text-stone-200 shadow-xl group-hover/card:border-amber-500/30 transition-all duration-300">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Parish Registry • Active Connection
                    </div>
                </div>

            </div>
        </section>
    );
}