"use client";

import { use } from "react";
import { Tv, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default function VideoPage({ params }: Props) {
    // Safely unwrap the async Route Promise parameters matching Next.js 15 signature rules
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    return (
        <section className="py-12 sm:py-20 bg-stone-100 text-stone-900 min-h-screen antialiased">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Back to Media Library Navigation row link */}
                <div className="mb-6">
                    <Link
                        href="/videos"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-800 transition-colors group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Media Ministry</span>
                    </Link>
                </div>

                {/* 📱 Premium Fluid High-Definition Aspect Player Box */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl overflow-hidden shadow-xl p-2 sm:p-3 relative z-10">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-stone-950">
                        <iframe
                            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
                            title="Church Video Broadcast Player"
                            className="absolute inset-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>

                {/* Lower Action bar utilities alignment panel */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                    <div className="flex items-center gap-2.5 text-stone-500">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-700 border border-indigo-500/20">
                            <Tv className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-serif italic tracking-wide">
                            Streaming live services from our Parish media archive channel portal.
                        </span>
                    </div>

                    <a
                        href={`https://www.youtube.com/watch?v=${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-bold rounded-xl shadow-xs transition-all duration-200 group self-start sm:self-auto"
                    >
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors" />
                    </a>
                </div>

            </div>
        </section>
    );
}