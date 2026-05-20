import Link from "next/link";
import { LayoutDashboard, Users, HeartHandshake, Settings, ArrowLeft } from "lucide-react";
import en from "../../locales/en.json";

export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen">

            {/* Isolated Admin System Sidebar Panel */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between flex-shrink-0 hidden md:flex">
                <div className="space-y-6">
                    <div className="text-amber-500 font-serif font-bold text-lg tracking-wide">
                        {en.adminTitle}
                    </div>

                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800 text-white font-medium text-sm">
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            Overview Center
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors text-sm">
                            <Users className="w-4 h-4" />
                            Parishioners
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors text-sm">
                            <HeartHandshake className="w-4 h-4" />
                            Tithes & Gifts
                        </a>
                    </nav>
                </div>

                <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors pt-4 border-t border-slate-900">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Exit to Main Site
                </Link>
            </aside>

            {/* Control Workspace Area */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{en.adminWelcome}</h1>
                        <p className="text-slate-400 text-xs md:text-sm mt-0.5">Secure management backend for St. Arokiya Madha Church.</p>
                    </div>
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700/50 transition-colors">
                        <Settings className="w-4 h-4 text-slate-300" />
                    </button>
                </header>

                {/* Dashboard Live Metric Display Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Prayers</span>
                        <div className="text-3xl font-bold text-white mt-1">14</div>
                        <p className="text-emerald-500 text-xs mt-2 font-medium">● 4 pending review</p>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mass Broadcast</span>
                        <div className="text-3xl font-bold text-white mt-1">142</div>
                        <p className="text-amber-500 text-xs mt-2 font-medium">Live Feed Stable</p>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 shadow-xl sm:col-span-2 lg:col-span-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Altar Collections</span>
                        <div className="text-3xl font-bold text-amber-500 mt-1">₹42,500</div>
                        <p className="text-slate-500 text-xs mt-2">August Target: ₹50,000</p>
                    </div>
                </div>
            </main>

        </div>
    );
}