"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
    Calendar, Image as ImageIcon, MapPin, Trash2, Edit2,
    Sparkles, PlusCircle, Inbox, AlertCircle, XCircle, ChevronLeft, ChevronRight
} from "lucide-react";

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pagination metrics
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form Tracking States
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [activityDate, setActivityDate] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchActivities = useCallback(async (targetPage: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/priest/activities?page=${targetPage}&limit=6`);
            const json = await res.json();
            if (json.success) {
                setActivities(json.data || []);
                setTotalPages(json.pagination.totalPages || 1);
            }
        } catch (err) {
            setErrorMsg("Failed to synchronize activities ledger.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivities(page);
    }, [page, fetchActivities]);

    const handleResetForm = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setLocation("");
        setActivityDate("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setErrorMsg(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile && !editingId) {
            setErrorMsg("Please select an activity image file.");
            return;
        }

        setSubmitting(true);
        setErrorMsg(null);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("activityDate", activityDate);
        if (selectedFile) formData.append("image", selectedFile);

        try {
            const url = editingId ? `/api/priest/activities/${editingId}` : "/api/priest/activities";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, { method, body: formData });
            const json = await res.json();

            if (json.success) {
                handleResetForm();
                fetchActivities(page);
            } else {
                setErrorMsg(json.message);
            }
        } catch (err) {
            setErrorMsg("Network execution fault during transit operation.");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (act: any) => {
        setEditingId(act._id);
        setTitle(act.title);
        setDescription(act.description);
        setLocation(act.location);
        setActivityDate(act.activityDate ? act.activityDate.split("T")[0] : "");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event and its cloud image?")) return;
        try {
            const res = await fetch(`/api/priest/activities/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                const updatedPage = activities.length === 1 ? Math.max(page - 1, 1) : page;
                setPage(updatedPage);
                fetchActivities(updatedPage);
            }
        } catch (err) {
            alert("Failed to complete system asset erasure.");
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12 px-4 sm:px-6 animate-fade-in">
            {/* Header banner */}
            <header className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">📸 நிகழ்வுகள் மேலாண்மை (Activities Console)</h1>
                        <p className="text-xs md:text-sm text-stone-500 mt-0.5">Upload neighborhood updates and feast activities directly into the secure cloud stack.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* 📝 creation & Editing Workspace Panel Form */}
                <div className="bg-white shadow-xs rounded-2xl p-5 border border-stone-200/80 lg:sticky lg:top-24">
                    <h3 className="font-serif font-bold text-stone-900 text-base pb-3 mb-5 border-b border-stone-100 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-amber-800" />
                        <span>{editingId ? "நிகழ்வை திருத்தவும்" : "புதிய நிகழ்வைச் சேர்க்க"}</span>
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">தலைப்பு (Title)</label>
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title Name..." className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-800" />
                        </div>

                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">விவரம் (Description)</label>
                            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Context summaries..." className="w-full bg-stone-50/50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-800 resize-none" />
                        </div>

                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">இடம் (Location)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Parish Hall / Grounds..." className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-800" />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">தேதி (Date)</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                <input type="date" required value={activityDate} onChange={(e) => setActivityDate(e.target.value)} className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-700" />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                                புகைப்படம் {editingId && <span className="text-[10px] text-amber-700 font-normal italic lowercase">(Optional)</span>}
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && !file.type.startsWith("image/")) {
                                        setErrorMsg("Invalid file type. Please select an image file.");
                                        setSelectedFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    } else if (file) {
                                        setSelectedFile(file);
                                        setErrorMsg(null);
                                    }
                                }}
                                className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-900 hover:file:bg-amber-100 cursor-pointer"
                            />
                        </div>

                        {errorMsg && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-1">
                            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-[#4a0e17] hover:bg-[#3a0a10] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-xs cursor-pointer disabled:opacity-50">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span>{submitting ? "செயலாக்கப்படுகிறது..." : editingId ? "மாற்றங்களைச் சேமி" : "சேமி மற்றும் பதிவேற்று"}</span>
                            </button>

                            {editingId && (
                                <button type="button" onClick={handleResetForm} className="w-full flex items-center justify-center gap-1 bg-stone-100 text-stone-600 hover:bg-stone-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer">
                                    <XCircle className="w-3.5 h-3.5" /> ரத்து செய் (Cancel)
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 📜 Dynamic Output Segment Layer with Grid Pagination */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-serif font-bold text-stone-800 text-base">பதிவேற்றப்பட்ட நிகழ்வுகள் ({activities.length})</h3>

                    {loading && activities.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 text-stone-400 text-sm italic animate-pulse">
                            Loading registers from cloud stack...
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm">
                            <Inbox className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                            நிகழ்வுகள் எதுவும் காணப்படவில்லை.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4">
                                {activities.map((act) => (
                                    <div key={act._id} className="bg-white rounded-2xl border border-stone-200/80 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-2xs hover:shadow-xs transition-all">
                                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center min-w-0">
                                            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0 relative">
                                                <img src={act.s3Url} alt="" className="w-full h-full object-cover" />
                                            </div>

                                            <div className="space-y-1.5 min-w-0">
                                                <h4 className="font-serif font-bold text-stone-900 text-base leading-tight truncate">{act.title}</h4>
                                                <p className="text-xs text-stone-600 line-clamp-2 pr-2">{act.description}</p>

                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-stone-400">
                                                    <span className="flex items-center gap-1 text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/60 font-semibold">
                                                        <MapPin className="w-3 h-3 text-amber-700" /> {act.location}
                                                    </span>
                                                    <span className="flex items-center gap-1 py-0.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(act.activityDate).toLocaleDateString("ta-IN", { dateStyle: "medium" })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                            <button onClick={() => startEdit(act)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-xl text-stone-600 transition-colors cursor-pointer">
                                                <Edit2 className="w-3.5 h-3.5" /> திருத்து
                                            </button>
                                            <button onClick={() => handleDelete(act._id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-rose-50 hover:text-rose-700 border border-stone-200 rounded-xl text-stone-600 transition-colors cursor-pointer">
                                                <Trash2 className="w-3.5 h-3.5" /> நீக்கு
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 🧭 Pagination Footer Bar Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                                    <button
                                        disabled={page === 1 || loading}
                                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-600 disabled:opacity-40 transition-colors cursor-pointer"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" /> முந்தைய (Prev)
                                    </button>

                                    <span className="text-xs font-medium text-stone-500 font-mono">
                                        {page} / {totalPages}
                                    </span>

                                    <button
                                        disabled={page === totalPages || loading}
                                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-600 disabled:opacity-40 transition-colors cursor-pointer"
                                    >
                                        அடுத்து (Next) <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}