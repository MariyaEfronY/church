"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Church, LogIn, ChevronDown, BookOpen, Calendar, Layers, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavProps {
    parishName: string;
    adminText: string;
}

export default function Navigation({ parishName, adminText }: NavProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#") && pathname === "/") {
            e.preventDefault();
            const element = document.getElementById(href.replace("#", ""));
            if (element) {
                setMobileMenuOpen(false);

                // Smoothed out offset calculation for the fixed navbar profile
                const offset = isScrolled ? 75 : 95;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    const menuItems = [
        {
            title: "Liturgical",
            icon: <Calendar className="w-4 h-4 text-amber-600" />,
            submenu: [
                { name: "Mass Timings", href: "#timings" },
                { name: "Devotions", href: "#devotions" },
                { name: "Sub-Villages", href: "#villages" }
            ]
        },
        {
            title: "Parish Life",
            icon: <Layers className="w-4 h-4 text-amber-600" />,
            submenu: [
                { name: "About Us", href: "#AboutSection" },
                { name: "Sacraments", href: "/sacraments" },
                { name: "Anbiyam Clusters", href: "/anbiyams" }
            ]
        },
        {
            title: "Media",
            icon: <BookOpen className="w-4 h-4 text-amber-600" />,
            submenu: [
                { name: "Gallery", href: "#GallerySection" },
                { name: "YouTube Streams", href: "#youtubeVideos" }
            ]
        }
    ];

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full transition-all duration-500 ease-in-out overflow-x-clip ${isScrolled ? "bg-transparent backdrop-blur-none pointer-events-none" : "bg-stone-100/10 backdrop-blur-sm"
            }`}>

            {/* Dynamic Padding Frame Wrapper */}
            <div className={`mx-auto px-4 sm:px-6 transition-all duration-500 ease-in-out pointer-events-auto ${isScrolled ? "pt-2 pb-2 max-w-5xl" : "pt-4 pb-0 max-w-6xl"
                }`}>

                {/* Morphing Nav Panel with Old Rounded Style */}
                <motion.nav
                    layout
                    transition={{ type: "spring", stiffness: 240, damping: 28 }}
                    className={`border border-stone-200/60 transition-all duration-500 backdrop-blur-md ${isScrolled
                        ? "bg-white/90 shadow-[0_12px_30px_rgba(0,0,0,0.06)] rounded-2xl px-4 py-2"
                        : "bg-white/80 shadow-[0_4px_25px_rgba(0,0,0,0.01)] rounded-3xl px-4 sm:px-6 py-4"
                        }`}
                >
                    <div className="flex justify-between items-center gap-2 sm:gap-4 min-w-0">

                        {/* 🏛️ Left: Branding Section */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 group select-none min-w-0 max-w-[70%] md:max-w-none"
                            onClick={(e) => {
                                if (pathname === "/") {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                            }}
                        >
                            <motion.div
                                layout="position"
                                className={`rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-all duration-300 flex-shrink-0 ${isScrolled ? "w-7 h-7 sm:w-8 h-8" : "w-9 h-9 sm:w-10 h-10"
                                    }`}
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Church className={`text-amber-700 transition-colors ${isScrolled ? "w-3.5 h-3.5 sm:w-4 h-4" : "w-4 h-4 sm:w-5 h-5"}`} />
                            </motion.div>

                            <motion.span
                                layout="position"
                                className={`font-serif font-black text-stone-900 tracking-wide truncate group-hover:text-amber-900 transition-all duration-300 ${isScrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                                    }`}
                            >
                                {parishName}
                            </motion.span>
                        </Link>

                        {/* 🌐 Center: Desktop Menus */}
                        <div className="hidden md:flex items-center gap-1">
                            {menuItems.map((item, idx) => (
                                <div key={idx} className="relative group/menu py-1">
                                    <button className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold font-sans text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all duration-200 ${isScrolled ? "text-xs" : "text-sm"
                                        }`}>
                                        <span>{item.title}</span>
                                        <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform duration-300 group-hover/menu:rotate-180" />
                                    </button>

                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 invisible opacity-0 scale-95 origin-top group-hover/menu:visible group-hover/menu:opacity-100 group-hover/menu:scale-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none group-hover/menu:pointer-events-auto">
                                        <div className="bg-white border border-stone-200/80 shadow-2xl rounded-2xl p-2 min-w-[190px] space-y-0.5">
                                            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-stone-100 mb-1">
                                                {item.icon}
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{item.title}</span>
                                            </div>
                                            {item.submenu.map((sub, sIdx) => (
                                                <Link
                                                    key={sIdx}
                                                    href={sub.href}
                                                    onClick={(e) => handleScrollToSection(e, sub.href)}
                                                    className="block px-3 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-amber-950 hover:bg-amber-50/60 transition-all duration-150"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ⚡ Right: Desktop Login / Mobile Menu Trigger */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Link
                                href="/auth/login-site"
                                className={`hidden md:inline-flex relative items-center gap-1.5 overflow-hidden bg-[#4a0e17] hover:bg-[#3a0a10] text-white rounded-xl font-bold font-sans tracking-wide transition-all duration-300 active:scale-95 group shadow-sm ${isScrolled ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-xs"
                                    }`}
                            >
                                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shine_1s_ease-in-out]" />
                                <LogIn className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                <span className="truncate">{adminText || "Login"}</span>
                            </Link>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 md:hidden rounded-xl text-stone-600 hover:bg-stone-100/80 transition-colors flex-shrink-0"
                                aria-label="Toggle Menu"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                    </div>
                </motion.nav>
            </div>

            {/* 📱 Mobile Dropdown Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        className="absolute top-full left-0 w-full px-4 pt-2 md:hidden pointer-events-auto"
                    >
                        {/* CHANGED: Adjusted inner gaps to make spacing much more compact */}
                        <div className="bg-white/95 backdrop-blur-xl border border-stone-200/80 shadow-2xl rounded-2xl p-3.5 space-y-3 max-h-[80vh] overflow-y-auto">

                            {/* Menu Links organized in tight groupings */}
                            {menuItems.map((item, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-stone-400 px-1">
                                        {item.icon}
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{item.title}</span>
                                    </div>
                                    {/* CHANGED: Transformed links list into a compact 2-column grid layout */}
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {item.submenu.map((sub, sIdx) => (
                                            <Link
                                                key={sIdx}
                                                href={sub.href}
                                                onClick={(e) => handleScrollToSection(e, sub.href)}
                                                className="block p-2 text-center rounded-lg text-[11px] font-bold text-stone-700 bg-stone-50/70 hover:bg-amber-50 hover:text-amber-900 transition-all border border-stone-100 truncate"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* CHANGED: Relocated Login Item to the bottom of the drawer wrapper container */}
                            <div className="pt-2.5 border-t border-stone-100">
                                <Link
                                    href="/auth/login-site"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="relative flex items-center justify-center gap-2 w-full overflow-hidden bg-[#4a0e17] hover:bg-[#3a0a10] text-white rounded-xl font-bold font-sans tracking-wide py-2.5 text-xs transition-all duration-300 active:scale-[0.98] shadow-md group"
                                >
                                    <LogIn className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                    <span>{adminText || "Login"}</span>
                                </Link>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}