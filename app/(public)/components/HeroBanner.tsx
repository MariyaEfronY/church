"use client";

interface HeroBannerProps {
    lang: "en" | "ta";
    t: any;
}

export default function HeroBanner({ lang, t }: HeroBannerProps) {
    return (
        <header className="relative h-[60vh] min-h-[440px] flex items-center justify-center overflow-hidden border-b border-slate-900">
            {/* Cinematic Background Img */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.98)), url('https://images.unsplash.com/photo-1548625361-155defe219f2?q=80&w=1600')`
                }}
            />

            <div className="relative z-10 max-w-4xl mx-auto text-center px-4 flex flex-col items-center gap-5">
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-400 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase selection:bg-amber-500/30">
                    {lang === "en" ? "Welcome to Our Home of Grace" : "அருள்மிகு இல்லத்திற்கு உங்களை வரவேற்கிறோம்"}
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 tracking-tight leading-tight">
                    {t.parishName}
                </h1>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-1" />
                <p className="text-base md:text-lg text-slate-400 font-light max-w-2xl italic leading-relaxed font-serif tracking-wide">
                    {t.tagline}
                </p>
            </div>
        </header>
    );
}