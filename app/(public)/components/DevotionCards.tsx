"use client";

import { useEffect, useState } from "react";
import { BookOpen, Flame, Bell } from "lucide-react";

interface DevotionCardsProps {
    lang: "en" | "ta";
    t: any;
}

export default function DevotionCards({ lang, t }: DevotionCardsProps) {
    const [verseData, setVerseData] = useState({ text: "", reference: "" });
    const [announcements, setAnnouncements] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 1. Fetch Dynamic Bible Verse from Oldest Existing Route
    useEffect(() => {
        const fetchCurrentVerse = async () => {
            try {
                const res = await fetch("/api/priest/BibleVerse");
                const result = await res.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    const activeVerse = result.data.find((v: any) => v.isTodayVerse) || result.data[0];
                    setVerseData({
                        text: activeVerse.verseTamil,
                        reference: activeVerse.referenceTamil
                    });
                } else {
                    setVerseData({
                        text: "எனக்கு வலுவூட்டுகிறவராலே எல்லாவற்றையும் செய்ய எனக்கு ஆற்றல் உண்டு.",
                        reference: "பிலிப்பியர் 4:13"
                    });
                }
            } catch (error) {
                setVerseData({
                    text: "எனக்கு வலுவூட்டுகிறவராலே எல்லாவற்றையும் செய்ய எனக்கு ஆற்றல் உண்டு.",
                    reference: "பிலிப்பியர் 4:13"
                });
            }
        };

        fetchCurrentVerse();
    }, []);

    // 2. Fetch All Dynamic Active Events matching your exact API response structure
    useEffect(() => {
        const fetchLatestEvents = async () => {
            try {
                const res = await fetch("/api/priest/event");
                const result = await res.json();

                // 🌟 FIX: Extract directly from result.event to match your backend payload perfectly
                if (result.success && Array.isArray(result.event) && result.event.length > 0) {

                    // Filter down to active events if any are explicitly toggled on
                    const activeEvents = result.event.filter((e: any) => e.isActive !== false);
                    const targetSource = activeEvents.length > 0 ? activeEvents : result.event;

                    // Dynamically map titles using the current selected language state field keys
                    const strings = targetSource.map((e: any) => {
                        if (lang === "en") {
                            return e.titleEnglish || e.titleTamil;
                        } else {
                            return e.titleTamil || e.titleEnglish;
                        }
                    }).filter(Boolean);

                    setAnnouncements(strings.length > 0 ? strings : [t.feastBanner]);
                } else {
                    setAnnouncements([t.feastBanner]);
                }
            } catch (error) {
                console.error("Event fetch exception:", error);
                setAnnouncements([t.feastBanner]);
            }
        };

        fetchLatestEvents();
        setCurrentIndex(0); // Safely reset index bounds when global toggles switch layout strings
    }, [lang, t.feastBanner]);

    // 3. Automated Slider Loop for Carousel Indicators
    useEffect(() => {
        if (announcements.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [announcements]);

    // Secondary Constant Localized Info
    const saintName = lang === "en" ? "St. Thérèse of Lisieux" : "புனித சின்னப் புஷ்பம் (தெரசா)";
    const saintDesc = lang === "en"
        ? "Known for her 'little way' of doing ordinary tasks with extraordinary love."
        : "அசாதாரணமான அன்புடன் சாதாரண காரியங்களைச் செய்யும் தன் 'சிறு வழி'-க்காக அறியப்பட்டவர்.";

    return (
        <section className="-mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-30">
            {/* CARD 1: Bible Verse (Dynamic API) */}
            <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-slate-800 hover:border-amber-500/30 transition-all duration-300 group flex flex-col justify-between min-h-[220px]">
                <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/5 flex items-center justify-center border border-amber-500/10 mb-4 group-hover:bg-amber-500/10 transition-colors">
                        <BookOpen className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-500/70 mb-2">{t.dailyVerse}</h3>
                    <p className="text-slate-200 font-serif italic text-base leading-relaxed line-clamp-4">
                        "{verseData.text}"
                    </p>
                </div>
                <span className="block mt-4 text-xs font-semibold tracking-wide text-amber-400/80">
                    — {verseData.reference}
                </span>
            </div>

            {/* CARD 2: Today's Saint */}
            <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-slate-800 hover:border-rose-500/30 transition-all duration-300 group flex flex-col min-h-[220px]">
                <div className="w-10 h-10 rounded-xl bg-rose-500/5 flex items-center justify-center border border-rose-500/10 mb-4 group-hover:bg-rose-500/10 transition-colors">
                    <Flame className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-rose-500/70 mb-2">{t.todaysSaint}</h3>
                <p className="text-slate-100 font-serif font-bold text-lg leading-tight">{saintName}</p>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed font-light">{saintDesc}</p>
            </div>

            {/* CARD 3: Dynamic Sliding Announcement (Auto Fixed mapping) */}
            <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col min-h-[220px] justify-between">
                <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10 mb-4 group-hover:bg-indigo-500/10 transition-colors">
                        <Bell className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/70 mb-2">
                        {lang === "en" ? "Parish Announcement" : "பங்கு அறிவிப்பு"}
                    </h3>

                    <div className="relative overflow-hidden min-h-[80px] flex items-center">
                        {announcements.length === 0 ? (
                            <p className="text-slate-400 text-sm italic animate-pulse">
                                {lang === "en" ? "Loading messages..." : "அறிவிப்புகள் ஏற்றப்படுகிறது..."}
                            </p>
                        ) : (
                            <p key={`${currentIndex}-${lang}`} className="text-slate-200 font-serif text-base font-medium leading-relaxed transition-all duration-500 line-clamp-3 animate-fade-in">
                                {announcements[currentIndex]}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-indigo-400/80 uppercase font-medium tracking-wider">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                        {lang === "en" ? "Latest Update" : "புதிய தகவல்"}
                    </span>

                    {/* Carousel Indicators Slider dots */}
                    {announcements.length > 1 && (
                        <div className="flex gap-1.5">
                            {announcements.map((_, dotIdx) => (
                                <button
                                    key={dotIdx}
                                    onClick={() => setCurrentIndex(dotIdx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${dotIdx === currentIndex ? "bg-indigo-400 w-3" : "bg-slate-700 hover:bg-slate-500"
                                        }`}
                                    aria-label={`Go to slide ${dotIdx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}