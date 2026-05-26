"use client";

import { useState } from "react";
import {
    Sparkles,
    Clock,
    UserCheck,
    Users,
    BookOpen,
    Heart,
    Calendar,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    TrendingUp
} from "lucide-react";

export default function PriestDashboardHome() {
    const [completedDuties, setCompletedDuties] = useState<number[]>([0]); // Tracks completed duties locally

    const toggleDuty = (index: number) => {
        if (completedDuties.includes(index)) {
            setCompletedDuties(completedDuties.filter(i => i !== index));
        } else {
            setCompletedDuties([...completedDuties, index]);
        }
    };

    const dashboardStats = [
        { title: "Parishioner Families", count: "1,240", change: "+12 this month", icon: Users, color: "text-emerald-700", bg: "bg-emerald-50" },
        { title: "Mass Intentions Today", count: "6 Slots", change: "Fully booked", icon: BookOpen, color: "text-amber-700", bg: "bg-amber-50" },
        { title: "Prayer Requests", count: "18 Pending", change: "8 require response", icon: Heart, color: "text-rose-700", bg: "bg-rose-50" },
        { title: "Sacraments Scheduled", count: "4 Families", change: "This upcoming week", icon: Calendar, color: "text-indigo-700", bg: "bg-indigo-50" },
    ];

    const todaySchedule = [
        { time: "06:30 AM", event: "Morning Mass & Adoration", location: "Main Altar" },
        { time: "10:30 AM", event: "Parish Council Pastoral Meeting", location: "Rectory Office" },
        { time: "04:00 PM", event: "Sacrament of Reconciliation (Confessions)", location: "Confessional Booth" },
        { time: "06:30 PM", event: "St. Arokiya Madha Novena Prayers & Blessing", location: "Grotto" },
    ];

    const quickAnnouncements = [
        { tag: "Urgent", text: "Sick call request: Visit requested for an elderly parishioner at St. Mary's Block.", time: "10 mins ago", urgent: true },
        { tag: "Feast", text: "Flag hoisting liturgy sequence draft finalized for August 29th feast review.", time: "2 hours ago", urgent: false },
        { tag: "Property", text: "Altar microphone feedback troubleshooting scheduled with technical team on Thursday.", time: "Yesterday", urgent: false },
    ];

    return (
        <div className="space-y-8 animate-fade-in">

            {/* 1. Dignified Liturgical Welcome Banner */}
            <header className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200/80 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-widest">
                        <UserCheck className="w-4 h-4 text-amber-700" />
                        <span>Pax Vobiscum • Peace be with you</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
                        Welcome Father,
                    </h1>
                    <p className="text-stone-500 text-sm mt-0.5">
                        Here is the spiritual heartbeat and administrative summary of St. Arokiya Madha Church today.
                    </p>
                </div>

                {/* Liturgical Context Card */}
                <div className="bg-stone-50 px-5 py-3 rounded-xl border border-stone-200/60 flex items-center gap-4 self-start lg:self-center">
                    <Clock className="w-5 h-5 text-amber-700 flex-shrink-0" />
                    <div className="text-left">
                        <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Liturgical Season</div>
                        <div className="text-sm font-serif font-bold text-stone-800">Ordinary Time</div>
                        <div className="text-[11px] text-stone-500">Vestment Color: Green</div>
                    </div>
                    <div className="w-3 h-7 bg-emerald-700 rounded-xs ml-2 shadow-xs" title="Liturgical Green" />
                </div>
            </header>

            {/* 2. Classic Pastoral Analytics Counters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all group duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{stat.title}</span>
                            <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl transition-transform group-hover:scale-105`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-serif font-bold text-stone-900 mt-3 tracking-tight">{stat.count}</div>
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-2 font-medium">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Main Split Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Interactive Pastoral Duties & Schedule (Takes 2 Columns) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6">
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-700" />
                            <h2 className="text-lg font-serif font-bold text-stone-900">Today's Pastoral Duties</h2>
                        </div>
                        <span className="text-xs font-medium text-stone-400 bg-stone-50 px-3 py-1 rounded-full border border-stone-200/40">
                            {completedDuties.length} of {todaySchedule.length} Done
                        </span>
                    </div>

                    <div className="space-y-4">
                        {todaySchedule.map((item, index) => {
                            const isDone = completedDuties.includes(index);
                            return (
                                <div
                                    key={index}
                                    onClick={() => toggleDuty(index)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 select-none ${isDone
                                            ? "bg-stone-50/80 border-stone-200 opacity-60 line-through"
                                            : "bg-white border-stone-200 shadow-xs hover:border-amber-600/40 hover:bg-stone-50/30"
                                        }`}
                                >
                                    <button className="mt-0.5 focus:outline-none flex-shrink-0">
                                        <CheckCircle2 className={`w-5 h-5 transition-colors ${isDone ? "text-emerald-600 fill-emerald-50" : "text-stone-300"}`} />
                                    </button>

                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                        <div>
                                            <p className={`text-sm font-semibold text-stone-900 ${isDone ? "text-stone-500" : ""}`}>{item.event}</p>
                                            <p className="text-xs text-stone-400 mt-0.5">{item.location} • <span className="font-medium text-stone-500">{item.time}</span></p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase self-start sm:self-center ${isDone ? "bg-stone-100 text-stone-500" : "bg-amber-50 text-amber-800 border border-amber-100"
                                            }`}>
                                            {isDone ? "Completed" : "Scheduled"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Notifications & Parish Notices Drawer (Takes 1 Column) */}
                <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
                            <AlertCircle className="w-5 h-5 text-amber-700" />
                            <h2 className="text-lg font-serif font-bold text-stone-900">Recent Notices</h2>
                        </div>

                        <div className="space-y-4">
                            {quickAnnouncements.map((ann, i) => (
                                <div key={i} className={`p-4 rounded-xl border transition-colors ${ann.urgent
                                        ? "bg-rose-50/40 border-rose-100 hover:bg-rose-50/70"
                                        : "bg-stone-50/50 border-stone-200/40 hover:bg-stone-50"
                                    }`}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${ann.urgent ? "bg-rose-100 text-rose-800" : "bg-stone-200 text-stone-700"
                                            }`}>
                                            {ann.tag}
                                        </span>
                                        <span className="text-[11px] text-stone-400">{ann.time}</span>
                                    </div>
                                    <p className="text-xs text-stone-700 font-light leading-relaxed">
                                        {ann.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Meditative Quote Panel */}
                    <div className="mt-6 pt-4 border-t border-stone-100 bg-gradient-to-br from-stone-50 to-amber-50/30 p-4 rounded-xl border border-stone-100 text-center">
                        <p className="text-[11px] uppercase font-bold tracking-widest text-amber-800 mb-1">Spiritual Focus</p>
                        <p className="text-xs italic text-stone-600 font-serif">
                            "The harvest is plentiful, but the laborers are few; therefore pray earnestly to the Lord of the harvest."
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}