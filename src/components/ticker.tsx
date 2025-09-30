"use client";

import { useMemo } from "react";

/** Full-bleed, seamless marquee (no borders). */
export default function Ticker({
  items = ["AARUSH GUPTA", "BUILD", "DESIGN", "DEVELOP"],
  separator = " — ",
  speed = 100, // slower default (higher = slower)
}: {
  items?: string[];
  separator?: string;
  speed?: number;
}) {
  const line = useMemo(() => items.join(separator) + separator, [items, separator]);

  return (
    <section className="relative mt-12 md:mt-16">
      {/* full-bleed container without lines */}
      <div className="-mx-[calc(50vw-50%)] py-8 md:py-10">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />

        <div className="whitespace-nowrap will-change-transform">
          <div
            className="marquee inline-block [--speed:var(--s,34s)]"
            style={{ ["--s" as any]: `${speed}s` }}
          >
            <span className="mx-8 bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent text-[12vw] leading-[0.9] font-extrabold tracking-[-0.02em] md:text-[7rem]">
              {line.repeat(6)}
            </span>
            <span className="mx-8 bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent text-[12vw] leading-[0.9] font-extrabold tracking-[-0.02em] md:text-[7rem]">
              {line.repeat(6)}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); } /* right → left */
        }
        .marquee { animation: marquee var(--speed, 34s) linear infinite; }
        .marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .marquee { animation: none !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}
