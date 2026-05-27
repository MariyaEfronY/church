"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
    LayoutDashboard,
    Users,
    Heart,
    FileText,
    LogOut,
    ChevronRight,
    Settings,
    Mail,
    Shield,
    Church
} from "lucide-react";

interface SidebarProps {
    closeMenu?: () => void;
}

interface UserSession {
    name: string;
    email: string;
    role: string;
}

export default function PriestSidebar({ closeMenu }: SidebarProps) {
    const pathname = usePathname();
    const [priestData, setPriestData] = useState<UserSession | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Fetch logged-in user data from storage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user-session");
        if (storedUser) {
            try {
                setPriestData(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user session data:", error);
            }
        }
    }, []);

    // Close settings popover when clicking outside of it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.error("Failed to notify backend session destroyer cleanly:", error);
        } finally {
            localStorage.removeItem("user-session");
            window.location.href = "/";
        }
    };

    // Navigation setup featuring your new dedicated Dashboard root link at index 0
    const navigationLinks = [
        { name: "Dashboard", href: "/priest/dashboard", icon: Church },
        { name: "Bible Verse", href: "/priest/bible-verse", icon: LayoutDashboard },
        { name: "Mass Timing", href: "/priest/mass-timing", icon: Users },
        { name: "Events", href: "/priest/events", icon: Heart },
        { name: "Certificates & Records", href: "/priest/records", icon: FileText },
    ];

    const getInitials = (fullName: string) => {
        return fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "FR";
    };

    return (
        <div className="flex flex-col h-full md:h-screen md:sticky md:top-0 max-h-screen bg-[#3a0a10] text-stone-100 select-none overflow-hidden relative">

            {/* Classic Heritage Branding */}
            <div className="p-6 border-b border-white/10 flex-shrink-0">
                <h2 className="font-serif text-xl font-bold tracking-wide text-amber-400">
                    Arokiya Madha
                </h2>
                <p className="text-xs tracking-widest uppercase text-stone-400 mt-1">
                    Priest Control Center
                </p>
            </div>

            {/* Mapped Routes Navigation Grid */}
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

            {/* Interactive Bottom Control Section */}
            <div className="p-4 border-t border-white/10 bg-black/20 flex-shrink-0 relative" ref={popoverRef}>

                {/* 🎯 Micro-Animated Popover Settings Menu */}
                {showSettings && (
                    <div className="absolute bottom-20 left-4 right-4 bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-[0_12px_32px_rgba(0,0,0,0.4)] space-y-3 z-50 animate-fade-in animate-slide-up">
                        <div className="space-y-1.5 pb-2.5 border-b border-stone-800">
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Clearance Profile</p>
                            <h4 className="text-sm font-semibold text-stone-200 truncate">
                                {priestData?.name || "Rev. Fr. Parish Priest"}
                            </h4>

                            <div className="flex flex-col gap-1 pt-1">
                                <div className="flex items-center gap-1.5 text-xs text-stone-400 truncate">
                                    <Mail className="w-3 h-3 text-stone-500 flex-shrink-0" />
                                    <span className="truncate">{priestData?.email || "pastor@parish.org"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 capitalize font-medium">
                                    <Shield className="w-3 h-3 text-amber-500/70 flex-shrink-0" />
                                    <span>{priestData?.role || "priest"} Administrative Node</span>
                                </div>
                            </div>
                        </div>

                        {/* Functional Logout Action Trigger Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 rounded-lg text-xs font-bold transition-all border border-rose-900/30 cursor-pointer active:scale-98"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out Workspace</span>
                        </button>
                    </div>
                )}

                {/* 🛠️ Main Settings Action Trigger Unit Button Row */}
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`flex items-center justify-between w-full p-2 rounded-xl transition-all border text-left cursor-pointer active:scale-98 ${showSettings
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-transparent border-transparent text-stone-300 hover:bg-white/5 hover:text-white"
                        }`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Initial Circle Avatar */}
                        <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-serif text-xs font-bold border border-amber-500/40 uppercase tracking-wider flex-shrink-0">
                            {priestData?.name ? getInitials(priestData.name) : "FR"}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold truncate max-w-[120px]">
                                {priestData?.name || "Parish Priest"}
                            </p>
                            <p className="text-[10px] text-stone-400 truncate tracking-wide">
                                Account Session
                            </p>
                        </div>
                    </div>

                    {/* Gear Symbol Icon */}
                    <Settings className={`w-4 h-4 text-stone-400 transition-transform duration-500 ${showSettings ? "rotate-90 text-amber-400" : "group-hover:rotate-45"}`} />
                </button>

            </div>
        </div>
    );
}