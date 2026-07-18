"use client";

import { Church, Heart, ShieldCheck, Milestone, ExternalLink, MapPin } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface FooterProps {
    parishName: string;
}

export default function Footer({ parishName }: FooterProps) {
    // Parent Container staggered child reveal animations
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05,
                type: "spring",
                stiffness: 80,
                damping: 15
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        },
    };

    return (
        <motion.footer
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 md:px-8 border-t border-slate-900/80 w-full relative overflow-hidden select-none"
        >
            {/* Background Ambient Glow Decal */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">

                {/* TOP ROW: Identity Brand & Fast Portals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-8 border-b border-slate-900">

                    {/* Column 1: Parish Bio Branding (5 cols) */}
                    <motion.div variants={itemVariants} className="md:col-span-5 space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2.5 font-serif font-bold text-white text-xl tracking-wide">
                            <div className="p-2 bg-slate-900 text-amber-500 rounded-xl border border-slate-800 shadow-inner">
                                <Church className="w-5 h-5" />
                            </div>
                            <span className="bg-gradient-to-r from-white via-stone-200 to-stone-400 bg-clip-text text-transparent">
                                {parishName}
                            </span>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto md:mx-0 font-sans">
                            Thank you for visiting our digital parish home. May the blessing of Our Lady of Good Health guide, protect, and remain with you and your family always.
                        </p>
                    </motion.div>

                    {/* Column 2: External Diocese & Maps Redirect Hub (7 cols) */}
                    <motion.div variants={itemVariants} className="md:col-span-7 w-full space-y-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500/80 text-center md:text-left block">
                            Diocese Gateways & Resource Locators
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {/* Link Card 1: Official Diocese Portal */}
                            <motion.a
                                href="https://www.tanjorediocese.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 bg-slate-900/50 backdrop-blur-xs border border-slate-900 rounded-xl hover:border-amber-500/30 hover:bg-slate-900/90 transition-all duration-300 group/btn"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 bg-slate-950 text-amber-500/90 rounded-lg border border-slate-800 group-hover/btn:text-amber-400">
                                        <Milestone className="w-4 h-4" />
                                    </div>
                                    <div className="truncate text-left">
                                        <h4 className="text-xs font-semibold text-stone-200 group-hover/btn:text-amber-400 transition-colors truncate">
                                            Official Diocese Portal
                                        </h4>
                                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">tanjorediocese.org</span>
                                    </div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover/btn:text-amber-400 group-hover/btn:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                            </motion.a>

                            {/* Link Card 2: Parish Directory Mapping */}
                            <motion.a
                                href="#villages"
                                className="flex items-center justify-between p-3.5 bg-slate-900/50 backdrop-blur-xs border border-slate-900 rounded-xl hover:border-amber-500/30 hover:bg-slate-900/90 transition-all duration-300 group/btn"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 bg-slate-950 text-amber-500/90 rounded-lg border border-slate-800 group-hover/btn:text-amber-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="truncate text-left">
                                        <h4 className="text-xs font-semibold text-stone-200 group-hover/btn:text-amber-400 transition-colors truncate">
                                            Parish Directory & Maps
                                        </h4>
                                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Sub-Stations Geoportal</span>
                                    </div>
                                </div>
                                <ShieldCheck className="w-3.5 h-3.5 text-slate-600 group-hover/btn:text-amber-400 transition-all flex-shrink-0 ml-2" />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>

                {/* BOTTOM ROW: Copyright Legal Footer Bars */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans text-center sm:text-left"
                >
                    <p className="order-2 sm:order-1 transition-colors hover:text-slate-400">
                        © 2026 <span className="text-slate-400 font-medium">{parishName}</span>. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-1.5 order-1 sm:order-2 bg-slate-900/40 px-3 py-1.5 rounded-full border border-slate-900/60">
                        <span>Built with</span>
                        <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        </motion.div>
                        <span>for our parish community.</span>
                    </div>
                </motion.div>

            </div>
        </motion.footer>
    );
}