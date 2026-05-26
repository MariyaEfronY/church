import { Noto_Sans_Tamil } from "next/font/google";

const tamilFont = Noto_Sans_Tamil({
    subsets: ["tamil"],
    weight: ["400", "500", "700"],
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className={`${tamilFont.className} bg-slate-900 min-h-screen text-slate-100 antialiased`}
        >
            {children}
        </div>
    );
}