"use client";

import { Menu, X } from "lucide-react";

interface MobileNavbarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function MobileNavbar({ isOpen, setIsOpen }: MobileNavbarProps) {
    return (
        <div className="md:hidden w-full bg-[#4a0e17] text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
            <div className="flex flex-col">
                <span className="font-serif font-bold text-amber-400 text-base leading-tight">St. Arokiya Madha</span>
                <span className="text-[10px] tracking-wider uppercase text-stone-300">Priest Panel</span>
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
            >
                {isOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
        </div>
    );
}