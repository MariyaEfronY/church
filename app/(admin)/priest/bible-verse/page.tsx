"use client";

import { useEffect, useState } from "react";
import {
    BookOpen,
    Calendar,
    FileText,
    Sparkles,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    PlusCircle
} from "lucide-react";

export default function BibleVersePage() {
    // VERSES STATE
    const [verses, setVerses] = useState<any[]>([]);

    // EDIT STATE
    const [editingId, setEditingId] = useState("");

    // FORM STATE
    const [formData, setFormData] = useState({
        verseTamil: "",
        referenceTamil: "",
        verseDate: "",
        isTodayVerse: false,
    });

    // GET ALL VERSES
    const fetchVerses = async () => {
        try {
            const res = await fetch("/api/priest/BibleVerse");
            const data = await res.json();
            setVerses(data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    // LOAD DATA
    useEffect(() => {
        fetchVerses();
    }, []);

    // HANDLE INPUT CHANGE
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        });
    };

    // CREATE OR UPDATE
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await fetch(`/api/priest/BibleVerse/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                alert("இறைவசனம் புதுப்பிக்கப்பட்டது");
            } else {
                await fetch("/api/priest/BibleVerse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                alert("இறைவசனம் சேர்க்கப்பட்டது");
            }

            // RESET FORM
            setFormData({
                verseTamil: "",
                referenceTamil: "",
                verseDate: "",
                isTodayVerse: false,
            });
            setEditingId("");
            fetchVerses();
        } catch (error) {
            console.log(error);
        }
    };

    // DELETE VERSE
    const deleteVerse = async (id: string) => {
        const confirmDelete = confirm("நீக்க வேண்டுமா?");
        if (!confirmDelete) return;

        try {
            await fetch(`/api/priest/BibleVerse/${id}`, { method: "DELETE" });
            alert("நீக்கப்பட்டது");
            fetchVerses();
        } catch (error) {
            console.log(error);
        }
    };

    // EDIT VERSE
    const editVerse = (verse: any) => {
        setEditingId(verse._id);
        setFormData({
            verseTamil: verse.verseTamil,
            referenceTamil: verse.referenceTamil,
            verseDate: verse.verseDate?.split("T")[0] || "",
            isTodayVerse: verse.isTodayVerse,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">

            {/* Page Header Banner */}
            <header className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">
                            📖 இறைவசன மேலாண்மை
                        </h1>
                        <p className="text-xs md:text-sm text-stone-500 mt-0.5">
                            Manage the scripture text layout shown across the parish channels.
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* FORM PANEL CONTAINER (1 Column on Large, Full Width on Mobile) */}
                <div className="bg-white shadow-xs rounded-2xl p-5 border border-stone-200/80 lg:sticky lg:top-6">
                    <div className="flex items-center gap-2 pb-3 mb-5 border-b border-stone-100">
                        <PlusCircle className="w-4 h-4 text-amber-800" />
                        <h3 className="font-serif font-bold text-stone-900 text-base">
                            {editingId ? "வசனத்தை திருத்தவும்" : "புதிய வசனம் சேர்க்க"}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* VERSE TEXTAREA */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                இறைவசனம்
                            </label>
                            <textarea
                                name="verseTamil"
                                placeholder="இறைவசனத்தை இங்கு டைப் செய்யவும்..."
                                value={formData.verseTamil}
                                onChange={handleChange}
                                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-600 focus:bg-white font-serif italic text-stone-800 transition-all resize-none"
                                rows={4}
                                required
                            />
                        </div>

                        {/* REFERENCE INPUT */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                வசன குறிப்பு
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    name="referenceTamil"
                                    placeholder="உதா: சங்கீதம் 23:1"
                                    value={formData.referenceTamil}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* DATE ACCORDION */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                தேதி
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                <input
                                    type="date"
                                    name="verseDate"
                                    value={formData.verseDate}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all text-stone-700"
                                    required
                                />
                            </div>
                        </div>

                        {/* TODAY CHECKBOX WRAPPER */}
                        <div className="pt-1">
                            <label className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100 cursor-pointer select-none text-xs md:text-sm font-medium text-stone-700 hover:bg-stone-100/70 transition-colors">
                                <input
                                    type="checkbox"
                                    name="isTodayVerse"
                                    checked={formData.isTodayVerse}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-[#4a0e17] rounded cursor-pointer"
                                />
                                <span>இன்றைய முதன்மை இறைவசனம்</span>
                            </label>
                        </div>

                        {/* SUBMIT BUTTON ACTIONS */}
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-[#4a0e17] hover:bg-[#3a0a10] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-xs"
                            >
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                {editingId ? "இறைவசனத்தை புதுப்பி" : "வசனத்தை வெளியிடு"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId("");
                                        setFormData({
                                            verseTamil: "",
                                            referenceTamil: "",
                                            verseDate: "",
                                            isTodayVerse: false,
                                        });
                                    }}
                                    className="w-full flex items-center justify-center gap-1 bg-stone-100 text-stone-600 hover:bg-stone-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    <XCircle className="w-3.5 h-3.5" /> ரத்து செய்
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* VERSE OUTPUT LISTED LEDGER (2 Columns on Large Screens) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="font-serif font-bold text-stone-800 text-base">
                            பதிவுசெய்யப்பட்ட இறைவசனங்கள் ({verses.length})
                        </h3>
                    </div>

                    {verses.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm font-light">
                            தற்போது வரை இறைவசனங்கள் எதுவும் பதிவேற்றப்படவில்லை.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {verses.map((verse) => (
                                <div
                                    key={verse._id}
                                    className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-4"
                                >
                                    <div>
                                        {/* Content Display Layer */}
                                        <p className="text-base font-serif italic text-stone-900 leading-relaxed pl-3 border-l-2 border-amber-600/40">
                                            "{verse.verseTamil}"
                                        </p>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-stone-500 pl-3">
                                            <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                {verse.referenceTamil}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium text-stone-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(verse.verseDate).toLocaleDateString("ta-IN", {
                                                    year: "numeric", month: "long", day: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Utilities Footer Row */}
                                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                                        <div>
                                            {verse.isTodayVerse && (
                                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> இன்றைய முக்கிய வசனம்
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => editVerse(verse)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-lg text-stone-600 transition-colors"
                                                title="Edit Entry"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> திருத்து
                                            </button>
                                            <button
                                                onClick={() => deleteVerse(verse._id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-rose-50 hover:text-rose-700 border border-stone-200 rounded-lg text-stone-600 transition-colors"
                                                title="Delete Entry"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> நீக்கு
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