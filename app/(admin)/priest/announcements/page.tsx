"use client";

import { useState, useEffect, useRef } from "react";
import {
    Upload,
    Trash2,
    Edit2,
    X,
    Loader2,
    Image as ImageIcon,
    CheckCircle,
    Calendar,
    PlusCircle,
    XCircle
} from "lucide-react";

export default function AnnouncementAdmin() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State Configurations
    const [editId, setEditId] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingPreviews, setExistingPreviews] = useState<any[]>([]); // For retaining/editing images
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch("/api/announcements");
            const result = await res.json();
            if (result.success) setAnnouncements(result.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingPreview = (index: number) => {
        setExistingPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleEditInit = (item: any) => {
        setEditId(item._id);
        setExistingPreviews(item.images || []);
        setSelectedFiles([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setExistingPreviews([]);
        setSelectedFiles([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();

            if (editId) {
                // Edit Mode Pipeline Execution
                formData.append("retainedImages", JSON.stringify(existingPreviews));
                selectedFiles.forEach(file => formData.append("newImages", file));

                const res = await fetch(`/api/announcements/${editId}`, {
                    method: "PUT",
                    body: formData,
                });
                const data = await res.json();
                if (data.success) handleCancelEdit();
            } else {
                // Creation Mode Pipeline Execution
                selectedFiles.forEach(file => formData.append("images", file));

                const res = await fetch("/api/announcements", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.success) setSelectedFiles([]);
            }
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to completely erase this announcement item?")) return;
        try {
            const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) fetchAnnouncements();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">

            {/* Page Header Banner */}
            <header className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">
                            📣 அறிவிப்புகள் மேலாண்மை
                        </h1>
                        <p className="text-xs md:text-sm text-stone-500 mt-0.5">
                            Upload and adjust bulk visual files pushed onto user dashboards.
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
                            {editId ? "தொகுப்பை திருத்தவும்" : "புதிய படங்கள் சேர்க்க"}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* FILE UPLOAD DROPZONE */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                                படங்களை தேர்வு செய்யவும்
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-stone-200 hover:border-amber-600/50 rounded-xl p-6 text-center cursor-pointer bg-stone-50/50 transition-all group"
                            >
                                <Upload className="w-6 h-6 text-stone-400 group-hover:text-amber-800 mx-auto mb-2 transition-colors" />
                                <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-800 transition-colors">
                                    Click to Select Images
                                </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {/* LIVE PREVIEW TRACK: Newly picked items awaiting submission */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-2 pt-1">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-800 block">
                                    புதிய படங்கள் ({selectedFiles.length}):
                                </span>
                                <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2 rounded-xl border border-stone-100">
                                    {selectedFiles.map((file, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 group bg-stone-100">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedFile(idx)}
                                                className="absolute inset-0 bg-stone-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* LIVE PREVIEW TRACK: Existing image sets parsed inside target edit context item */}
                        {editId && existingPreviews.length > 0 && (
                            <div className="space-y-2 border-t border-stone-100 pt-3">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block">
                                    தற்போதைய படங்கள் ({existingPreviews.length}):
                                </span>
                                <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2 rounded-xl border border-stone-100">
                                    {existingPreviews.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 group bg-stone-100">
                                            <img src={img.url} alt="existing preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingPreview(idx)}
                                                className="absolute inset-0 bg-rose-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SUBMIT BUTTON ACTIONS */}
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={submitting || (!editId && selectedFiles.length === 0)}
                                className="w-full flex items-center justify-center gap-2 bg-[#4a0e17] hover:bg-[#3a0a10] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-xs disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 text-amber-400" />
                                )}
                                {editId ? "தொகுப்பை புதுப்பி" : "தொகுப்பை சேமி"}
                            </button>

                            {editId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="w-full flex items-center justify-center gap-1 bg-stone-100 text-stone-600 hover:bg-stone-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    <XCircle className="w-3.5 h-3.5" /> ரத்து செய்
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* OUTPUT ANNOUNCEMENT LISTING (2 Columns on Large Screens) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="font-serif font-bold text-stone-800 text-base">
                            பதிவுசெய்யப்பட்ட அறிவிப்புகள் ({announcements.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-16 bg-white rounded-2xl border border-stone-200">
                            <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm font-light">
                            தற்போது வரை அறிவிப்புகள் எதுவும் பதிவேற்றப்படவில்லை.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {announcements.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-4"
                                >
                                    {/* Multi Image Bundle Row Render block mapping */}
                                    <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden bg-stone-50 p-1.5 border border-stone-100/70">
                                        {item.images?.slice(0, 3).map((img: any, idx: number) => (
                                            <div key={idx} className="relative aspect-video bg-stone-200 overflow-hidden rounded-lg border border-stone-200/50">
                                                <img src={img.url} alt="stacked visual asset" className="w-full h-full object-cover" />
                                                {idx === 2 && item.images.length > 3 && (
                                                    <div className="absolute inset-0 bg-stone-900/70 text-white font-sans font-bold text-xs flex items-center justify-center">
                                                        +{item.images.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Utilities Footer Row */}
                                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                                        <span className="flex items-center gap-1 font-medium text-stone-400 text-xs">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(item.createdAt).toLocaleDateString("ta-IN", {
                                                year: "numeric", month: "short", day: "numeric"
                                            })}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditInit(item)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-lg text-stone-600 transition-colors"
                                                title="Edit Entry"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> திருத்து
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
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