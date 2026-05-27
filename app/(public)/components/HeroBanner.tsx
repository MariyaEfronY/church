"use client";

interface HeroBannerProps {
    lang: "en" | "ta";
    t: any;
}

export default function HeroBanner({ lang, t }: HeroBannerProps) {
    return (
        <header className="relative h-[100vh] min-h-[500px] -mt-[76px] sm:-mt-[88px] flex items-center justify-center overflow-hidden bg-stone-100 border-b border-stone-200/80 z-10">
            {/* 🎥 Background Video Matrix Integration */}
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.55] mix-blend-multiply filter grayscale scale-100 transition-transform duration-700"
                poster="https://images.unsplash.com/photo-1548625361-155defe219f2?q=80&w=1600"
            >
                <source
                    src="video/bg-video.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>

            {/* High-Key Light Cathedral Overlay Shield Veil (Smoothly grades color from clear down to Alabaster) */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-50/20 via-stone-50/60 to-stone-100 z-10 pointer-events-none" />

            {/* Content Core Platform Viewport Wrapper */}
            <div className="relative z-20 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-32 sm:pt-40 pb-12 flex flex-col items-center gap-4">
                <span className="inline-flex items-center bg-white/90 backdrop-blur-xs border border-stone-300/60 text-stone-700 rounded-full px-4 py-1 text-[11px] font-bold tracking-widest uppercase shadow-2xs transform translate-y-2 animate-fade-in">
                    {lang === "en" ? "Welcome to Our Home of Grace" : "அருள்மிகு இல்லத்திற்கு உங்களை வரவேற்கிறோம்"}
                </span>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-stone-900 tracking-tight leading-tight selection:bg-amber-600/20 drop-shadow-3xs">
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