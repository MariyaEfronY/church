"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { Heart, Send, CheckCircle2, Sparkles, CreditCard, Plus, X, Calendar, UserPlus } from "lucide-react";

export default function PrayerRequestPage() {
    const { t, lang } = useLang();

    // Core Schema Input States
    const [intention, setIntention] = useState("");
    const [candidateNames, setCandidateNames] = useState<string[]>([]);
    const [currentCandidate, setCurrentCandidate] = useState("");
    const [deliveredAt, setDeliveredAt] = useState("");

    // App Control States
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Dynamic Context Translations with Local Fallbacks
    const pageStrings = t?.prayerRequestPage || {
        title: lang === "en" ? "Submit a Prayer Request" : "ஜெப விண்ணப்பம் சமர்ப்பிக்கவும்",
        subtitle: lang === "en"
            ? "Bring your personal intentions to our parish community intercession stack and liturgy celebrations."
            : "உங்கள் தனிப்பட்ட விண்ணப்பங்களை எங்கள் பங்குக் குழுமத்தின் கூட்டுப் பிரார்த்தனை மற்றும் பலிபீட ஜெபங்களில் சேர்த்திடுங்கள்.",
        labelIntention: lang === "en" ? "Prayer Intention Description (Optional)" : "ஜெப விண்ணப்ப விபரம் (விருப்பத்தேர்வு)",
        placeholderIntention: lang === "en" ? "Write details of your spiritual request here..." : "உங்கள் ஆன்மீக விண்ணப்பத்தின் விபரங்களை இங்கே எழுதவும்...",
        labelCandidates: lang === "en" ? "Names of Candidates to Pray For" : "ஜெபிக்க வேண்டியவர்களின் பெயர்கள்",
        placeholderCandidate: lang === "en" ? "Type individual name..." : "நபரின் பெயரை டைப் செய்யவும்...",
        btnAddCandidate: lang === "en" ? "Add" : "சேர்",
        labelDeliveryDate: lang === "en" ? "Target Celebration Date (Optional)" : "நிறைவேற்றப்பட வேண்டிய நாள் (விருப்பத்தேர்வு)",
        paymentTitle: lang === "en" ? "Future Offering Gateway Integration Ready" : "காணிக்கை கட்டண வசதி விரைவில் இணைக்கப்படும்",
        paymentNotice: lang === "en"
            ? "Mass Intention Offerings & online gateway options will be configurable here soon."
            : "திருப்பலி காணிக்கைகள் மற்றும் ஆன்லைன் கட்டண முறைகள் விரைவில் இங்கே இணைக்கப்படும்.",
        buttonSubmit: lang === "en" ? "Send to Intercessions Stack" : "ஜெப பீடத்தில் சமர்ப்பிக்கவும்",
        buttonSending: lang === "en" ? "Transmitting Intention..." : "விண்ணப்பம் அனுப்பப்படுகிறது...",
        successTitle: lang === "en" ? "Intention Received" : "விண்ணப்பம் பெறப்பட்டது",
        successSubtitle: lang === "en"
            ? "Your request has been securely forwarded to Father. Peace be with you."
            : "உங்கள் ஜெப விண்ணப்பம் தந்தை அவர்களிடம் பாதுகாப்பாக ஒப்படைக்கப்பட்டுள்ளது. சமாதானம் உங்களோடு இருப்பதாக.",
        resetLink: lang === "en" ? "Submit another intention" : "மற்றொரு விண்ணப்பத்தை அனுப்பவும்"
    };

    // Chip management actions for candidate arrays
    const handleAddCandidate = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentCandidate.trim() !== "") {
            setCandidateNames(prev => [...prev, currentCandidate.trim()]);
            setCurrentCandidate("");
        }
    };

    const handleRemoveCandidate = (indexToRemove: number) => {
        setCandidateNames(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const response = await fetch("/api/prayer-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    intention: intention || "",
                    candidateNames: candidateNames,
                    deliveredAt: deliveredAt || null,
                    lang,
                    paymentStatus: "None",
                    amountPaid: 0,
                    paymentIntentId: null
                }),
            });

            const result = await response.json();
            if (result.success) {
                setSubmitted(true);
                setIntention("");
                setCandidateNames([]);
                setDeliveredAt("");
            } else {
                setErrorMsg(result.message);
            }
        } catch (error) {
            setErrorMsg(lang === "ta" ? "இணைப்பு பிழை ஏற்பட்டது." : "A network pipeline latency error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0a0a] text-stone-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Liturgical Heading Typography */}
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Heart className="w-6 h-6 animate-pulse" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
                        {pageStrings.title}
                    </h1>
                    <p className="text-stone-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
                        {pageStrings.subtitle}
                    </p>
                </div>

                {/* Container Form Card */}
                <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800/80 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
                    {submitted ? (
                        <div className="text-center py-10 space-y-4 animate-fade-in">
                            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-white tracking-wide">{pageStrings.successTitle}</h3>
                            <p className="text-stone-400 text-xs max-w-md mx-auto leading-relaxed">{pageStrings.successSubtitle}</p>
                            <button onClick={() => setSubmitted(false)} className="mt-4 text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer">
                                {pageStrings.resetLink}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* 👥 Candidate Name Array Input Block */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-stone-400 uppercase tracking-wider font-sans flex items-center gap-2">
                                    <UserPlus className="w-3.5 h-3.5 text-amber-500/60" />
                                    <span>{pageStrings.labelCandidates}</span>
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentCandidate}
                                        onChange={(e) => setCurrentCandidate(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCandidate(e as any); } }}
                                        placeholder={pageStrings.placeholderCandidate}
                                        className="flex-1 bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-700 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCandidate}
                                        className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition-all flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>{pageStrings.btnAddCandidate}</span>
                                    </button>
                                </div>

                                {/* Active Candidate Chips */}
                                {candidateNames.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {candidateNames.map((name, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium animate-fade-in">
                                                <span>{name}</span>
                                                <button type="button" onClick={() => handleRemoveCandidate(idx)} className="hover:text-rose-400 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 📅 Delivery / Celebration Date Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-stone-400 uppercase tracking-wider font-sans flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-amber-500/60" />
                                    <span>{pageStrings.labelDeliveryDate}</span>
                                </label>
                                <input
                                    type="date"
                                    value={deliveredAt}
                                    onChange={(e) => setDeliveredAt(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-stone-100 outline-none transition-all color-scheme-dark"
                                    style={{ colorScheme: "dark" }} // Forces dark-themed calendar popup context in modern browsers
                                />
                            </div>

                            {/* Text Input Intention Area */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-wider font-sans">
                                        {pageStrings.labelIntention}
                                    </label>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500/40" />
                                </div>
                                <textarea
                                    rows={4}
                                    value={intention}
                                    onChange={(e) => setIntention(e.target.value)}
                                    placeholder={pageStrings.placeholderIntention}
                                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-700 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Offering Pipeline Alert */}
                            <div className="p-4 bg-stone-950 border border-stone-800/60 rounded-xl flex items-start gap-3 opacity-60">
                                <CreditCard className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <div className="text-[11px] text-stone-400 font-medium leading-relaxed">
                                    <span className="font-bold text-stone-300 block mb-0.5">{pageStrings.paymentTitle}</span>
                                    <span>{pageStrings.paymentNotice}</span>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl text-xs text-red-400 font-medium animate-fade-in">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Action Button Trigger */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-stone-950 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                            >
                                <Send className={`w-3.5 h-3.5 ${loading ? "animate-pulse" : ""}`} />
                                <span>{loading ? pageStrings.buttonSending : pageStrings.buttonSubmit}</span>
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}