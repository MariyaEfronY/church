"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface LiturgicalTimingsProps {
    lang: "en" | "ta";
    t: any;
}

export default function LiturgicalTimings({ lang, t }: LiturgicalTimingsProps) {
    const [liveTimings, setLiveTimings] = useState<any[]>([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await fetch("/api/priest/MassTiming");
                const result = await res.json();
                if (result.success && Array.isArray(result.data)) {
                    setLiveTimings(result.data.filter((item: any) => item.active !== false));
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchSchedules();
    }, []);

    return (
        <section className="max-w-3xl mx-auto px-4 pt-24">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 text-center mb-6 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-stone-800" />
                <span className="tracking-tight">{t.massTimingsTitle}</span>
            </h2>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-stone-200">
                {liveTimings.length === 0 ? (
                    <>
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-stone-100/50 transition-colors">
                            <span className="font-serif font-bold text-stone-800 text-base">{t.massSunday}</span>
                            <span className="text-amber-900 bg-amber-500/10 border border-amber-500/20 px-4 py-1 rounded-full text-xs font-bold self-start sm:self-center">
                                {lang === "en" ? "6:30 AM | 8:30 AM" : "காலை 6:30 | காலை 8:30"}
                            </span>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-stone-100/50 transition-colors">
                            <span className="font-serif font-bold text-stone-800 text-base">{t.massWeekday}</span>
                            <span className="text-stone-700 bg-stone-200/80 px-4 py-1 rounded-full text-xs font-bold self-start sm:self-center">
                                {lang === "en" ? "Mon - Sat: 6:00 AM" : "திங்கள் முதல் சனி வரை: காலை 6:00 மணி"}
                            </span>
                        </div>
                    </>
                ) : (
                    liveTimings.map((item) => (
                        <div key={item._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-stone-100/50 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-serif font-bold text-stone-800 text-base">{item.titleTamil}</span>
                                <span className="text-[11px] text-stone-500 font-medium mt-0.5">{item.dayTamil} &bull; {item.placeNameTamil}</span>
                            </div>
                            <span className={`px-4 py-1 rounded-full text-xs font-bold self-start sm:self-center border ${item.massTypeTamil === "சிறப்பு திருப்பலி"
                                ? "text-rose-700 bg-rose-50 border-rose-200"
                                : "text-stone-800 bg-stone-200 border-stone-300"
                                }`}>
                                {item.timeTamil}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}