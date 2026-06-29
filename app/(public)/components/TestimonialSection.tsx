"use client";

import { Quote, MessageSquare } from "lucide-react";

export default function TestimonialSection() {
    const testimonials = [
        {
            quote: "Our unified parish system completely transformed how we care for our families. Being able to quickly coordinate community support and view household needs during parish health drives has been a true blessing.",
            author: "Rev. Fr. Antony Joseph",
            role: "Parish Priest",
            // High-quality portrait of an approachable, smiling senior leader/priest
            avatar: "https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&q=80&w=150&h=150",
            bgStyle: "bg-gradient-to-br from-[#4a0e17] via-[#36080f] to-[#1c0205] text-white border-[#6b1b26] shadow-xl hover:border-[#8c2532]",
            quoteColor: "text-amber-500/10 group-hover:text-amber-500/20",
            textColor: "text-stone-200",
            subTextColor: "text-stone-400",
            nameColor: "text-amber-400",
            avatarBorder: "border-amber-500/40"
        },
        {
            quote: "Updating our family details through the secure portal is incredibly simple. Now, our local Anbiyam prayer group updates and announcements reach the entire parish family instantly.",
            author: "Maria Sebastiani",
            role: "Anbiyam Cluster Lead",
            // High-quality friendly portrait of a community organizer
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
            bgStyle: "bg-white border-stone-200 shadow-md hover:shadow-xl hover:border-amber-500/30",
            quoteColor: "text-stone-100 group-hover:text-amber-500/10",
            textColor: "text-stone-600",
            subTextColor: "text-stone-400",
            nameColor: "text-stone-900",
            avatarBorder: "border-stone-200 group-hover:border-amber-500/30"
        }
    ];

    return (
        <section className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2 border-b border-stone-200 pb-4">
                <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600">
                    <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">
                    Community Voices
                </h3>
            </div>

            {/* Asymmetric Cards Grid */}
            <div className="grid grid-cols-1 md grid-cols-2 gap-6 items-stretch">
                {testimonials.map((t, idx) => (
                    <div
                        key={idx}
                        className={`relative border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-1 group ${t.bgStyle}`}
                    >
                        {/* Giant Background Quote Graphic */}
                        <Quote className={`absolute right-6 top-6 w-16 h-16 transition-colors duration-500 pointer-events-none stroke-[1.5] ${t.quoteColor}`} />

                        {/* Testimonial Message */}
                        <p className={`text-sm sm:text-base leading-relaxed relative z-10 font-serif font-medium italic ${t.textColor}`}>
                            "{t.quote}"
                        </p>

                        {/* Author Profile Information Block */}
                        <div className={`mt-6 pt-4 border-t ${idx === 0 ? "border-stone-800" : "border-stone-150"} flex items-center gap-4`}>
                            {/* Profile Image Avatar */}
                            <div className={`relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 bg-stone-100 transition-colors duration-500 ${t.avatarBorder}`}>
                                <img
                                    src={t.avatar}
                                    alt={t.author}
                                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>

                            {/* Name and Designation text */}
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold tracking-wide transition-colors ${t.nameColor}`}>
                                    {t.author}
                                </span>
                                <span className={`text-xs font-medium mt-0.5 tracking-wider uppercase ${t.subTextColor}`}>
                                    {t.role}
                                </span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}