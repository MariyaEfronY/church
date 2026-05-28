"use client";

import { useState } from "react";
import { Heart, Send, CheckCircle2, Sparkles, Languages, CreditCard } from "lucide-react";

const i18n = {
    en: {
        title: "Submit a Prayer Request",
        subtitle: '"For where two or three are gathered in my name, there am I among them." Bring your intentions to our parish community and clergy intercessions.',
        label: "Your Prayer Intention",
        placeholder: "Write your personal prayer request details here...",
        paymentNotice: "Mass Intention Offerings & online gateway options will be configurable here soon.",
        buttonSubmit: "Send to Intercessions Stack",
        buttonSending: "Transmitting Intention...",
        successTitle: "Intention Received",
        successSubtitle: "Your prayer request has been securely forwarded to Father and entered into our pastoral intercession stream. Peace be with you.",
        resetLink: "Submit another intention"
    },
    ta: {
        title: "ஜெப விண்ணப்பம் சமர்ப்பிக்கவும்",
        subtitle: '"இரண்டு அல்லது மூன்று பேர் என் நாமத்தினால் எங்கே கூடியிருக்கிறார்களோ, அங்கே அவர்கள் மத்தியில் நான் இருக்கிறேன்." உங்கள் விண்ணப்பங்களை எங்கள் பங்குக் குழுமத்தின் ஜெபங்களில் சேர்த்திடுங்கள்.',
        label: "உங்கள் ஜெப விண்ணப்பம்",
        placeholder: "உங்கள் தனிப்பட்ட ஜெப விண்ணப்ப விபரங்களை இங்கே எழுதவும்...",
        paymentNotice: "திருப்பலி காணிக்கைகள் மற்றும் ஆன்லைன் கட்டண முறைகள் விரைவில் இங்கே இணைக்கப்படும்.",
        buttonSubmit: "ஜெப பீடத்தில் சமர்ப்பிக்கவும்",
        buttonSending: "விண்ணப்பம் அனுப்பப்படுகிறது...",
        successTitle: "விண்ணப்பம் பெறப்பட்டது",
        successSubtitle: "உங்கள் ஜெப விண்ணப்பம் தந்தை அவர்களிடம் பாதுகாப்பாக ஒப்படைக்கப்பட்டு, பங்கின் கூட்டுப் பிரார்த்தனை அலைவரிசையில் சேர்க்கப்பட்டுள்ளது. சமாதானம் உங்களோடு இருப்பதாக.",
        resetLink: "மற்றொரு விண்ணப்பத்தை அனுப்பவும்"
    }
};

export default function PrayerRequestPage() {
    const [lang, setLang] = useState<"en" | "ta">("en");
    const [intention, setIntention] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const t = i18n[lang];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const response = await fetch("/api/prayer-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    intention,
                    lang,
                    // 💸 Prepared Default values for current free submission path
                    paymentStatus: "None",
                    amountPaid: 0,
                    paymentIntentId: null
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitted(true);
                setIntention("");
            } else {
                setErrorMsg(result.message);
            }
        } catch (error) {
            setErrorMsg(lang === "ta" ? "இணைப்பு பிழை ஏற்பட்டது." : "A network latency error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0a0a] text-stone-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* 🌐 Language Switcher Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => setLang(lang === "en" ? "ta" : "en")}
                        className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-full text-xs font-semibold text-amber-400 hover:bg-stone-800 hover:text-amber-300 transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                        <Languages className="w-3.5 h-3.5" />
                        <span>{lang === "en" ? "தமிழ் மொழிக்கு மாறவும்" : "Switch to English"}</span>
                    </button>
                </div>

                {/* Typography Header */}
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Heart className="w-6 h-6 animate-pulse" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-stone-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
                        {t.subtitle}
                    </p>
                </div>

                {/* Form Card Layout */}
                <div className="bg-stone-900/50 backdrop-blur-md border border-stone-800/80 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">

                    {submitted ? (
                        <div className="text-center py-10 space-y-4 animate-fade-in">
                            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-white tracking-wide">{t.successTitle}</h3>
                            <p className="text-stone-400 text-xs max-w-md mx-auto leading-relaxed">
                                {t.successSubtitle}
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-4 text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                            >
                                {t.resetLink}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Text Input Unit */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-wider font-sans">
                                        {t.label}
                                    </label>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500/40" />
                                </div>
                                <textarea
                                    rows={6}
                                    required
                                    value={intention}
                                    onChange={(e) => setIntention(e.target.value)}
                                    placeholder={t.placeholder}
                                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-700 outline-none transition-all duration-300 resize-none"
                                />
                            </div>

                            {/* 💳 Future Payment Placeholder Block */}
                            <div className="p-4 bg-stone-950 border border-stone-800/60 rounded-xl flex items-start gap-3 opacity-60">
                                <CreditCard className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-stone-400 font-medium leading-relaxed">
                                    <span className="font-bold text-stone-300 block mb-0.5">
                                        {lang === "en" ? "Future Payment Gateway Integration Ready" : "கட்டண வசதி விரைவில் இணைக்கப்படும்"}
                                    </span>
                                    {t.paymentNotice}
                                </p>
                            </div>

                            {errorMsg && (
                                <div className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl text-xs text-red-400 font-medium">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-stone-950 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider font-sans transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>{loading ? t.buttonSending : t.buttonSubmit}</span>
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}