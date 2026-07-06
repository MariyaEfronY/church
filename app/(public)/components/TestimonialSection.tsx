"use client";

import {
    Calendar,
    BookOpen,
    ShieldCheck,
    Milestone,
    Scroll,
    ArrowUpRight,
    Globe,
    MapPin,
    ChevronRight
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function CombinedParishChronicle() {

    // Framer Motion Animation Orchestration Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 },
        },
    };

    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 60, damping: 15 },
        },
    };

    const linkItems = [
        {
            title: "Official Diocese Portal",
            icon: Globe,
            href: "https://www.tanjorediocese.org/",
            badge: "Main Website"
        },
        // {
        //     title: "Parish Directory & Maps",
        //     icon: MapPin,
        //     href: "#",
        //     badge: "Geoportal"
        // }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-16 select-none selection:bg-amber-800 selection:text-white">

            {/* ========================================================================= */}
            {/* SECTION 1: THE DIOCESE CHRONICLE LEDGER WITH REDIRECTION LINKS            */}
            {/* ========================================================================= */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                className="space-y-8"
            >
                {/* Module Heading */}
                <motion.div variants={sectionVariants} className="flex items-center gap-3 border-b border-stone-200/80 pb-6">
                    <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 shadow-2xs">
                        <Milestone className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Historical Archives & Gateways</h3>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900 mt-0.5">The Diocese of Thanjavur Chronicle</h1>
                    </div>
                </motion.div>

                {/* Main Double Column Display Layout */}
                <motion.div
                    variants={sectionVariants}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-gradient-to-br from-[#3b0712] via-[#210207] to-[#0c0002] border border-[#520d18] rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Visual Media Showcase Column (Large Zoom Track Area) */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-6 h-full min-h-[340px] lg:min-h-[460px]">
                        <motion.div
                            className="relative rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl flex-1 bg-stone-900 group cursor-pointer"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 120, damping: 14 }}
                        >
                            {/* Deep Zoom Image Target */}
                            <motion.img
                                src="img/diocese.png"
                                alt="Thanjavur Cathedral Heritage"
                                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-112 brightness-90 group-hover:brightness-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* Inner Image Captions overlay */}
                            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">Historical Landmark View</span>
                                <h4 className="text-sm font-serif font-medium flex items-center gap-1">
                                    See of Mylapore Roots <ArrowUpRight className="w-3 h-3 opacity-60" />
                                </h4>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scrollable Context Records Content Column */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-stone-200">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-400">
                                <Scroll className="w-3.5 h-3.5" /> Papal Bull Status Node
                            </div>

                            {/* SCROLLABLE INNER CONTAINER BLOCK */}
                            <div className="max-h-[260px] lg:max-h-[280px] overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-transparent border-l border-white/5 pl-4 md:pl-6">
                                <p className="text-base md:text-lg leading-relaxed font-serif italic text-stone-100 tracking-wide">
                                    The Diocese of Thanjavur was created on November 22, 1952 through the papal bull “Ex Primaevae Ecclesiae” when it was bifurcated from the ancient See of Mylapore. It had to wait for four more months for the nomination of its new bishop.
                                </p>
                                <p className="text-sm md:text-base leading-relaxed text-stone-300">
                                    Most Rev. Dr. R.A. Sundaram, an illustrious son of the soil, was nominated the first Bishop of Thanjavur on February 4, 1953 and was consecrated at Chennai on 19th March 1953. It is interesting to note that in 1843 itself, the then Apostolic Prefect of Pondicherry, Msgr. Bonnand proposed that Thanjavur be erected an Apostolic Vicariate.
                                </p>
                                <p className="text-sm md:text-base leading-relaxed text-stone-300 border-t border-white/5 pt-4">
                                    Mylapore had become a diocese in 1606 and was the third oldest diocese of India till it was amalgamated with Madras in 1952. Its jurisdiction extended from the present Diocese of Thoothukudi in Tamilnadu to what is now known as West Bengal.
                                </p>
                                <p className="text-sm md:text-base leading-relaxed text-stone-300">
                                    Many missionaries including Franciscans, Augustinians, Dominicans and Jesuits like Robert de Nobili (the Father of Tamil Prose), Balthasar da Costa (the founder of Thanjavur Mission), John de Britto (the first Jesuit saint in India), Antam de Proenca (whose Tamil Portuguese Dictionary was the first of its kind to be printed) and Costanzo Giosseffo Beschi (Veeramamunivar) had toiled laboriously in the area.
                                </p>
                            </div>
                        </div>

                        {/* INTEGRATED REDIRECTION LINKS HUB */}
                        <div className="space-y-3 pt-2 border-t border-white/10">
                            <span className="text-[11px] font-mono uppercase text-amber-400 tracking-wider block">View Diocese Link Redirection:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {linkItems.map((item, idx) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <motion.a
                                            key={idx}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:border-amber-500/40 hover:bg-white/10 transition-all duration-300 group/link"
                                            whileHover={{ x: 2 }}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2 bg-white/5 text-amber-400 rounded-lg border border-white/5 group-hover/link:text-amber-300">
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div className="truncate">
                                                    <h4 className="text-xs font-semibold text-stone-100 group-hover/link:text-amber-400 transition-colors truncate">
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-[9px] font-mono text-stone-400 block mt-0.5">
                                                        {item.badge}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-stone-500 group-hover/link:text-amber-400 group-hover/link:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary Footer Meta */}
                        <div className="pt-2 border-t border-white/5 text-[11px] text-stone-400 flex flex-wrap gap-x-6 gap-y-2">
                            <span>Jurisdiction Foundation: <strong className="text-stone-200">1606 Era</strong></span>
                            <span>Erection Bull Date: <strong className="text-amber-400">Nov 22, 1952</strong></span>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            {/* ========================================================================= */}
            {/* SECTION 2: THE PARISH PRIEST LEADERSHIP VIEW (NO LINKS)                  */}
            {/* ========================================================================= */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                className="space-y-8"
            >
                {/* Module Heading */}
                <motion.div variants={sectionVariants} className="flex items-center gap-3 border-b border-stone-200/80 pb-6">
                    <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 shadow-2xs">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Pastoral Care Leadership</h3>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900 mt-0.5">The Parish Priest Desk</h1>
                    </div>
                </motion.div>

                {/* Profile Detail Presentation Grid */}
                <motion.div
                    variants={sectionVariants}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-stone-200/80 rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-xl hover:border-amber-500/10 transition-all duration-300"
                >
                    {/* Content Detail Layer */}
                    <div className="lg:col-span-8 space-y-6 flex flex-col justify-between order-2 lg:order-1">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-100 rounded-full text-xs font-semibold">
                                <BookOpen className="w-3.5 h-3.5 text-amber-700" /> Active Ministry Core Focus
                            </div>

                            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900">
                                Rev. Fr. Antony Joseph
                            </h2>
                            <p className="text-xs font-medium uppercase tracking-wider text-stone-400 -mt-2">
                                Appointed Parish Priest, Thanjavur Community Hub
                            </p>

                            <p className="text-base md:text-lg font-serif font-medium italic text-stone-600 leading-relaxed pt-2 pl-4 border-l-2 border-amber-600/30">
                                "Being able to quickly coordinate community support and view household health needs during parish drives has been an absolute blessing. It has completely transformed our daily pastoral duties by aligning localized administrative clarity directly with communal outreach networks."
                            </p>

                            <p className="text-sm text-stone-500 leading-relaxed max-w-2xl pt-2">
                                Tasked with directing local parish ministry systems, overseeing spiritual counseling parameters, and developing the active Anbiyam Christian communities layout layers configured across the digital regional workspace nodes.
                            </p>
                        </div>

                        {/* Calendar Tracker Info */}
                        <div className="pt-6 border-t border-stone-100 flex items-center gap-4 text-xs font-mono text-stone-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Session Lifecycle: 2026 Active</span>
                        </div>
                    </div>

                    {/* PORTRAIT PROFILE IMAGE BLOCK WITH INTERACTION ZOOM */}
                    <div className="lg:col-span-4 order-1 lg:order-2 flex items-center justify-center">
                        <motion.div
                            className="relative w-full aspect-[4/5] sm:max-w-xs lg:max-w-none rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-50 shadow-lg group cursor-pointer"
                            whileHover={{ scale: 1.04, rotate: 1 }}
                            transition={{ type: "spring", stiffness: 140, damping: 14 }}
                        >
                            <motion.img
                                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600&h=750"
                                alt="Rev. Fr. Antony Joseph Portrait"
                                className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>

        </div>
    );
}