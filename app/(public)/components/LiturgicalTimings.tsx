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
                    // Pull only actively flagged mass timing records to display cleanly
                    const visibleSchedules = result.data.filter((item: any) => item.active !== false);
                    setLiveTimings(visibleSchedules);
                }
            } catch (error) {
                console.error("Failed loading public liturgy grid mapping", error);
            }
        };
        fetchSchedules();
    }, []);

    return (
        <section className="max-w-3xl mx-auto px-4 pt-24">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-100 text-center mb-8 flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="tracking-tight">{t.massTimingsTitle}</span>
            </h2>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-800/60 backdrop-blur-xs">
                {liveTimings.length === 0 ? (
                    /* Fallback UI if DB is empty */
                    <>
                        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/80 transition-colors">
                            <span className="font-serif font-semibold text-slate-200 text-base md:text-lg">{t.massSunday}</span>
                            <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1 rounded-full text-xs font-medium self-start sm:self-center">
                                {lang === "en" ? "6:30 AM | 8:30 AM | 5:30 PM" : "காலை 6:30 | காலை 8:30 | மாலை 5:30"}
                            </span>
                        </div>
                        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/80 transition-colors">
                            <span className="font-serif font-semibold text-slate-200 text-base md:text-lg">{t.massWeekday}</span>
                            <span className="text-slate-400 bg-slate-800 border border-slate-700/50 px-4 py-1 rounded-full text-xs font-medium self-start sm:self-center">
                                {lang === "en" ? "Monday - Saturday: 6:00 AM" : "திங்கள் முதல் சனி வரை: காலை 6:00 மணி"}
                            </span>
                        </div>
                    </>
                ) : (
                    /* Dynamic DB Data rendering mapping structure */
                    liveTimings.map((item) => (
                        <div key={item._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/80 transition-colors">
                            <div className="flex flex-col gap-0.5">
                                <span className="font-serif font-semibold text-slate-200 text-base md:text-lg">
                                    {item.titleTamil}
                                </span>
                                <span className="text-[11px] text-slate-500 tracking-wide font-light">
                                    {item.dayTamil} &bull; {item.placeNameTamil}
                                </span>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center tracking-wide border ${item.massTypeTamil === "சிறப்பு திருப்பலி"
                                ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                : "text-amber-400 bg-amber-500/10 border-amber-500/20"
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