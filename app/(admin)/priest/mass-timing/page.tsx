"use client";

import { useEffect, useState } from "react";
import {
    Church,
    Calendar,
    Clock,
    User,
    FileText,
    PlusCircle,
    Edit2,
    Trash2,
    XCircle,
    Sparkles,
    MapPin,
    Tag
} from "lucide-react";

export default function MassTimingPage() {
    // MASS STATE
    const [masses, setMasses] = useState<any[]>([]);

    // EDIT STATE
    const [editingId, setEditingId] = useState("");

    // FORM STATE
    const [formData, setFormData] = useState({
        titleTamil: "",
        massTypeTamil: "வழக்கமான திருப்பலி",
        dayTamil: "",
        massDate: "",
        timeTamil: "",
        placeTypeTamil: "பங்கு ஆலயம்",
        placeNameTamil: "",
        priestNameTamil: "",
        descriptionTamil: "",
    });

    // GET ALL MASS
    const fetchMasses = async () => {
        try {
            const res = await fetch("/api/priest/MassTiming");
            const data = await res.json();
            setMasses(data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    // LOAD DATA
    useEffect(() => {
        fetchMasses();
    }, []);

    // HANDLE INPUT CHANGE
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // CREATE OR UPDATE
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await fetch(`/api/priest/MassTiming/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                alert("திருப்பலி புதுப்பிக்கப்பட்டது");
            } else {
                await fetch("/api/priest/MassTiming", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                alert("திருப்பலி சேர்க்கப்பட்டது");
            }

            // RESET
            setFormData({
                titleTamil: "",
                massTypeTamil: "வழக்கமான திருப்பலி",
                dayTamil: "",
                massDate: "",
                timeTamil: "",
                placeTypeTamil: "பங்கு ஆலயம்",
                placeNameTamil: "",
                priestNameTamil: "",
                descriptionTamil: "",
            });
            setEditingId("");
            fetchMasses();
        } catch (error) {
            console.log(error);
        }
    };

    // DELETE MASS
    const deleteMass = async (id: string) => {
        const confirmDelete = confirm("நீக்க வேண்டுமா?");
        if (!confirmDelete) return;

        try {
            await fetch(`/api/priest/MassTiming/${id}`, { method: "DELETE" });
            alert("திருப்பலி நீக்கப்பட்டது");
            fetchMasses();
        } catch (error) {
            console.log(error);
        }
    };

    // EDIT MASS
    const editMass = (mass: any) => {
        setEditingId(mass._id);
        setFormData({
            titleTamil: mass.titleTamil,
            massTypeTamil: mass.massTypeTamil,
            dayTamil: mass.dayTamil,
            massDate: mass.massDate?.split("T")[0] || "",
            timeTamil: mass.timeTamil,
            placeTypeTamil: mass.placeTypeTamil,
            placeNameTamil: mass.placeNameTamil,
            priestNameTamil: mass.priestNameTamil,
            descriptionTamil: mass.descriptionTamil || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in">

            {/* Page Header Banner */}
            <header className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                        <Church className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">
                            ⛪ திருப்பலி மேலாண்மை
                        </h1>
                        <p className="text-xs md:text-sm text-stone-500 mt-0.5">
                            Schedule and update Holy Mass timings for the main parish and substation chapels.
                        </p>
                    </div>
                </div>
            </header>

            {/* Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* FORM INPUT PANEL (1 Column Stacked) */}
                <div className="bg-white shadow-xs rounded-2xl p-5 border border-stone-200/80 lg:sticky lg:top-6">
                    <div className="flex items-center gap-2 pb-3 mb-5 border-b border-stone-100">
                        <PlusCircle className="w-4 h-4 text-amber-800" />
                        <h3 className="font-serif font-bold text-stone-900 text-base">
                            {editingId ? "திருப்பலியை திருத்தவும்" : "புதிய திருப்பலி சேர்க்க"}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Mass Title */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                திருப்பலி பெயர்
                            </label>
                            <input
                                type="text"
                                name="titleTamil"
                                placeholder="உதா: ஞாயிறு காலை கூட்டுத்திருப்பலி"
                                value={formData.titleTamil}
                                onChange={handleChange}
                                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Mass Type & Liturgical Day Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                    திருப்பலி வகை
                                </label>
                                <select
                                    name="massTypeTamil"
                                    value={formData.massTypeTamil}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all text-stone-700"
                                >
                                    <option value="வழக்கமான திருப்பலி">வழக்கமான திருப்பலி</option>
                                    <option value="சிறப்பு திருப்பலி">சிறப்பு திருப்பலி</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                    கிழமை
                                </label>
                                <input
                                    type="text"
                                    name="dayTamil"
                                    placeholder="ஞாயிற்றுக்கிழமை"
                                    value={formData.dayTamil}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Date & Time Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                    தேதி (விருப்பமிருந்தால்)
                                </label>
                                <input
                                    type="date"
                                    name="massDate"
                                    value={formData.massDate}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all text-stone-700"
                                />
                            </div>
                            <div>
                                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                    நேரம்
                                </label>
                                <input
                                    type="text"
                                    name="timeTamil"
                                    placeholder="07:00 காலை"
                                    value={formData.timeTamil}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Altar Structure Settings */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                    ஆலய வகை
                                </label>
                                <select
                                    name="placeTypeTamil"
                                    value={formData.placeTypeTamil}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all text-stone-700"
                                >
                                    <option value="பங்கு ஆலயம்">பங்கு ஆலயம்</option>
                                    <option value="கிராம ஆலயம்">கிராம ஆலயம்</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                    ஆலய பெயர்
                                </label>
                                <input
                                    type="text"
                                    name="placeNameTamil"
                                    placeholder="ஆலய பெயர்"
                                    value={formData.placeNameTamil}
                                    onChange={handleChange}
                                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Celebrant Priest Name */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                அருட்தந்தை பெயர்
                            </label>
                            <input
                                type="text"
                                name="priestNameTamil"
                                placeholder="அருட்தந்தை பெயர்"
                                value={formData.priestNameTamil}
                                onChange={handleChange}
                                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                            />
                        </div>

                        {/* Liturgical Descriptions Textarea */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                விளக்கம் (விருப்பமிருந்தால்)
                            </label>
                            <textarea
                                name="descriptionTamil"
                                placeholder="திருப்பலி சிறப்புகள் பற்றிய குறிப்புகள்..."
                                value={formData.descriptionTamil}
                                onChange={handleChange}
                                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-all resize-none"
                                rows={3}
                            />
                        </div>

                        {/* ACTION CONTROLS */}
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-[#4a0e17] hover:bg-[#3a0a10] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-xs"
                            >
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                {editingId ? "விவரங்களை புதுப்பி" : "திருப்பலியை சேமி"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId("");
                                        setFormData({
                                            titleTamil: "",
                                            massTypeTamil: "வழக்கமான திருப்பலி",
                                            dayTamil: "",
                                            massDate: "",
                                            timeTamil: "",
                                            placeTypeTamil: "பங்கு ஆலயம்",
                                            placeNameTamil: "",
                                            priestNameTamil: "",
                                            descriptionTamil: "",
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

                {/* TIMING LEDGER SECTION (2 Columns on Desktop) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between pb-1">
                        <h3 className="font-serif font-bold text-stone-800 text-base">
                            திருப்பலி அட்டவணை ({masses.length})
                        </h3>
                    </div>

                    {masses.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm font-light">
                            தற்போது வரை திருப்பலி நேரங்கள் எதுவும் பதிவேற்றப்படவில்லை.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {masses.map((mass) => (
                                <div
                                    key={mass._id}
                                    className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-4"
                                >
                                    <div className="space-y-3">
                                        {/* Main Content Info Block Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                            <div>
                                                <h4 className="text-base md:text-lg font-serif font-bold text-stone-900 leading-snug">
                                                    {mass.titleTamil}
                                                </h4>
                                                <div className="flex flex-wrap gap-2 mt-1.5">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-100">
                                                        <Tag className="w-3 h-3 text-amber-700" /> {mass.massTypeTamil}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                                                        <MapPin className="w-3 h-3 text-stone-500" /> {mass.placeTypeTamil}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Clock & Day Indicator Flag */}
                                            <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100 flex items-center gap-2 self-start sm:text-right">
                                                <Clock className="w-4 h-4 text-[#4a0e17]" />
                                                <div className="text-xs">
                                                    <div className="font-bold text-stone-800">{mass.timeTamil}</div>
                                                    <div className="text-[10px] text-stone-400 font-medium">{mass.dayTamil}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meta Descriptions Layout */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-stone-600 border-t border-stone-50">
                                            <div className="flex items-center gap-2">
                                                <Church className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                                                <span className="truncate"><strong>இடம்:</strong> {mass.placeNameTamil}</span>
                                            </div>
                                            {mass.priestNameTamil && (
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                                                    <span className="truncate"><strong>குரு:</strong> {mass.priestNameTamil}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Optional Liturgical Descriptions */}
                                        {mass.descriptionTamil && (
                                            <p className="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100 font-light leading-relaxed">
                                                {mass.descriptionTamil}
                                            </p>
                                        )}

                                        {/* Optional Specific Calendar Date Tag */}
                                        {mass.massDate && (
                                            <div className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                குறிப்பிட்ட தேதி: {new Date(mass.massDate).toLocaleDateString("ta-IN")}
                                            </div>
                                        )}
                                    </div>

                                    {/* FOOTER ACTIONS MANAGEMENT TRASH AND EDIT */}
                                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                                        <button
                                            onClick={() => editMass(mass)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-lg text-stone-600 transition-colors"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> திருத்து
                                        </button>
                                        <button
                                            onClick={() => deleteMass(mass._id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-rose-50 hover:text-rose-700 border border-stone-200 rounded-lg text-stone-600 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> நீக்கு
                                        </button>
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