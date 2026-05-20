"use client";

import { Church, Heart } from "lucide-react";

interface FooterProps {
    parishName: string;
}

export default function Footer({ parishName }: FooterProps) {
    return (
        <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900">
            <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
                <div className="flex items-center gap-2 font-serif font-bold text-white text-lg">
                    <Church className="w-5 h-5 text-amber-500" />
                    <span>{parishName}</span>
                </div>

                <p className="text-sm max-w-md text-slate-500">
                    Thank you for visiting our digital parish home. May the blessing of Our Lady of Good Health be with you and your family.
                </p>

                <div className="w-full h-px bg-slate-900 my-2" />

                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                    <p>© 2026 {parishName}. All Rights Reserved.</p>
                    <p className="flex items-center gap-1">
                        Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for our parish community.
                    </p>
                </div>
            </div>
        </footer>
    );
}