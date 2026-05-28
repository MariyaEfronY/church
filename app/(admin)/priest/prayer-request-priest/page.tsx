"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Check, X, Clock, Heart, RefreshCw, Languages,
    BookmarkCheck, Inbox, AlertCircle, Calendar, User, Info, CheckCircle2
} from "lucide-react";

interface PrayerRequestItem {
    _id: string;
    intention?: string;
    candidateNames: string[];
    lang: "en" | "ta";
    paymentStatus: "None" | "Pending" | "Paid";
    amountPaid?: number;
    priestStatus: "Pending" | "Accepted" | "Prayed" | "Rejected";
    deliveredAt?: string;
    reviewedAt?: string;
    createdAt: string;
}

export default function PriestDashboard() {
    const [requests, setRequests] = useState<PrayerRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Filter control states
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [deliveredDateFilter, setDeliveredDateFilter] = useState<string>("");
    const [reviewedDateFilter, setReviewedDateFilter] = useState<string>("");

    // 1. Fetch data from your exact API stream route with active filter parameters
    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const queryParams = new URLSearchParams();
            if (statusFilter) queryParams.append("priestStatus", statusFilter);
            if (deliveredDateFilter) queryParams.append("deliveredAt", deliveredDateFilter);
            if (reviewedDateFilter) queryParams.append("reviewedAt", reviewedDateFilter);

            const queryString = queryParams.toString();
            const url = `/api/priest/prayer-request-priest${queryString ? `?${queryString}` : ""}`;

            const res = await fetch(url);

            if (!res.ok) throw new Error(`Server returned status code: ${res.status}`);

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("API returned an unexpected response format. Please verify your routing paths.");
            }

            const json = await res.json();
            if (json.success) {
                setRequests(json.data);
            } else {
                setErrorMsg(json.message || "Failed to load intentions registry.");
            }
        } catch (err: any) {
            console.error("Fetch failure:", err);
            setErrorMsg(err.message || "A network communication error occurred.");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, deliveredDateFilter, reviewedDateFilter]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Reset all filtration parameter settings back to empty states
    const resetFilters = () => {
        setStatusFilter("");
        setDeliveredDateFilter("");
        setReviewedDateFilter("");
    };

    // 2. Synchronize status updates directly to MongoDB backend via PATCH
    const updatePriestAction = async (id: string, nextStatus: "Accepted" | "Prayed" | "Rejected") => {
        setUpdatingId(id);
        try {
            const res = await fetch("/api/priest/prayer-request-priest", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, priestStatus: nextStatus })
            });
            const json = await res.json();

            if (json.success) {
                // Instantly update client cache state matching layout
                setRequests(prev =>
                    prev.map(item =>
                        item._id === id
                            ? { ...item, priestStatus: json.data.priestStatus, reviewedAt: json.data.reviewedAt }
                            : item
                    )
                );
            }
        } catch (err) {
            console.error("Operational update failed:", err);
        } finally {
            setUpdatingId(null);
        }
    };

    // Bilingual liturgical operational label dynamic translations
    const translateStatus = (status: string, lang: "en" | "ta") => {
        const dictionary = {
            Pending: { en: "Pending", ta: "காத்திருக்கிறது" },
            Accepted: { en: "Accepted", ta: "ஏற்கப்பட்டது" },
            Prayed: { en: "Prayed", ta: "ஜெபிக்கப்பட்டது" },
            Rejected: { en: "Rejected", ta: "நிராகரிக்கப்பட்டது" }
        };
        return dictionary[status as keyof typeof dictionary]?.[lang] || status;
    };

    const getPriestBadgeColor = (status: string) => {
        switch (status) {
            case "Prayed":
                return "bg-emerald-50 text-emerald-800 border-emerald-100 shadow-2xs";
            case "Accepted":
                return "bg-amber-50 text-amber-900 border-amber-200 shadow-2xs";
            case "Rejected":
                return "bg-rose-50 text-rose-700 border-rose-100";
            default:
                return "bg-stone-50 text-stone-600 border-stone-200";
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in px-4 sm:px-6">

            {/* Liturgical Altar Workspace Header Banner */}
            <header className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                        <Heart className="w-6 h-6 fill-amber-800/10" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">
                            ⛪ திருப்பலி கருத்துக்கள் மேலாண்மை
                        </h1>
                        <p className="text-xs md:text-sm text-stone-500 mt-0.5">
                            Manage and review parish prayer intentions and intercession schedules.
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchRequests}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 bg-[#4a0e17] hover:bg-[#3a0a10] text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50 self-start sm:self-center"
                >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
                    <span>தரவை புதுப்பி (Sync)</span>
                </button>
            </header>

            {/* 🎛️ Filtration Control Desk Panel */}
            <div className="bg-white shadow-xs rounded-2xl p-5 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">நிலை (Status)</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-stone-50/50 border border-stone-200 focus:border-amber-600 focus:bg-white rounded-xl px-3 py-2 text-sm text-stone-800 outline-none transition-all"
                    >
                        <option value="">எல்லாம் (All Statuses)</option>
                        <option value="Pending">Pending (காத்திருக்கிறது)</option>
                        <option value="Accepted">Accepted (ஏற்கப்பட்டது)</option>
                        <option value="Prayed">Prayed (ஜெபிக்கப்பட்டது)</option>
                        <option value="Rejected">Rejected (நிராகரிக்கப்பட்டது)</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">திருப்பலி நாள் (Mass Date)</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
                        <input
                            type="date"
                            value={deliveredDateFilter}
                            onChange={(e) => setDeliveredDateFilter(e.target.value)}
                            className="w-full bg-stone-50/50 border border-stone-200 focus:border-amber-600 focus:bg-white rounded-xl pl-9 pr-3 py-2 text-sm text-stone-700 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">பரிசீலனை நாள் (Review Date)</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
                        <input
                            type="date"
                            value={reviewedDateFilter}
                            onChange={(e) => setReviewedDateFilter(e.target.value)}
                            className="w-full bg-stone-50/50 border border-stone-200 focus:border-amber-600 focus:bg-white rounded-xl pl-9 pr-3 py-2 text-sm text-stone-700 outline-none transition-all"
                        />
                    </div>
                </div>

                {(statusFilter || deliveredDateFilter || reviewedDateFilter) ? (
                    <button
                        onClick={resetFilters}
                        className="w-full py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 text-xs font-bold rounded-xl transition-all cursor-pointer h-[38px]"
                    >
                        வடிகட்டிகளை நீக்கு (Clear)
                    </button>
                ) : (
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-2.5 text-xs text-stone-400 font-medium italic">
                        <Info className="w-3.5 h-3.5 text-amber-700/50" />
                        <span>வரிசை: புதியவை முதலில்</span>
                    </div>
                )}
            </div>

            {/* Error Monitoring Banner */}
            {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Content View Pipeline Layout Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                    <h3 className="font-serif font-bold text-stone-800 text-base">
                        விண்ணப்பங்கள் பட்டியல் ({requests.length})
                    </h3>
                </div>

                {loading && requests.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 text-stone-400 text-sm italic animate-pulse tracking-wide font-serif">
                        தரவுத்தளத்திலிருந்து விவரங்கள் பெறப்படுகின்றன...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm font-light">
                        <Inbox className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                        விண்ணப்பங்கள் எதுவும் காணப்படவில்லை.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className={`bg-white rounded-2xl p-5 border shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-5 relative overflow-hidden ${req.priestStatus === "Prayed"
                                    ? "opacity-60 border-stone-200 bg-stone-50/40"
                                    : req.priestStatus === "Rejected"
                                        ? "opacity-50 border-stone-200 bg-stone-50/30 line-through decoration-stone-300"
                                        : "border-stone-200/80 hover:border-stone-300"
                                    }`}
                            >
                                <div className="space-y-4">
                                    {/* Card Header Information Subrow */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                {req.lang === "ta" ? "தமிழ்" : "ENGLISH"}
                                            </span>
                                            {req.paymentStatus === "Paid" && (
                                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Offer Paid
                                                </span>
                                            )}
                                        </div>

                                        {/* Status Layout Badges */}
                                        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0.5">
                                            <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${getPriestBadgeColor(req.priestStatus)}`}>
                                                {translateStatus(req.priestStatus, "en")}
                                            </span>
                                            <span className="text-[10px] text-stone-400 font-sans px-1">
                                                ({translateStatus(req.priestStatus, "ta")})
                                            </span>
                                        </div>
                                    </div>

                                    {/* 👥 Dynamic Intercession Candidate List */}
                                    {req.candidateNames && req.candidateNames.length > 0 && (
                                        <div className="space-y-1.5 pl-3 border-l-2 border-stone-200">
                                            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1">
                                                <User className="w-3 h-3 text-amber-800/60" />
                                                <span>{req.lang === "ta" ? "ஜெபிக்க வேண்டியவர்கள்:" : "Intercession For:"}</span>
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {req.candidateNames.map((name, i) => (
                                                    <span key={i} className="text-xs bg-stone-50 border border-stone-200 px-2.5 py-0.5 rounded-lg text-stone-700 font-medium">
                                                        {name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Intention Text Area String */}
                                    {req.intention && (
                                        <div className="pl-3 border-l-2 border-amber-600/40">
                                            <p className={`text-base font-serif italic text-stone-900 leading-relaxed ${req.lang === "ta" ? "font-sans font-medium" : ""
                                                }`}>
                                                "{req.intention}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Target Execution Date Display Badge */}
                                    {req.deliveredAt && (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-950 border border-amber-200/60 w-fit">
                                            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-amber-800" />
                                            <span>
                                                {req.lang === "ta" ? "நிறைவேற்றப்படும் நாள்: " : "Mass Target Date: "}
                                                {new Date(req.deliveredAt).toLocaleDateString("ta-IN", {
                                                    year: "numeric", month: "long", day: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Structural Layout Timeline Info & Interactive Actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-stone-100 pt-3 gap-3">
                                    <div className="flex flex-col gap-0.5 text-stone-400 font-mono text-[11px]">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-stone-300" />
                                            <span>பதிவு: {new Date(req.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                                        </span>
                                        {req.reviewedAt && (
                                            <span className="text-[10px] text-stone-400 pl-4.5">
                                                மாற்றம்: {new Date(req.reviewedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Controller Path Modifiers */}
                                    <div className="flex items-center justify-end gap-2">
                                        {req.priestStatus === "Pending" && (
                                            <>
                                                <button
                                                    disabled={updatingId !== null}
                                                    onClick={() => updatePriestAction(req._id, "Rejected")}
                                                    className="inline-flex items-center justify-center p-2 text-xs font-semibold bg-stone-50 hover:bg-rose-50 hover:text-rose-700 border border-stone-200 rounded-xl text-stone-600 transition-colors cursor-pointer h-9 w-9 disabled:opacity-40"
                                                    title="Reject Intent"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <button
                                                    disabled={updatingId !== null}
                                                    onClick={() => updatePriestAction(req._id, "Accepted")}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#4a0e17] hover:bg-[#3a0a10] border border-transparent rounded-xl text-white transition-colors cursor-pointer h-9 disabled:opacity-40 shadow-xs"
                                                >
                                                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                                                    <span>ஏற்றுக்கொள் (Accept)</span>
                                                </button>
                                            </>
                                        )}
                                        {req.priestStatus === "Accepted" && (
                                            <button
                                                disabled={updatingId !== null}
                                                onClick={() => updatePriestAction(req._id, "Prayed")}
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 border border-transparent rounded-xl text-white transition-colors cursor-pointer h-9 disabled:opacity-40 shadow-xs"
                                            >
                                                <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
                                                <span>நிறைவேற்றப்பட்டது (Mark Prayed)</span>
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