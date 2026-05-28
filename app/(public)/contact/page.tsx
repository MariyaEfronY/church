"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
    const [sent, setSent] = useState(false);
    const [msgData, setMsgData] = useState({ name: "", email: "", subject: "", message: "" });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setMsgData({ name: "", email: "", subject: "", message: "" });
        }, 3000);
    };

    const contactDetails = [
        { icon: MapPin, title: "Shrine Location", lines: ["St. Arokiya Madha Church", "Main Grotto Road, Parish Square"] },
        { icon: Phone, title: "Parish Office Line", lines: ["+1 (555) 234-5678", "+1 (555) 876-5432"] },
        { icon: Mail, title: "Electronic Correspondence", lines: ["office@arokiyamadhachurch.org", "pastor@arokiyamadhachurch.org"] },
        { icon: Clock, title: "Rectory Office Hours", lines: ["Mon - Fri: 09:00 AM - 04:00 PM", "Saturday: 09:00 AM - 12:00 PM"] },
    ];

    return (
        <div className="min-h-screen bg-[#0f0a0a] text-stone-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header Narrative */}
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
                        Contact Parish Administration
                    </h1>
                    <p className="mt-3 text-stone-400 text-sm leading-relaxed">
                        Have questions regarding sacramental records, mass listings, certificates, or facility bookings? Reach out to our operational team directly.
                    </p>
                </div>

                {/* Main Split Grid Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* Left Hand: Info Directory (Takes 2 Columns) */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        {contactDetails.map((detail, idx) => (
                            <div key={idx} className="bg-stone-900/40 border border-stone-800/60 rounded-2xl p-5 flex gap-4">
                                <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl h-max flex-shrink-0">
                                    <detail.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">{detail.title}</h4>
                                    {detail.lines.map((line, lIdx) => (
                                        <p key={lIdx} className="text-sm font-medium text-stone-200 tracking-wide">{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Hand: Interactive Form Sheet (Takes 3 Columns) */}
                    <div className="lg:col-span-3 bg-stone-900/50 border border-stone-800/80 p-6 md:p-8 rounded-2xl shadow-xl relative">
                        {sent && (
                            <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-xs rounded-2xl z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                                <h4 className="text-base font-serif font-bold text-white">Message Dispatched</h4>
                                <p className="text-stone-400 text-xs max-w-xs mt-1">Our parish secretariat will log and process your request within standard office hours.</p>
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={msgData.name}
                                        onChange={(e) => setMsgData({ ...msgData, name: e.target.value })}
                                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-sm outline-none text-white transition-all"
                                        placeholder="James Smith"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Your Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={msgData.email}
                                        onChange={(e) => setMsgData({ ...msgData, email: e.target.value })}
                                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-sm outline-none text-white transition-all"
                                        placeholder="james@domain.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Subject Title</label>
                                <input
                                    type="text"
                                    required
                                    value={msgData.subject}
                                    onChange={(e) => setMsgData({ ...msgData, subject: e.target.value })}
                                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-sm outline-none text-white transition-all"
                                    placeholder="e.g., Sacramental Certificate Inquiry"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Detailed Message</label>
                                <textarea
                                    rows={5}
                                    required
                                    value={msgData.message}
                                    onChange={(e) => setMsgData({ ...msgData, message: e.target.value })}
                                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-sm outline-none text-white transition-all resize-none"
                                    placeholder="Describe your administrative or pastoral query in detail..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-950 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Transmit Inquiry Node</span>
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}