"use client";

interface HeroBannerProps {
    lang: "en" | "ta";
    t: any;
}

export default function HeroBanner({ lang, t }: HeroBannerProps) {
    return (
        <header className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-stone-100 border-b border-stone-200/80">
            {/* 🎥 Background Video Matrix Integration */}
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.5] mix-blend-darken filter grayscale tracking-normal"
                poster="https://images.unsplash.com/photo-1548625361-155defe219f2?q=80&w=1600"
            >
                {/* Replace src string link cleanly with your local mp4 or hosting stream delivery path */}
                <source
                    src="video/bg-video.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>

            {/* High-Key Light Cathedral Overlay Shield Veil */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-50/10 via-stone-50/50 to-stone-100 z-10" />

            {/* Content Core Platform Viewport Wrapper */}
            <div className="relative z-20 max-w-4xl mx-auto text-center px-4 sm:px-6 flex flex-col items-center gap-4">
                <span className="inline-flex items-center bg-white/80 backdrop-blur-xs border border-stone-300/70 text-stone-700 rounded-full px-4 py-1 text-[11px] font-bold tracking-widest uppercase shadow-2xs">
                    {lang === "en" ? "Welcome to Our Home of Grace" : "அருள்மிகு இல்லத்திற்கு உங்களை வரவேற்கிறோம்"}
                </span>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-stone-900 tracking-tight leading-tight selection:bg-amber-600/20">
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