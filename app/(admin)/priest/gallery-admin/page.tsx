"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Edit2, Plus, Calendar, Tag, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface IGalleryImage {
    url: string;
    s3Key: string;
}

interface IGalleryEvent {
    _id: string;
    titleEn: string;
    titleTa: string;
    descriptionEn: string;
    descriptionTa: string;
    category: "general" | "feast" | "mass" | "youth";
    eventDate: string;
    images: IGalleryImage[];
    isExpired: boolean;
}

export default function GalleryAdminDashboard() {
    // State management
    const [events, setEvents] = useState<IGalleryEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [titleEn, setTitleEn] = useState("");
    const [titleTa, setTitleTa] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [descriptionTa, setDescriptionTa] = useState("");
    const [category, setCategory] = useState<"general" | "feast" | "mass" | "youth">("general");
    const [eventDate, setEventDate] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch all gallery items on mount
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            // Assumes your GET route without an ID fetches all events
            const res = await fetch("/api/gallery");
            const result = await res.json();
            if (result.success) {
                setEvents(result.data || []);
            }
        } catch (err) {
            showStatus("error", "Failed to reload gallery events list.");
        } finally {
            setLoading(false);
        }
    };

    const showStatus = (type: "success" | "error", text: string) => {
        setStatusMsg({ type, text });
        setTimeout(() => setStatusMsg(null), 5000);
    };

    const resetForm = () => {
        setEditingId(null);
        setTitleEn("");
        setTitleTa("");
        setDescriptionEn("");
        setDescriptionTa("");
        setCategory("general");
        setEventDate("");
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Populate form fields for edit lifecycle execution
    const startEdit = (event: IGalleryEvent) => {
        setEditingId(event._id);
        setTitleEn(event.titleEn);
        setTitleTa(event.titleTa);
        setDescriptionEn(event.descriptionEn || "");
        setDescriptionTa(event.descriptionTa || "");
        setCategory(event.category);
        // Format date string beautifully to YYYY-MM-DD for the input tag context
        setEventDate(new Date(event.eventDate).toISOString().split("T")[0]);
        setSelectedFiles([]);
    };

    // Core submission pipeline logic (Handles POST & PUT seamlessly)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("titleEn", titleEn);
            formData.append("titleTa", titleTa);
            formData.append("descriptionEn", descriptionEn);
            formData.append("descriptionTa", descriptionTa);
            formData.append("category", category);
            formData.append("eventDate", eventDate);

            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });

            const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, { method, body: formData });
            const result = await res.json();

            if (res.ok) {
                showStatus("success", editingId ? "Event details updated elegantly." : "Fresh gallery asset synced perfectly.");
                resetForm();
                fetchEvents();
            } else {
                showStatus("error", result.error || "Execution dropped inside data flow pipeline.");
            }
        } catch (err) {
            showStatus("error", "An unexpected operational storage error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    // DELETE operation orchestrator pipeline
    const handleDelete = async (id: string) => {
        if (!confirm("Are you absolutely sure you want to completely purge this event and all its S3 images?")) return;

        try {
            const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
            const result = await res.json();

            if (res.ok) {
                showStatus("success", "Event and assets fully purged from cloud stack.");
                fetchEvents();
            } else {
                showStatus("error", result.error || "Wipe cycle halted on data tier.");
            }
        } catch (err) {
            showStatus("error", "Failed to reach server pipeline.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
            <div className="mx-auto max-w-7xl">

                {/* Header Block */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Church Gallery Workspace</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage multilingual event metadata details and stream binaries directly to AWS S3 storage stacks.</p>
                    </div>
                </div>

                {/* Floating System Status Banners */}
                {statusMsg && (
                    <div className={`mb-6 flex items-center gap-3 rounded-lg p-4 text-sm font-medium transition-all duration-300 ${statusMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}>
                        {statusMsg.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-600" />}
                        <span>{statusMsg.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* Action Input Form Section (1/3 Width Layout Context) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                {editingId ? <Edit2 className="h-4 w-4 text-amber-500" /> : <Plus className="h-5 w-5 text-indigo-500" />}
                                {editingId ? "Modify Existing Event" : "Create New Event Entry"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Title (English) *</label>
                                    <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none" placeholder="Easter Mass Celebration" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Title (Tamil) *</label>
                                    <input type="text" value={titleTa} onChange={(e) => setTitleTa(e.target.value)} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none" placeholder="உயிர்த்த ஞாயிறு திருப்பலி" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category *</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none">
                                            <option value="general">General</option>
                                            <option value="feast">Feast</option>
                                            <option value="mass">Mass</option>
                                            <option value="youth">Youth</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Event Date *</label>
                                        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description (English)</label>
                                    <textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none" placeholder="Details regarding liturgical event layout..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description (Tamil)</label>
                                    <textarea value={descriptionTa} onChange={(e) => setDescriptionTa(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none" placeholder="நிகழ்வு பற்றிய விபரங்கள்..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        {editingId ? "Append More Images" : "Upload Event Images *"}
                                    </label>
                                    <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-slate-200 px-6 py-4 bg-slate-50 hover:bg-slate-100 transition">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-8 w-8 text-slate-400" />
                                            <div className="flex text-sm text-slate-600">
                                                <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:outline-none hover:text-indigo-500">
                                                    <span>Select Files</span>
                                                    <input ref={fileInputRef} type="file" multiple accept="image/*" required={!editingId} onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} className="sr-only" />
                                                </label>
                                            </div>
                                            {selectedFiles.length > 0 && (
                                                <p className="text-xs text-indigo-600 font-semibold">{selectedFiles.length} files staged to upload</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button type="submit" disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-50">
                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                        {editingId ? "Update Event" : "Publish Event"}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={resetForm} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Interactive Live Data Grid Output (2/3 Width Layout Context) */}
                    <div className="lg:col-span-2">
                        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2 text-slate-700">
                            Active Server Records ({events.length})
                        </h2>

                        {loading ? (
                            <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            </div>
                        ) : events.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center">
                                <p className="text-slate-500">No events parsed inside current database collection layers.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <div key={event._id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                                            {/* Main Copy Details info segment */}
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize">
                                                        <Tag className="mr-0.5 h-3 w-3" /> {event.category}
                                                    </span>
                                                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${event.isExpired ? "bg-amber-50 text-amber-800 border border-amber-100" : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                                        }`}>
                                                        {event.isExpired ? "Archived / Expired" : "Active Event"}
                                                    </span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                                                        <Calendar className="h-3 w-3" /> {new Date(event.eventDate).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                                                    {event.titleEn} <span className="text-slate-300 font-light mx-1">|</span> <span className="font-medium text-slate-600 text-sm font-sans">{event.titleTa}</span>
                                                </h3>

                                                {(event.descriptionEn || event.descriptionTa) && (
                                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                                        {event.descriptionEn || event.descriptionTa}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Explicit Interactive Control Handles */}
                                            <div className="flex items-center gap-1.5 sm:self-start">
                                                <button onClick={() => startEdit(event)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition" title="Modify details">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(event._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition" title="Wipe out track">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Horizontal Scroller Preview for Images attached to document instance */}
                                        {event.images && event.images.length > 0 && (
                                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                                {event.images.map((img, index) => (
                                                    <div key={index} className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-100">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={img.url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}