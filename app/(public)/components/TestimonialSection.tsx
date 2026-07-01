"use client";

import { Quote, MessageSquare, Award, Cross } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function EnhancedTestimonialSection() {
    const testimonials = [
        {
            type: "bishop",
            quote: "A unified digital platform brings administrative clarity, but its true grace is how it bridges communication gaps. It ensures no family in our diocese is left isolated, strengthening our collective pastoral care.",
            author: "Most Rev. Dr. Lawrence Pius",
            role: "Diocesan Bishop",
            bio: "Overseeing spiritual administration, community development initiatives, and regional parish integration across the diocese.",
            avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300&h=300",
            bgStyle: "bg-gradient-to-br from-[#3b0712] via-[#210207] to-[#0c0002] text-white border-[#520d18] shadow-2xl",
            quoteColor: "text-amber-500/10 group-hover:text-amber-500/15",
            textColor: "text-stone-200",
            subTextColor: "text-purple-300/80",
            bioColor: "text-stone-400 border-stone-800",
            nameColor: "text-amber-400",
            avatarBorder: "border-amber-500/50 shadow-amber-500/10"
        },
        {
            type: "priest",
            quote: "Being able to quickly coordinate community support and view household health needs during parish drives has been an absolute blessing. It has completely transformed our daily pastoral duties.",
            author: "Rev. Fr. Antony Joseph",
            role: "Parish Priest",
            bio: "Directing local parish ministry, spiritual counseling, and managing the Anbiyam Christian communities.",
            avatar: "https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&q=80&w=250&h=250",
            bgStyle: "bg-white border-stone-200 shadow-xl hover:border-amber-500/20",
            quoteColor: "text-stone-100 group-hover:text-amber-500/10",
            textColor: "text-stone-600",
            subTextColor: "text-stone-400",
            bioColor: "text-stone-500 border-stone-100",
            nameColor: "text-stone-900",
            avatarBorder: "border-stone-200"
        }
    ];

    // Added explicitly typed continuous container variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.35,
                delayChildren: 0.2
            },
        },
    };

    // Fixed: Explicit type 'Variants' forces 'type: "spring"' to match literal constraints
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 60,
                damping: 20,
                duration: 1,
            },
        },
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-20 space-y-12 overflow-hidden">
            {/* Section Header */}
            <motion.div
                className="flex items-center gap-2 border-b border-stone-200 pb-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">
                    Pastoral Leadership Voices
                </h3>
            </motion.div>

            {/* Asymmetric Layout Grid */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {testimonials.map((t, idx) => {
                    const isBishop = t.type === "bishop";

                    return (
                        <motion.div
                            key={idx}
                            variants={cardVariants}
                            className={`relative border rounded-[2rem] p-8 sm:p-12 flex flex-col justify-between group overflow-hidden ${t.bgStyle
                                } ${isBishop ? "lg:col-span-7 min-h-[500px]" : "lg:col-span-5 min-h-[500px]"
                                }`}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        >
                            {/* Decorative Graphic */}
                            <motion.div
                                className={`absolute right-10 top-10 pointer-events-none stroke-[1.2] ${t.quoteColor}`}
                                whileHover={{ scale: 1.15, rotate: isBishop ? 5 : -5, transition: { duration: 0.4 } }}
                            >
                                <Quote className="w-28 h-28" />
                            </motion.div>

                            <div className="space-y-8 relative z-10">
                                <motion.div
                                    className="flex items-center gap-2.5"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {isBishop ? (
                                        <Cross className="w-5 h-5 text-amber-400" />
                                    ) : (
                                        <Award className="w-5 h-5 text-stone-400" />
                                    )}
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${t.subTextColor}`}>
                                        {t.role} Focus
                                    </span>
                                </motion.div>

                                <motion.p
                                    className={`text-lg sm:text-xl leading-relaxed font-serif font-medium italic ${t.textColor}`}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.8, delay: 0.6 + idx * 0.2 }}
                                >
                                    "{t.quote}"
                                </motion.p>
                            </div>

                            {/* Profile Block */}
                            <motion.div
                                className="mt-10 relative z-10"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.8 }}
                                transition={{ duration: 0.7, delay: 0.8 + idx * 0.2 }}
                            >
                                <div className={`pt-8 border-t ${t.bioColor} flex flex-col sm:flex-row sm:items-center gap-6`}>

                                    <motion.div
                                        className={`relative rounded-3xl overflow-hidden flex-shrink-0 border-2 bg-stone-100 shadow-lg ${isBishop ? "h-24 w-24 sm:h-28 sm:w-28" : "h-20 w-20 sm:h-24 sm:w-24"
                                            } ${t.avatarBorder}`}
                                        whileHover={{
                                            scale: 1.1,
                                            rotate: isBishop ? -3 : 3,
                                            boxShadow: isBishop ? "0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)" : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                        }}
                                        transition={{ type: "spring", stiffness: 180, damping: 12 }}
                                    >
                                        <motion.img
                                            src={t.avatar}
                                            alt={t.author}
                                            className="h-full w-full object-cover object-center"
                                            loading="lazy"
                                            whileHover={{ scale: 1.15 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </motion.div>

                                    <div className="flex flex-col space-y-1.5">
                                        <h4 className={`text-lg sm:text-xl font-bold tracking-wide ${t.nameColor}`}>
                                            {t.author}
                                        </h4>
                                        <p className={`text-xs font-medium uppercase tracking-wider opacity-90 ${t.subTextColor}`}>
                                            {t.role}
                                        </p>
                                        <p className="text-sm mt-3 leading-relaxed opacity-80 max-w-lg">
                                            {t.bio}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}