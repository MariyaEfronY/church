"use client";

interface HeroBannerProps {
    lang: "en" | "ta";
    t: any;
}

export default function HeroBanner({ lang, t }: HeroBannerProps) {
    return (
        <header className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden bg-stone-50 border-b border-stone-200/80">
            {/* Soft, High-Key Light Cathedral Overlay Backdrop */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.08] mix-blend-luminosity pointer-events-none"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1548625361-155defe219f2?q=80&w=1600')`
                }}
            />
            {/* Subtle Gradient Shadowing for text clarity */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-50/0 via-stone-50/40 to-stone-100" />

            <div className="relative z-10 max-w-4xl mx-auto text-center px-4 flex flex-col items-center gap-4">
                <span className="inline-flex items-center bg-stone-200/60 border border-stone-300 text-stone-700 rounded-full px-4 py-1 text-[11px] font-bold tracking-widest uppercase shadow-2xs">
                    {lang === "en" ? "Welcome to Our Home of Grace" : "அருள்மிகு இல்லத்திற்கு உங்களை வரவேற்கிறோம்"}
                </span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-stone-900 tracking-tight leading-tight">
                    {t.parishName}
                </h1>
                <div className="w-12 h-0.5 bg-amber-600/60 my-1 rounded-full" />
                <p className="text-sm sm:text-base md:text-lg text-stone-600 font-normal max-w-2xl italic font-serif leading-relaxed tracking-wide">
                    {t.tagline}
                </p>
            </div>
        </header>
    );
}