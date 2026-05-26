"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    MapPin,
    User,
    Image as ImageIcon,
    FileText,
    PlusCircle,
    Edit2,
    Trash2,
    XCircle,
    Sparkles,
    Heart,
    Globe
} from "lucide-react";

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);

    const [form, setForm] = useState({
        titleEnglish: "",
        titleTamil: "",
        descriptionEnglish: "",
        descriptionTamil: "",
        bannerImage: "",
        eventDate: "",
        location: "",
        createdBy: "",
    });

    const [editId, setEditId] = useState("");

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/priest/event");
            const data = await res.json();
            setEvents(data.event || []);
        } catch (error) {
            console.log("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload and enforces HTML5 validation

        try {
            if (editId) {
                await fetch(`/api/priest/event/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                alert("நிகழ்வு புதுப்பிக்கப்பட்டது!");
            } else {
                await fetch("/api/priest/event", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                alert("நிகழ்வு சேர்க்கப்பட்டது!");
            }

            setForm({
                titleEnglish: "",
                titleTamil: "",
                descriptionEnglish: "",
                descriptionTamil: "",
                bannerImage: "",
                eventDate: "",
                location: "",
                createdBy: "",
            });

            setEditId("");
            fetchEvents();
        } catch (error) {
            console.log("Error submitting event:", error);
        }
    };

    const handleEdit = (event: any) => {
        setForm({
            titleEnglish: event.titleEnglish,
            titleTamil: event.titleTamil,
            descriptionEnglish: event.descriptionEnglish,
            descriptionTamil: event.descriptionTamil,
            bannerImage: event.bannerImage,
            eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",
            location: event.location,
            createdBy: event.createdBy,
        });

        setEditId(event._id);

        // Smooth scroll back to form workspace input viewport
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("இந்த நிகழ்வை நீக்க வேண்டுமா?");
        if (!confirmDelete) return;

        try {
            await fetch(`/api/priest/event/${id}`, { method: "DELETE" });
            alert("நிகழ்வு நீக்கப்பட்டது!");
            fetchEvents();
        } catch (error) {
            console.log("Error deleting event:", error);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in">

            {/* Page Header Banner */}
            <header className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                        <Heart className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">
                            திருவிழாக்கள் & நிகழ்வுகள் மேலாண்மை
                        </h1>
                        <p className="text-xs md:text-sm text-stone-500 mt-0.5">
                            Publish parish festivals, community events, special functions, and notices.
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* FORM PANEL CONTAINER (Takes 1 Column, Sticky on Desktop) */}
                <div className="bg-white shadow-xs rounded-2xl p-5 border border-stone-200/80 lg:sticky lg:top-6">
                    <div className="flex items-center gap-2 pb-3 mb-5 border-b border-stone-100">
                        <PlusCircle className="w-4 h-4 text-amber-800" />
                        <h3 className="font-serif font-bold text-stone-900 text-base">
                            {editId ? "நிகழ்வை திருத்தவும்" : "புதிய நிகழ்வு சேர்க்க"}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Title - English */}
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                Event Title (English)
                            </label>
                            <input
                                type="text"
                                name="titleEnglish"
                                placeholder="e.g., Annual Feast Flag Hoisting"
                                value={form.titleEnglish}
                                onChange={handleChange}
                                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Title - Tamil */}
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                நிகழ்வு தலைப்பு (தமிழ்)
                            </label>
                            <input
                                type="text"
                                name="titleTamil"
                                placeholder="உதா: ஆண்டு பெருவிழா கொடியேற்றம்"
                                value={form.titleTamil}
                                onChange={handleChange}
                                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Description - English */}
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                Description (English)
                            </label>
                            <textarea
                                name="descriptionEnglish"
                                placeholder="Describe the schedule details..."
                                value={form.descriptionEnglish}
                                onChange={handleChange}
                                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all resize-none font-light"
                                rows={3}
                                required
                            />
                        </div>

                        {/* Description - Tamil */}
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                நிகழ்வு விளக்கம் (தமிழ்)
                            </label>
                            <textarea
                                name="descriptionTamil"
                                placeholder="நிகழ்வின் விபரங்கள் மற்றும் கால அட்டவணை..."
                                value={form.descriptionTamil}
                                onChange={handleChange}
                                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all resize-none font-light"
                                rows={3}
                                required
                            />
                        </div>

                        {/* Banner Image URL */}
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                Banner Image URL
                            </label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    name="bannerImage"
                                    placeholder="https://example.com/image.jpg"
                                    value={form.bannerImage}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all text-xs"
                                />
                            </div>
                        </div>

                        {/* Event Date */}
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                நிகழ்வு தேதி (Date)
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                                <input
                                    type="date"
                                    name="eventDate"
                                    value={form.eventDate}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all text-stone-700"
                                    required
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                இடம் (Location)
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="உதா: பிரதான அன்னை திருத்தலம்"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Created By / Priest Name */}
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                அறிவிப்பாளர் (Announced By)
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    name="createdBy"
                                    placeholder="Rev. Fr. Parish Priest"
                                    value={form.createdBy}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* BUTTON ACTIONS */}
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-[#4a0e17] hover:bg-[#3a0a10] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-xs cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                {editId ? "நிகழ்வை புதுப்பி (Update)" : "நிகழ்வை சேமி (Publish)"}
                            </button>

                            {editId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditId("");
                                        setForm({
                                            titleEnglish: "",
                                            titleTamil: "",
                                            descriptionEnglish: "",
                                            descriptionTamil: "",
                                            bannerImage: "",
                                            eventDate: "",
                                            location: "",
                                            createdBy: "",
                                        });
                                    }}
                                    className="w-full flex items-center justify-center gap-1 bg-stone-100 text-stone-600 hover:bg-stone-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    <XCircle className="w-3.5 h-3.5" /> ரத்து செய்
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* EVENTS VIEWPORT STACK LIST (Takes up 2 Columns) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between pb-1">
                        <h3 className="font-serif font-bold text-stone-800 text-base">
                            பதிவேற்றப்பட்ட நிகழ்வுகள் ({events.length})
                        </h3>
                    </div>

                    {events.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm font-light">
                            தற்போது வரை அறிவிப்புகள் அல்லது நிகழ்வுகள் எதுவும் பதிவேற்றப்படவில்லை.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {events.map((event) => (
                                <div
                                    key={event._id}
                                    className="bg-white rounded-2xl border border-stone-200/70 shadow-2xs hover:shadow-xs overflow-hidden transition-all flex flex-col"
                                >
                                    {/* Event Card Optional Image Banner */}
                                    {event.bannerImage && (
                                        <div className="w-full h-40 bg-stone-100 overflow-hidden relative border-b border-stone-100">
                                            <img
                                                src={event.bannerImage}
                                                alt={event.titleEnglish}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                                            />
                                        </div>
                                    )}

                                    {/* Main Display Matrix Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                                        <div className="space-y-4">
                                            {/* Bilingual Title Fields Layout */}
                                            <div className="space-y-1">
                                                <h4 className="text-base md:text-lg font-serif font-bold text-stone-900 leading-snug flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-stone-400 flex-shrink-0" />
                                                    {event.titleEnglish}
                                                </h4>
                                                <p className="text-sm md:text-base font-medium text-amber-900/90 font-sans leading-relaxed pl-6">
                                                    {event.titleTamil}
                                                </p>
                                            </div>

                                            {/* Bilingual Descriptions Block */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-stone-100 text-xs md:text-sm leading-relaxed text-stone-600">
                                                <div className="bg-stone-50/40 p-3 rounded-xl border border-stone-100">
                                                    <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">English Details</div>
                                                    <p className="font-light whitespace-pre-line">{event.descriptionEnglish}</p>
                                                </div>
                                                <div className="bg-amber-50/20 p-3 rounded-xl border border-amber-100/30">
                                                    <div className="text-[10px] text-amber-700/70 font-bold uppercase tracking-wider mb-1">தமிழ் விபரம்</div>
                                                    <p className="font-sans whitespace-pre-line text-stone-800">{event.descriptionTamil}</p>
                                                </div>
                                            </div>

                                            {/* Metadata Badges Footer Stack Row */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-stone-500 font-medium">
                                                <span className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-md text-stone-700">
                                                    <Calendar className="w-3.5 h-3.5 text-[#4a0e17]" />
                                                    {event.eventDate ? new Date(event.eventDate).toLocaleDateString("ta-IN", {
                                                        year: "numeric", month: "long", day: "numeric"
                                                    }) : "N/A"}
                                                </span>
                                                <span className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-md text-stone-700 max-w-xs truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                                                    {event.location}
                                                </span>
                                                {event.createdBy && (
                                                    <span className="flex items-center gap-1 text-stone-400">
                                                        <User className="w-3.5 h-3.5" />
                                                        By: {event.createdBy}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Utilities Management Strip */}
                                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-lg text-stone-600 transition-colors cursor-pointer"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> திருத்து (Edit)
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event._id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-rose-50 hover:text-rose-700 border border-stone-200 rounded-lg text-stone-600 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> நீக்கு (Delete)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}