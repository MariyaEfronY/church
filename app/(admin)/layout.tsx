export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Clean Slate: Absolutely no header, navigation bar, or footer elements present here
        <div className="bg-slate-900 min-h-screen text-slate-100 font-sans antialiased">
            {children}
        </div>
    );
}