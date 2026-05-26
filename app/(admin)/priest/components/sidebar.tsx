"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Heart,
    FileText,
    LogOut,
    ChevronRight
} from "lucide-react";

interface SidebarProps {
    closeMenu?: () => void;
}

export default function PriestSidebar({ closeMenu }: SidebarProps) {
    const pathname = usePathname();

    const navigationLinks = [
        { name: "Bible Verse", href: "/priest/bible-verse", icon: LayoutDashboard },
        { name: "Mass Timing", href: "/priest/mass-timing", icon: Users },
        { name: "Events", href: "/priest/events", icon: Heart },
        { name: "Certificates & Records", href: "/priest/records", icon: FileText },
    ];

    return (
        /* 🌟 FIX: Added 'md:sticky md:top-0' along with rigid 'h-screen fallback max-h-screen' 
           This locks the component instance relative to the browser viewport layout window */
        <div className="flex flex-col h-full md:h-screen md:sticky md:top-0 max-h-screen bg-[#3a0a10] text-stone-100 select-none overflow-hidden">

            {/* Classic Heritage Branding (Stays Fixed at Top) */}
            <div className="p-6 border-b border-white/10 flex-shrink-0">
                <h2 className="font-serif text-xl font-bold tracking-wide text-amber-400">
                    Arokiya Madha
                </h2>
                <p className="text-xs tracking-widest uppercase text-stone-400 mt-1">
                    Priest Control Center
                </p>
            </div>

            {/* Mapped Routes Navigation 
                🌟 COMFORT FIX: Added hidden-scroll bars to look infinitely cleaner while scrolling inside */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar scrollbar-none">
                {navigationLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all group ${isActive
                                ? "bg-white/10 text-amber-300 font-medium shadow-xs"
                                : "text-stone-300 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-stone-400 group-hover:text-stone-200"}`} />
                                <span>{link.name}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform opacity-60 ${isActive ? "translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                        </Link>
                    );
                })}
            </nav>

            {/* Profile Box Guardrail (Stays Fixed at the Absolute Bottom) */}
            <div className="p-4 border-t border-white/10 bg-black/20 flex-shrink-0">
                <div className="flex items-center gap-3 px-2 py-2 mb-2">
                    <div className="w-9 h-9 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-serif font-bold border border-amber-500/40">
                        FR
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-stone-200">Rev. Fr. Parish Priest</p>
                        <p className="text-xs text-stone-500 truncate">Spiritual Shepherd</p>
                    </div>
                </div>
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-stone-900 hover:bg-rose-950 hover:text-rose-200 text-stone-400 rounded-xl text-xs font-semibold transition-colors border border-stone-800"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Return to Public Site
                </Link>
            </div>
        </div>
    );
}