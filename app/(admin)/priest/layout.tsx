"use client";

import { useState } from "react";
import PriestSidebar from "./components/sidebar";
import MobileNavbar from "./components/navbar";

export default function PriestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col md:flex-row antialiased">

            {/* Permanent Desktop Sidebar Column */}
            <aside className="w-68 bg-[#4a0e17] border-r border-stone-200 shadow-2xl flex-shrink-0 hidden md:block z-30">
                <PriestSidebar />
            </aside>

            {/* Isolated Responsive Mobile Navigation Header */}
            <MobileNavbar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            {/* Dimmed Drawer Overlay Context on Mobile viewports */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sliding Underneath Mobile Layout Sidebar Drawer Wrapper */}
            <div className={`fixed top-[52px] left-0 bottom-0 w-64 bg-[#4a0e17] z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <PriestSidebar closeMenu={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Dynamic Content Viewport Workspace Frame */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                {children}
            </main>

        </div>
    );
}