"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Calendar, FolderOpen, FileText, CheckCircle2, AlertCircle, Images, LayoutDashboard, ArrowLeft } from "lucide-react";
import Link from "next/link";

type CategoryType = "general" | "feast" | "mass" | "youth";

interface FormStatus {
    type: "idle" | "loading" | "success" | "error";
    message: string;
}

export default function GalleryAdminPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

    const [formData, setFormData] = useState({
        titleEn: "",
        titleTa: "",
        descriptionEn: "",
        descriptionTa: "",
        category: "general" as CategoryType,
        eventDate: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...selectedFiles]);

            const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0) {
            setStatus({ type: "error", message: "Please select at least one image file to upload." });
            return;
        }

        setStatus({ type: "loading", message: "Uploading assets directly to S3 and syncing MongoDB..." });

        try {
            const dataPayload = new FormData();
            dataPayload.append("titleEn", formData.titleEn);
            dataPayload.append("titleTa", formData.titleTa);
            dataPayload.append("descriptionEn", formData.descriptionEn);
            dataPayload.append("descriptionTa", formData.descriptionTa);
            dataPayload.append("category", formData.category);
            dataPayload.append("eventDate", formData.eventDate);

            images.forEach((file) => {
                dataPayload.append("images", file);
            });

            const response = await fetch("/api/gallery/upload", {
                method: "POST",
                body: dataPayload,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong during execution.");
            }

            setStatus({ type: "success", message: "Gallery structural record saved completely!" });

            // Reset State parameters
            setFormData({ titleEn: "", titleTa: "", descriptionEn: "", descriptionTa: "", category: "general", eventDate: "" });
            setImages([]);
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
            setPreviewUrls([]);

        } catch (err: any) {
            setStatus({ type: "error", message: err.message || "Network transaction execution failed." });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

            {/* Top Sticky Dashboard Navigation Bar */}
            <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                            <Images className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-white tracking-wide">Gallery Control Center</h1>
                            <p className="text-xs text-slate-500 font-medium">Administrative Storage Space</p>
                        </div>
                    </div>
                    <Link
                        href="/priest/dashboard"
                        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all"
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                    </Link>
                </div>
            </header>

            {/* Main Structural Core Workspace Wrapper */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <Link href="/priest/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 font-medium transition">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to main control panel</span>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight text-white mt-3 sm:text-3xl">Event Media Pipeline</h2>
                    <p className="text-sm text-slate-400 mt-1">Upload dynamic event image arrays and sync parameters into your database model structure.</p>
                </div>

                {/* Uploading Core Card Interface Layout */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title Selection Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Title (English) *</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <input type="text" name="titleEn" required value={formData.titleEn} onChange={handleInputChange} placeholder="e.g., Pentecost Feast Mass" className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Title (Tamil) *</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <input type="text" name="titleTa" required value={formData.titleTa} onChange={handleInputChange} placeholder="எ.கா., பெந்தெகொஸ்தே திருவிழா திருப்பலி" className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition" />
                                </div>
                            </div>
                        </div>

                        {/* Descriptions Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Description (English)</label>
                                <textarea name="descriptionEn" rows={3} value={formData.descriptionEn} onChange={handleInputChange} placeholder="Provide context details..." className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Description (Tamil)</label>
                                <textarea name="descriptionTa" rows={3} value={formData.descriptionTa} onChange={handleInputChange} placeholder="விவரங்களை இங்கே உள்ளிடவும்..." className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition resize-none" />
                            </div>
                        </div>

                        {/* Date & Choosing Keyword Selection Layer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Event Date *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none transition [color-scheme:dark]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Category Tag Keyword *</label>
                                <div className="relative">
                                    <FolderOpen className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none transition appearance-none">
                                        <option value="general">General (பொதுவானவை)</option>
                                        <option value="feast">Feast (திருவிழா)</option>
                                        <option value="mass">Mass (திருப்பலி)</option>
                                        <option value="youth">Youth (இளைஞர்கள்)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Interactive File Dropzone Interceptor */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Media Files *</label>
                            <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950 rounded-lg p-8 text-center cursor-pointer transition group">
                                <input type="file" ref={fileInputRef} multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                                <Upload className="w-8 h-8 text-slate-500 group-hover:text-slate-400 mx-auto mb-3 transition-transform group-hover:-translate-y-0.5" />
                                <p className="text-sm font-medium text-slate-300">Click to browse your device files</p>
                                <p className="text-xs text-slate-500 mt-1">Multi-file parsing supported for JPEG, PNG, or WebP formats</p>
                            </div>
                        </div>

                        {/* Selection Grid Preview Queue Box */}
                        {previewUrls.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Upload Previews Queue ({previewUrls.length})</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
                                    {previewUrls.map((url, index) => (
                                        <div key={url} className="relative aspect-square rounded-md overflow-hidden bg-slate-900 border border-slate-800 group">
                                            <img src={url} alt="Local asset snapshot item layout" className="object-cover w-full h-full" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1.5 right-1.5 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-xs transition shadow-md">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dynamic Realtime API Transaction Status Feedback Messages bar */}
                        {status.type !== "idle" && (
                            <div className={`flex items-start gap-3 p-4 rounded-lg border text-sm transition-all ${status.type === "loading" ? "bg-indigo-950/40 border-indigo-900/60 text-indigo-300" :
                                    status.type === "success" ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-300" :
                                        "bg-rose-950/40 border-rose-900/60 text-rose-300"
                                }`}>
                                {status.type === "loading" && <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mt-0.5" />}
                                {status.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                                {status.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                                <span className="leading-tight">{status.message}</span>
                            </div>
                        )}

                        {/* Form Actions Footer Controls Toolbar */}
                        <div className="flex items-center justify-end border-t border-slate-800 pt-4 mt-2">
                            <button
                                type="submit"
                                disabled={status.type === "loading"}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-indigo-400 font-medium text-sm text-white rounded-lg shadow-lg active:scale-[0.98] transition-all disabled:pointer-events-none"
                            >
                                {status.type === "loading" ? "Processing S3 Push..." : "Save Gallery Collection"}
                            </button>
                        </div>

                    </form>
                </div>
            </main>

            {/* Decorative ambient backdrop vector frames mapping */}
            <div className="fixed top-0 left-1/4 -z-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
}