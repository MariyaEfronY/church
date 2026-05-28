"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock, Heart, RefreshCw, Languages, BookmarkCheck } from "lucide-react";

interface PrayerRequestItem {
    _id: string;
    intention: string;
    lang: "en" | "ta";
    paymentStatus: string;
    priestStatus: "Pending" | "Accepted" | "Completed" | "Rejected";
    createdAt: string;
}

export default function PriestDashboard() {
    const [requests, setRequests] = useState<PrayerRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/priest/prayer-request-priest");
            const json = await res.json();
            if (json.success) setRequests(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const updatePriestAction = async (id: string, nextStatus: "Accepted" | "Completed" | "Rejected") => {
        setUpdatingId(id);
        try {
            const res = await fetch("/api/admin/prayer-requests", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, priestStatus: nextStatus })
            });
            const json = await res.json();
            if (json.success) {
                setRequests(prev => prev.map(item => item._id === id ? { ...item, priestStatus: json.data.priestStatus } : item));
            }
        } catch (err) {
            console.error(err);
        } biographical: { setUpdatingId(null); }
    };

    const getPriestBadgeColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Accepted": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "Rejected": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0a0a] text-stone-100 p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex justify-between items-center border-b border-stone-900 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest">
                            <Heart className="w-3.5 h-3.5 fill-amber-500" />
                            <span>Altar Interface</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-serif font-black text-white">Priest Status Panel</h1>
                    </div>
                    <button onClick={fetchRequests} className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs font-bold flex items-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Sync</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {requests.map((req) => (
                        <div key={req._id} className={`bg-stone-900/30 border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all ${req.priestStatus === "Completed" ? "opacity-60 border-stone-950" : "border-stone-800/80"
                            }`}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 bg-stone-950 px-2.5 py-1 rounded-lg text-[10px] font-mono border border-stone-800 text-stone-400">
                                        <Languages className="w-3 h-3 text-amber-500" />
                                        <span>{req.lang === "ta" ? "தமிழ்" : "ENGLISH"}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPriestBadgeColor(req.priestStatus)}`}>
                                        Priest: {req.priestStatus}
                                    </span>
                                </div>
                                <p className="text-sm text-stone-200 font-serif leading-relaxed">"{req.intention}"</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-stone-950/60 pt-4">
                                <span className="text-stone-500 text-[10px] font-mono flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </span>

                                {/* Context Action Buttons */}
                                <div className="flex gap-2">
                                    {req.priestStatus === "Pending" && (
                                        <>
                                            <button onClick={() => updatePriestAction(req._id, "Rejected")} className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-stone-950 border border-rose-500/20 rounded-xl text-xs font-bold transition-all">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => updatePriestAction(req._id, "Accepted")} className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 border border-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all">
                                                <BookmarkCheck className="w-3.5 h-3.5" />
                                                <span>Accept</span>
                                            </button>
                                        </>
                                    )}
                                    {req.priestStatus === "Accepted" && (
                                        <button onClick={() => updatePriestAction(req._id, "Completed")} className="w-full px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-stone-950 border border-emerald-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            <span>Mark Celebrated</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}