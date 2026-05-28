"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock, Heart, RefreshCw, Languages, BookmarkCheck, Inbox, AlertCircle } from "lucide-react";

interface PrayerRequestItem {
    _id: string;
    intention: string;
    lang: "en" | "ta";
    paymentStatus: "None" | "Pending" | "Paid";
    amountPaid?: number;
    priestStatus: "Pending" | "Accepted" | "Completed" | "Rejected";
    createdAt: string;
}

export default function PriestDashboard() {
    const [requests, setRequests] = useState<PrayerRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // 1. Fetch data from your API stream route
    const fetchRequests = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            // Updated to point safely to your matching API route file configuration
            const res = await fetch("/api/priest/prayer-request-priest");
            const json = await res.json();
            if (json.success) {
                setRequests(json.data);
            } else {
                setErrorMsg(json.message || "Failed to load intentions registry.");
            }
        } catch (err: any) {
            console.error("Fetch failure:", err);
            setErrorMsg("A network communication error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // 2. Safely synchronize updates directly to the MongoDB backend via PATCH
    const updatePriestAction = async (id: string, nextStatus: "Accepted" | "Completed" | "Rejected") => {
        setUpdatingId(id);
        try {
            const res = await fetch("/api/priest/prayer-request-priest", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, priestStatus: nextStatus })
            });
            const json = await res.json();

            if (json.success) {
                // Optimistically map layout array values over client-side cache data trees instantly
                setRequests(prev =>
                    prev.map(item =>
                        item._id === id ? { ...item, priestStatus: json.data.priestStatus } : item
                    )
                );
            }
        } catch (err) {
            console.error("Operational update failed:", err);
        } finally {
            setUpdatingId(null);
        }
    };

    // Liturgical-themed dynamic badge state generator mappings
    const getPriestBadgeColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]";
            case "Accepted":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]";
            case "Rejected":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default:
                return "bg-stone-800 text-stone-400 border-stone-700";
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0707] text-stone-100 p-4 sm:p-6 md:p-10 selection:bg-amber-500/30 selection:text-amber-200">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Upper Altar Workspace Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                            <Heart className="w-3.5 h-3.5 fill-amber-500" />
                            <span>Sacred Sanctuary Interface</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-serif font-black text-white tracking-tight">
                            Mass Intentions Console
                        </h1>
                    </div>
                    <button
                        onClick={fetchRequests}
                        disabled={loading}
                        className="self-start sm:self-center px-4 py-2.5 bg-stone-950 hover:bg-stone-900 border border-stone-800 rounded-xl text-xs font-bold text-stone-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 shadow-sm"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${loading ? 'animate-spin' : ''}`} />
                        <span>Sync Registries</span>
                    </button>
                </div>

                {/* Error Monitoring Banner */}
                {errorMsg && (
                    <div className="p-4 bg-rose-950/20 border border-rose-900/30 text-rose-400 rounded-xl text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Content View Routing Handler */}
                {loading && requests.length === 0 ? (
                    <div className="text-center py-24 text-xs font-mono tracking-widest text-stone-500 animate-pulse">
                        STREAMING INTENTIONS FROM SACRED DATABASE...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-stone-900 rounded-2xl bg-stone-950/10">
                        <Inbox className="w-8 h-8 text-stone-800 mx-auto mb-3" />
                        <p className="text-sm font-medium text-stone-500">No prayer intentions found inside the database pool.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className={`bg-stone-900/20 border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all relative overflow-hidden ${req.priestStatus === "Completed"
                                    ? "opacity-50 border-stone-950 bg-stone-950/10"
                                    : req.priestStatus === "Rejected"
                                        ? "opacity-40 border-stone-950 line-through decoration-stone-800"
                                        : "border-stone-800/60 hover:border-stone-800 hover:bg-stone-900/30 shadow-md"
                                    }`}
                            >
                                {/* Intention Information Block */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-2 bg-stone-950 px-2.5 py-1 rounded-lg text-[10px] font-mono border border-stone-900 text-stone-400">
                                            <Languages className="w-3 h-3 text-amber-500/80" />
                                            <span>{req.lang === "ta" ? "தமிழ் (TAMIL)" : "ENGLISH"}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPriestBadgeColor(req.priestStatus)}`}>
                                            {req.priestStatus}
                                        </span>
                                    </div>
                                    <p className={`text-sm text-stone-200 leading-relaxed tracking-wide ${req.lang === "ta" ? "font-sans font-medium" : "font-serif"
                                        }`}>
                                        "{req.intention}"
                                    </p>
                                </div>

                                {/* Bottom Meta Rows & Interactive Button Action Triggers */}
                                <div className="flex items-center justify-between border-t border-stone-950 pt-4">
                                    <span className="text-stone-500 text-[10px] font-mono flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-stone-600" />
                                        <span>{new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </span>

                                    {/* Action Handler Pipeline Context Routing Buttons */}
                                    <div className="flex items-center gap-2">
                                        {req.priestStatus === "Pending" && (
                                            <>
                                                <button
                                                    disabled={updatingId !== null}
                                                    onClick={() => updatePriestAction(req._id, "Rejected")}
                                                    className="p-2 bg-stone-950 hover:bg-rose-950/40 text-stone-500 hover:text-rose-400 border border-stone-900 hover:border-rose-900/30 rounded-xl transition-all cursor-pointer disabled:opacity-30"
                                                    title="Reject Request"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    disabled={updatingId !== null}
                                                    onClick={() => updatePriestAction(req._id, "Accepted")}
                                                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 border border-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-30"
                                                >
                                                    <BookmarkCheck className="w-3.5 h-3.5" />
                                                    <span>Accept</span>
                                                </button>
                                            </>
                                        )}
                                        {req.priestStatus === "Accepted" && (
                                            <button
                                                disabled={updatingId !== null}
                                                onClick={() => updatePriestAction(req._id, "Completed")}
                                                className="w-full px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-stone-950 border border-emerald-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-30 shadow-[0_0_15px_rgba(16,185,129,0.02)]"
                                            >
                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                <span>Mark Celebrated</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}