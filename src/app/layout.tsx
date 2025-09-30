import "./globals.css";
import type { Metadata } from "next";
import Starfield from "@/components/starfield";

export const metadata: Metadata = {
  title: "Aarush — Portfolio",
  description: "I build fast, clean, AI-flavored web apps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative bg-bg text-zinc-200 antialiased">
        {/* Starry night background (behind everything) */}
        <Starfield density={0.00018} speed={32} opacity={0.95} />
        <div className="animate-page-fade">{children}</div>
      </body>
    </html>
  );
}
