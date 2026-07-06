"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Edit2, Plus, X, Loader2, Image as ImageIcon, CheckCircle } from "lucide-react";

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
        <div className="min-h-screen bg-stone-50 text-stone-900 pt-28 pb-16 px-4 max-w-5xl mx-auto space-y-10">

            {/* Dynamic Header Block */}
            <div className="border-b border-stone-200 pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-serif font-black tracking-tight">Announcement Board Hub</h1>
                    <p className="text-xs text-stone-500 mt-1">Upload and adjust bulk visual files pushed onto user dashboards.</p>
                </div>
                <div className="p-2 bg-amber-500/10 text-amber-700 rounded-xl border border-amber-500/20">
                    <ImageIcon className="w-5 h-5" />
                </div>
            </div>

            {/* Control Dashboard Action Forms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Form panel section control slot */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm h-fit space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                        {editId ? "🔧 Edit Bundle File Stack" : "📤 Add New Images Stack"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-stone-200 hover:border-amber-500/50 rounded-xl p-6 text-center cursor-pointer bg-stone-50/50 transition-all group"
                        >
                            <Upload className="w-6 h-6 text-stone-400 group-hover:text-amber-600 mx-auto mb-2 transition-colors" />
                            <span className="text-xs font-semibold text-stone-600">Select Multiple Images</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* LIVE PREVIEW TRACK: Newly picked items awaiting submission */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-600">New files to upload:</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {selectedFiles.map((file, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 group bg-stone-100">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedFile(idx)}
                                                className="absolute inset-0 bg-stone-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
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
                                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Existing Active Images:</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {existingPreviews.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 group bg-stone-100">
                                            <img src={img.url} alt="existing preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingPreview(idx)}
                                                className="absolute inset-0 bg-red-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={submitting || (!editId && selectedFiles.length === 0)}
                                className="flex-1 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                <span>{editId ? "Update" : "Save Stack"}</span>
                            </button>

                            {editId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-600 font-bold text-xs uppercase tracking-wider px-3 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Existing records listing grid viewport */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">Live Feeds Stream Collection</h3>

                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>
                    ) : announcements.length === 0 ? (
                        <div className="text-center p-12 border border-stone-200 bg-white rounded-2xl text-xs text-stone-400 italic">No announcements items deploy arrays found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {announcements.map((item) => (
                                <div key={item._id} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between gap-4">

                                    {/* Multi Image Bundle Row Render block mapping */}
                                    <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden bg-stone-50 p-1.5 border border-stone-100">
                                        {item.images?.slice(0, 3).map((img: any, idx: number) => (
                                            <div key={idx} className="relative aspect-video bg-stone-200 overflow-hidden rounded-md">
                                                <img src={img.url} alt="stacked visual asset" className="w-full h-full object-cover" />
                                                {idx === 2 && item.images.length > 3 && (
                                                    <div className="absolute inset-0 bg-stone-900/70 text-white font-sans font-bold text-xs flex items-center justify-center">
                                                        +{item.images.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions unit control dashboard links elements button rows */}
                                    <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                                        <span className="text-[10px] font-mono text-stone-400">
                                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditInit(item)}
                                                className="p-2 text-stone-500 bg-stone-50 border border-stone-200 hover:text-amber-700 hover:border-amber-200 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-stone-400 bg-stone-50 border border-stone-200 hover:text-red-600 hover:border-red-200 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
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