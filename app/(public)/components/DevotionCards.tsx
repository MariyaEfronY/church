"use client";

import { useEffect, useState } from "react";
import { BookOpen, Flame, Bell, CalendarDays, MapPin } from "lucide-react";

interface DevotionCardsProps {
    lang: "en" | "ta";
    t: any;
}

export default function DevotionCards({ lang, t }: DevotionCardsProps) {
    const [verseData, setVerseData] = useState({ text: "", reference: "" });
    const [eventsList, setEventsList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchCurrentVerse = async () => {
            try {
                const res = await fetch("/api/priest/BibleVerse");
                const result = await res.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    const activeVerse = result.data.find((v: any) => v.isTodayVerse) || result.data[0];
                    setVerseData({ text: activeVerse.verseTamil, reference: activeVerse.referenceTamil });
                } else {
                    setVerseData({ text: "எனக்கு வலுவூட்டுகிறவராலே எல்லாவற்றையும் செய்ய எனக்கு ஆற்றல் உண்டு.", reference: "பிலிப்பியர் 4:13" });
                }
            } catch (error) {
                setVerseData({ text: "எனக்கு வலுவூட்டுகிறவராலே எல்லாவற்றையும் செய்ய எனக்கு ஆற்றல் உண்டு.", reference: "பிலிப்பியர் 4:13" });
            }
        };
        fetchCurrentVerse();
    }, []);

    useEffect(() => {
        const fetchLatestEvents = async () => {
            try {
                const res = await fetch("/api/priest/event");
                const result = await res.json();
                if (result.success && Array.isArray(result.event)) {
                    const activeEvents = result.event.filter((e: any) => e.isActive !== false);
                    setEventsList(activeEvents.length > 0 ? activeEvents : result.event);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchLatestEvents();
        setCurrentIndex(0);
    }, []);

    useEffect(() => {
        if (eventsList.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % eventsList.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [eventsList]);

    const saintName = lang === "en" ? "St. Thérèse of Lisieux" : "புனித சின்னப் புஷ்பம் (தெரசா)";
    const saintDesc = lang === "en" ? "Known for her 'little way' of ordinary love." : "அசாதாரணமான அன்புடன் சாதாரண காரியங்களைச் செய்யும் தன் 'சிறு வழி'-க்காக அறியப்பட்டவர்.";

    const currentEvent = eventsList[currentIndex];
    const eventDetails = currentEvent ? {
        title: lang === "en" ? currentEvent.titleEnglish : (currentEvent.titleTamil || currentEvent.titleEnglish),
        description: lang === "en" ? currentEvent.descriptionEnglish : (currentEvent.descriptionTamil || currentEvent.descriptionEnglish),
        location: currentEvent.location || "",
        date: currentEvent.eventDate ? new Date(currentEvent.eventDate).toLocaleDateString(lang === "en" ? "en-US" : "ta-IN", { day: "numeric", month: "short", year: "numeric" }) : ""
    } : null;

    return (
        <section className="-mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-30">
            {/* CARD 1: Warm Gold/Amber (Bible Verse) */}
            <div className="bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 text-stone-950 rounded-2xl p-6 shadow-xl border border-amber-400/20 flex flex-col justify-between min-h-[230px] hover:scale-[1.01] transition-transform duration-300">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-950/60">{t.dailyVerse}</span>
                        <BookOpen className="w-5 h-5 text-stone-950/80" />
                    </div>
                    <p className="font-serif font-bold italic text-base sm:text-lg leading-relaxed text-stone-950">
                        "{verseData.text}"
                    </p>
                </div>
                <span className="block mt-4 text-xs font-bold tracking-wide text-stone-950/70">— {verseData.reference}</span>
            </div>

            {/* CARD 2: Liturgical Crimson (Saint of Day) */}
            <div className="bg-gradient-to-br from-red-600 via-red-600 to-rose-700 text-white rounded-2xl p-6 shadow-xl border border-red-500/20 flex flex-col min-h-[230px] hover:scale-[1.01] transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-100/60">{t.todaysSaint}</span>
                    <Flame className="w-5 h-5 text-red-100/90" />
                </div>
                <p className="font-serif font-extrabold text-lg sm:text-xl text-white tracking-wide leading-tight">{saintName}</p>
                <p className="text-red-50 text-xs mt-2.5 leading-relaxed font-light">{saintDesc}</p>
            </div>

            {/* CARD 3: Altar Blue (Dynamic Scrolling Event Hub) */}
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-700 to-blue-800 text-white rounded-2xl p-6 shadow-xl border border-indigo-600/20 flex flex-col min-h-[230px] justify-between hover:scale-[1.01] transition-transform duration-300">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200/70">
                            {lang === "en" ? "Parish Announcement" : "பங்கு அறிவிப்பு"}
                        </span>
                        <Bell className="w-5 h-5 text-indigo-100/90" />
                    </div>

                    <div className="relative min-h-[95px] flex flex-col justify-center">
                        {eventsList.length === 0 ? (
                            <p className="text-indigo-200 text-xs italic animate-pulse">
                                {lang === "en" ? "Loading announcements..." : "அறிவிப்புகள் ஏற்றப்படுகிறது..."}
                            </p>
                        ) : (
                            <div key={`${currentIndex}-${lang}`} className="animate-fade-in flex flex-col gap-1.5">
                                <h4 className="font-serif text-base sm:text-lg font-bold tracking-wide line-clamp-1 text-white">
                                    {eventDetails?.title}
                                </h4>
                                {eventDetails?.description && (
                                    <p className="text-indigo-100 text-xs leading-relaxed line-clamp-2 font-light">
                                        {eventDetails.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-indigo-200">
                                    {eventDetails?.date && (
                                        <span className="flex items-center gap-1 font-medium text-amber-300">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            {eventDetails.date}
                                        </span>
                                    )}
                                    {eventDetails?.location && (
                                        <span className="flex items-center gap-1 opacity-90">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {eventDetails.location}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-3 pt-2 border-t border-indigo-600/40 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] text-indigo-200/90 font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                        {lang === "en" ? "Live Feed" : "புதிய தகவல்"}
                    </span>

                    {eventsList.length > 1 && (
                        <div className="flex gap-1">
                            {eventsList.map((_, dotIdx) => (
                                <button
                                    key={dotIdx}
                                    onClick={() => setCurrentIndex(dotIdx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${dotIdx === currentIndex ? "bg-white w-3" : "bg-indigo-900/60 hover:bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}