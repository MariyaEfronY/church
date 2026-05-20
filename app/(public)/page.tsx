"use client";

import { Heart, Flame, Tv, Phone, Calendar, BookOpen, Sparkles, Clock } from "lucide-react";
import en from "../locales/en.json";

export default function PublicHomePage() {
    return (
        <div className="pb-20">
            {/* Announcement Feast Banner */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-3 text-center text-xs md:text-sm font-medium flex items-center justify-center gap-2 shadow-inner">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{en.feastBanner}</span>
            </div>

            {/* Hero Header Space */}
            <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-102"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1548625361-155defe219f2?q=80&w=1600')`
                    }}
                />
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6 flex flex-col items-center gap-4">
                    <span className="inline-block bg-amber-400/10 backdrop-blur-md border border-amber-400/20 text-amber-300 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                        Welcome to Our Home of Grace
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                        {en.parishName}
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 font-light max-w-xl italic">
                        {en.tagline}
                    </p>
                </div>
            </header>

            {/* Overlapping Daily Devotion Section */}
            <section className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:translate-y-1 transition-transform">
                    <BookOpen className="w-5 h-5 text-amber-600 mb-3" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{en.dailyVerse}</h3>
                    <p className="text-slate-700 font-serif italic text-base">"I can do all things through Christ who strengthens me." — Philippians 4:13</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:translate-y-1 transition-transform">
                    <Flame className="w-5 h-5 text-red-600 mb-3" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{en.todaysSaint}</h3>
                    <p className="text-slate-800 font-bold text-lg">St. Thérèse of Lisieux</p>
                    <p className="text-slate-500 text-xs mt-1">Known for her 'little way' of doing ordinary tasks with extraordinary love.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:translate-y-1 transition-transform">
                    <Sparkles className="w-5 h-5 text-indigo-600 mb-3" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{en.thoughtOfDay}</h3>
                    <p className="text-slate-600 text-sm italic">"Kind words can be short and easy to speak, but their echoes are truly endless."</p>
                </div>
            </section>

            {/* Liturgical Worship Timings Grid */}
            <section className="max-w-3xl mx-auto px-4 pt-20">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 text-center mb-8 flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" /> {en.massTimingsTitle}
                </h2>
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                    <div className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <span className="font-semibold text-slate-800 text-base md:text-lg">{en.massSunday}</span>
                        <span className="text-amber-700 bg-amber-50 px-4 py-1 rounded-full text-sm font-medium self-start sm:self-center">6:30 AM | 8:30 AM | 5:30 PM</span>
                    </div>
                    <div className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <span className="font-semibold text-slate-800 text-base md:text-lg">{en.massWeekday}</span>
                        <span className="text-slate-600 bg-slate-100 px-4 py-1 rounded-full text-sm font-medium self-start sm:self-center">Monday - Saturday: 6:00 AM</span>
                    </div>
                    <div className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <span className="font-semibold text-slate-800 text-base md:text-lg">{en.massAdoration}</span>
                        <span className="text-indigo-700 bg-indigo-50 px-4 py-1 rounded-full text-sm font-medium self-start sm:self-center">Every First Friday: 6:00 PM</span>
                    </div>
                </div>
            </section>

            {/* Mobile-Responsive Touch Link Quick Actions Container */}
            <section className="max-w-5xl mx-auto px-4 pt-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <a href="#donate" className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-colors gap-3 group">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Heart className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm text-slate-800">{en.actions.donate}</span>
                    </a>

                    <a href="#prayer" className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-colors gap-3 group">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Flame className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm text-slate-800">{en.actions.prayerRequest}</span>
                    </a>

                    <a href="#live" className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-colors gap-3 group">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <Tv className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm text-slate-800">{en.actions.watchLive}</span>
                    </a>

                    <a href="#contact" className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-colors gap-3 group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                            <Phone className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm text-slate-800">{en.actions.contact}</span>
                    </a>
                </div>
            </section>
        </div>
    );
}