import Link from "next/link";
import { Church, ShieldCheck } from "lucide-react";

interface NavProps {
    parishName: string;
    adminText: string;
}

export default function Navigation({ parishName, adminText }: NavProps) {
    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-serif font-bold text-slate-950 text-lg">
                    <Church className="w-6 h-6 text-amber-600" />
                    <span>{parishName}</span>
                </Link>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
                >
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    {adminText}
                </Link>
            </div>
        </nav>
    );
}