"use client";

import { useState } from "react";
import { User, Mail, Lock, ShieldAlert, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("priest"); // Preserves 'priest' dropdown initialization

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, confirmPassword, role })
            });
            const data = await res.json();

            if (!data.success) {
                setError(data.message || "An unexpected registration error occurred.");
            } else {
                setSuccessMessage("Workspace node provisioned successfully! Proceed to log in.");
                setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
            }
        } catch (err) {
            setError("Network connection failed. Verify server routes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[85vh] bg-stone-100 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 antialiased text-stone-900">
            <div className="max-w-md w-full space-y-6 bg-white border border-stone-200 shadow-[0_16px_48px_rgba(0,0,0,0.03)] rounded-2xl p-6 sm:p-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20 mb-3">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-stone-900">
                        Create Account
                    </h2>
                    <p className="text-xs text-stone-400 font-serif italic max-w-xs mx-auto leading-relaxed">
                        Provision system access keys for administrative roles
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

                {/* Fields */}
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                            <input
                                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="Rev. Fr. John Doe"
                                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-800 font-medium"
                            />
                        </div>
                    </div>

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

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Confirm Secret</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                            <input
                                type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-800 font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">System Account Role</label>
                        <div className="relative">
                            <select
                                value={role} onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-800 font-bold appearance-none cursor-pointer"
                            >
                                <option value="priest">Priest (Clergy Admin)</option>
                                <option value="admin">System Administrator</option>
                                <option value="staff">Parish Council Staff</option>
                                <option value="student">Catechism Student Node</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-400 text-xs">▼</div>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full relative mt-3 inline-flex items-center justify-center gap-2 overflow-hidden bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold font-sans tracking-wider uppercase transition-all duration-200 border border-stone-950/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : (
                            <>
                                <span>Provision Credentials</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="pt-4 border-t border-stone-100 text-center text-xs">
                    <p className="text-stone-400 font-medium">
                        Already holding verified clearance credentials?{" "}
                        <Link href="/auth/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>

            </div>
        </main>
    );
}