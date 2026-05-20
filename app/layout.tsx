import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "St. Arokiya Madha Church",
  description: "Official web portal of St. Arokiya Madha Church. A home of faith, a family of love, a beacon of hope and healing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}