"use client";

import { useState } from "react";
import { Mail, Lock, ShieldAlert, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            // Inside your login page handleFormSubmit code block:
            if (!data.success) {
                setError(data.message || "Invalid authentication credentials.");
            } else {
                setSuccessMessage("Authentication verified. Redirecting...");

                // Save the member attributes payload for the sidebar instance to access
                localStorage.setItem("user-session", JSON.stringify({
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role
                }));

                setTimeout(() => {
                    window.location.href = "/priest/dashboard";
                }, 800);
            }
        } catch (err) {
            setError("Network response channel failed. Verify backend configurations.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[80vh] bg-stone-100 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 antialiased text-stone-900">
            <div className="max-w-md w-full space-y-6 bg-white border border-stone-200 shadow-[0_16px_48px_rgba(0,0,0,0.03)] rounded-2xl p-6 sm:p-8">

                {/* Branding Block */}
                <div className="text-center space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20 mb-3">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-stone-900">
                        Sign In Portal
                    </h2>
                    <p className="text-xs text-stone-400 font-serif italic max-w-xs mx-auto leading-relaxed">
                        Access your centralized ministry management workspace
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="bg-rose-50 border border-rose-200/60 text-rose-700 p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold tracking-wide animate-fade-in">
                        <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-500" />
                        <span>{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 p-3 rounded-xl text-xs font-semibold tracking-wide animate-fade-in">
                        {successMessage}
                    </div>
                )}

                {/* Input Fields */}
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                            <input
                                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="pastor@parish.org"
                                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-800 font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Secret Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                            <input
                                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-800 font-medium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full relative mt-3 inline-flex items-center justify-center gap-2 overflow-hidden bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold font-sans tracking-wider uppercase transition-all duration-200 border border-stone-950/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : (
                            <>
                                <span>Access Workspace</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="pt-4 border-t border-stone-100 text-center text-xs">
                    <p className="text-stone-400 font-medium">
                        Need administrative permissions?{" "}
                        <Link href="/auth/register" className="text-indigo-600 font-bold hover:underline">Register Node</Link>
                    </p>
                </div>

            </div>
        </main>
    );
}