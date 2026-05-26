// "use client";

// import { useState, useEffect } from "react";
// import { Heart, Flame, Tv, Phone, Calendar, BookOpen, Sparkles, Clock } from "lucide-react";

// // Import both translation dictionaries
// import en from "../locales/en.json";
// import ta from "../locales/ta.json";

// export default function PublicHomePage() {
//     const [lang, setLang] = useState<"en" | "ta">("en");

//     // Listen for language changes emitted by the layout switcher button
//     useEffect(() => {
//         const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
//             setLang(e.detail);
//         };

//         window.addEventListener("church-lang-change" as any, handleLangChange);

//         // Check initial language stored or set on layout mount
//         const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
//         // eslint-disable-next-line react-hooks/set-state-in-effect
//         if (savedLang) setLang(savedLang);

//         return () => {
//             window.removeEventListener("church-lang-change" as any, handleLangChange);
//         };
//     }, []);

//     // Pick the active translation dictionary dynamically
//     const t = lang === "en" ? en : ta;

//     // Localized spiritual card variables matching selected language states
//     const dailyDevotion = {
//         verse: lang === "en"
//             ? '"I can do all things through Christ who strengthens me." — Philippians 4:13'
//             : '"எனக்கு வலுவூட்டுகிறவராலே எல்லாவற்றையும் செய்ய எனக்கு ஆற்றல் உண்டு." — பிலிப்பியர் 4:13',
//         saintDesc: lang === "en"
//             ? "Known for her 'little way' of doing ordinary tasks with extraordinary love."
//             : "அசாதாரணமான அன்புடன் சாதாரண காரியங்களைச் செய்யும் தன் 'சிறு வழி'-க்காக அறியப்பட்டவர்.",
//         saintName: lang === "en" ? "St. Thérèse of Lisieux" : "புனித சின்னப் புஷ்பம் (தெரசா)",
//         thought: lang === "en"
//             ? '"Kind words can be short and easy to speak, but their echoes are truly endless."'
//             : '"அன்பான வார்த்தைகள் சுருக்கமாகவும் பேச எளிதாகவும் இருக்கலாம், ஆனால் அவற்றின் எதிரொலிகள் உண்மையிலேயே எல்லையற்றவை."'
//     };

//     return (
//         <div className="pb-20">
//             {/* Announcement Feast Banner */}
//             <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-3 text-center text-xs md:text-sm font-medium flex items-center justify-center gap-2 shadow-inner transition-all">
//                 <Calendar className="w-4 h-4 flex-shrink-0" />
//                 <span>{t.feastBanner}</span>
//             </div>

//             {/* Hero Header Space */}
//             <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
//                 <div
//                     className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-102"
//                     style={{
//                         backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1548625361-155defe219f2?q=80&w=1600')`
//                     }}
//                 />
//                 <div className="relative z-10 max-w-4xl mx-auto text-center px-6 flex flex-col items-center gap-4">
//                     <span className="inline-block bg-amber-400/10 backdrop-blur-md border border-amber-400/20 text-amber-300 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase">
//                         {lang === "en" ? "Welcome to Our Home of Grace" : "அருள்மிகு இல்லத்திற்கு உங்களை வரவேற்கிறோம்"}
//                     </span>
//                     <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight transition-all">
//                         {t.parishName}
//                     </h1>
//                     <p className="text-base md:text-lg text-slate-300 font-light max-w-xl italic transition-all">
//                         {t.tagline}
//                     </p>
//                 </div>
//             </header>

//             {/* Overlapping Daily Devotion Section */}
//             <section className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:translate-y-1 transition-all">
//                     <BookOpen className="w-5 h-5 text-amber-600 mb-3" />
//                     <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t.dailyVerse}</h3>
//                     <p className="text-slate-700 font-serif italic text-base">{dailyDevotion.verse}</p>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:translate-y-1 transition-all">
//                     <Flame className="w-5 h-5 text-red-600 mb-3" />
//                     <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t.todaysSaint}</h3>
//                     <p className="text-slate-800 font-bold text-lg">{dailyDevotion.saintName}</p>
//                     <p className="text-slate-500 text-xs mt-1">{dailyDevotion.saintDesc}</p>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:translate-y-1 transition-all">
//                     <Sparkles className="w-5 h-5 text-indigo-600 mb-3" />
//                     <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t.thoughtOfDay}</h3>
//                     <p className="text-slate-600 text-sm italic">{dailyDevotion.thought}</p>
//                 </div>
//             </section>

//             {/* Liturgical Worship Timings Grid */}
//             <section className="max-w-3xl mx-auto px-4 pt-20">
//                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 text-center mb-8 flex items-center justify-center gap-2">
//                     <Clock className="w-5 h-5 text-amber-600" /> {t.massTimingsTitle}
//                 </h2>
//                 <div className="bg-white rounded-2xl shadow-md border border-slate-100 divide-y divide-slate-100 overflow-hidden">
//                     <div className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
//                         <span className="font-semibold text-slate-800 text-base md:text-lg">{t.massSunday}</span>
//                         <span className="text-amber-700 bg-amber-50 px-4 py-1 rounded-full text-sm font-medium self-start sm:self-center">
//                             {lang === "en" ? "6:30 AM | 8:30 AM | 5:30 PM" : "காலை 6:30 | காலை 8:30 | மாலை 5:30"}
//                         </span>
//                     </div>
//                     <div className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
//                         <span className="font-semibold text-slate-800 text-base md:text-lg">{t.massWeekday}</span>
//                         <span className="text-slate-600 bg-slate-100 px-4 py-1 rounded-full text-sm font-medium self-start sm:self-center">
//                             {lang === "en" ? "Monday - Saturday: 6:00 AM" : "திங்கள் முதல் சனி வரை: காலை 6:00 மணி"}
//                         </span>
//                     </div>
//                     <div className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
//                         <span className="font-semibold text-slate-800 text-base md:text-lg">{t.massAdoration}</span>
//                         <span className="text-indigo-700 bg-indigo-50 px-4 py-1 rounded-full text-sm font-medium self-start sm:self-center">
//                             {lang === "en" ? "Every First Friday: 6:00 PM" : "ஒவ்வொரு முதல் வெள்ளி: மாலை 6:00 மணி"}
//                         </span>
//                     </div>
//                 </div>
//             </section>

//             {/* Mobile Actions Container */}
//             <section className="max-w-5xl mx-auto px-4 pt-16">
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                     <a href="#donate" className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-colors gap-3 group">
//                         <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
//                             <Heart className="w-5 h-5" />
//                         </div>
//                         <span className="font-medium text-sm text-slate-800">{t.actions.donate}</span>
//                     </a>

//                     <a href="#prayer" className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-colors gap-3 group">
//                         <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
//                             <Flame className="w-5 h-5" />
//                         </div>
//                         <span className="font-medium text-sm text-slate-800">{t.actions.prayerRequest}</span>
//                     </a>

//                     <a href="#live" className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-colors gap-3 group">
//                         <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
//                             <Tv className="w-5 h-5" />
//                         </div>
//                         <span className="font-medium text-sm text-slate-800">{t.actions.watchLive}</span>
//                     </a>

//                     <a href="#contact" className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-colors gap-3 group">
//                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
//                             <Phone className="w-5 h-5" />
//                         </div>
//                         <span className="font-medium text-sm text-slate-800">{t.actions.contact}</span>
//                     </a>
//                 </div>
//             </section>
//         </div>
//     );
// }


"use client";

import { useState, useEffect } from "react";
import HeroBanner from "./components/HeroBanner";
import DevotionCards from "./components/DevotionCards";
import LiturgicalTimings from "./components/LiturgicalTimings";
import QuickActions from "./components/QuickActions";

import en from "../locales/en.json";
import ta from "../locales/ta.json";

export default function PublicHomePage() {
    const [lang, setLang] = useState<"en" | "ta">("en");

    useEffect(() => {
        const handleLangChange = (e: CustomEvent<"en" | "ta">) => {
            setLang(e.detail);
        };

        window.addEventListener("church-lang-change" as any, handleLangChange);

        const savedLang = localStorage.getItem("church-lang") as "en" | "ta";
        if (savedLang) setLang(savedLang);

        return () => {
            window.removeEventListener("church-lang-change" as any, handleLangChange);
        };
    }, []);

    const t = lang === "en" ? en : ta;

    return (
        <div className="pb-24 bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-amber-500/30 selection:text-amber-200">
            {/* 1. Classic Hero Workspace & Dynamic Announcement */}
            <HeroBanner lang={lang} t={t} />

            {/* 2. Overlapping Spiritual Feed Grid */}
            <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6">
                <DevotionCards lang={lang} t={t} />
            </div>

            {/* 3. Refined Liturgical Mass Matrix */}
            <LiturgicalTimings lang={lang} t={t} />

            {/* 4. Navigation Anchor Portals */}
            <QuickActions t={t} />
        </div>
    );
}