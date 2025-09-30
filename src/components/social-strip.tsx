"use client";

import Link from "next/link";
import { useMemo } from "react";

type Item = {
  href: string;
  label: string;
  color: string;     // solid brand color for icon
  gradient: string;  // CSS gradient string for the glow border
  icon: React.ReactNode;
};

const items: Item[] = [
  {
    href: "https://github.com/Aarush18",
    label: "GitHub",
    color: "#a78bfa", // violet-400
    gradient: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.85 9.68.5.09.68-.22.68-.48
             0-.24-.01-.86-.01-1.68-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63
             1.01.07 1.54 1.06 1.54 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07
             0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .85-.27 2.8 1.05a9.37 9.37 0 0 1 2.55-.36c.87 0 1.75.12 2.56.36
             1.95-1.32 2.8-1.05 2.8-1.05.55 1.4.2 2.44.1 2.7 .64.71 1.03 1.62 1.03 2.74 0 3.94-2.34 4.81-4.57 5.07
             .36.32.67.94.67 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
        />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/aarush-gupta-73455b289",
    label: "LinkedIn",
    color: "#0ea5e9", // sky-500
    gradient: "linear-gradient(90deg, #06b6d4 0%, #0ea5e9 50%, #22d3ee 100%)",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
        <path
          fill="currentColor"
          d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.32V9h3.42v1.56h.05c.48-.9 1.66-1.86 3.42-1.86 3.65 0 4.33 2.4 4.33 5.52v6.22zM5.34 7.44a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"
        />
      </svg>
    ),
  },
  {
    // if your handle URL differs, just update this href
    href: "https://leetcode.com/u/aarushgupta2018",
    label: "LeetCode",
    color: "#f59e0b", // amber-500
    gradient: "linear-gradient(90deg, #f59e0b 0%, #fb923c 50%, #f97316 100%)",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
        {/* stylized "hook" + dash, in brand color */}
        <path
          d="M14.5 4.5l-6 6 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 12H9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function SocialStrip() {
  const normalized = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        external: it.href.startsWith("http"),
      })),
    []
  );

  return (
    <nav
      aria-label="Social links"
      className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-5"
    >
      {normalized.map((it) => (
        <SocialButton key={it.label} item={it} />
      ))}
    </nav>
  );
}

function SocialButton({ item }: { item: Item & { external?: boolean } }) {
  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer noopener" : undefined}
      aria-label={item.label}
      title={item.label}
      className="
        group relative inline-flex items-center gap-3 rounded-2xl border border-white/10
        bg-white/[0.06] px-4 py-3 text-[15px] text-zinc-200 backdrop-blur
        transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.12] hover:text-white
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      "
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* glow ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: item.gradient }}
      />

      {/* icon bubble */}
      <span
        className="relative inline-flex size-9 items-center justify-center rounded-xl border border-white/10
                   bg-black/30 text-white shadow-inner transition-transform duration-200 group-hover:scale-110"
        style={{ color: item.color, boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.06)` }}
      >
        <span
          aria-hidden
          className="absolute -z-10 size-9 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60"
          style={{ background: item.color }}
        />
        <span className="text-current">{item.icon}</span>
      </span>

      <span className="hidden sm:inline">{item.label}</span>
    </Link>
  );
}
