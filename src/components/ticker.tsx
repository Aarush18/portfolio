"use client";

import { useMemo } from "react";
import React, { CSSProperties } from 'react'; // Import React and CSSProperties

/**
 * Ticker component implements a full-bleed, seamlessly looping marquee animation.
 * It uses Tailwind CSS for styling and inline CSS for the keyframe animation.
 * * NOTE: This is now the default export.
 */
export default function Ticker({
  items = ["AARUSH GUPTA", "BUILD", "DESIGN", "DEVELOP"],
  separator = " — ",
  speed = 42, // Defaulting speed to 42s as requested by user
}: {
  items?: string[];
  separator?: string;
  speed?: number;
}) {
  // 1. Generate the full line of text, duplicated once with the separator
  const line = useMemo(() => items.join(separator) + separator, [items, separator]);

  // 2. Determine the animation duration based on the input speed.
  const animationDuration = `${speed}s`;

  // Define the style object with the custom property.
  // Using type assertion to tell TypeScript to accept the custom CSS variable '--s'.
  const marqueeStyle: CSSProperties = {
    "--s": animationDuration,
  } as CSSProperties & { 
    '--s': string; 
  };


  return (
    // REMOVED: border-y border-indigo-700 to make the borders transparent
    <section className="relative mt-4 md:mt-4 bg-gray-900 shadow-xl">

      {/* Inject custom CSS for the marquee animation */}
      <style>{`
        /* Define the marquee keyframes */
        @keyframes marquee-animation {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); } /* Scrolls content from right to left */
        }
        /* Apply animation to the marquee class */
        .marquee-container { 
          animation: marquee-animation var(--s, 34s) linear infinite; 
        }
        /* Pause on hover for better accessibility and user experience */
        .marquee-container:hover { 
          animation-play-state: paused; 
        }
        /* Disable animation if user prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .marquee-container { animation: none !important; transform: none !important; }
        }
      `}</style>

      {/* Full-bleed container: uses negative margins to extend beyond the typical centered content */}
      {/* UPDATED: Added moderate vertical padding (py-4) for spacing above and below the text */}
      <div className="-mx-[calc(50vw-50%)] py-4 md:py-4">
        
        {/* Edge Fades (Visual effect to make text appear and disappear smoothly) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10" />

        {/* Animation Wrapper */}
        <div className="whitespace-nowrap will-change-transform">
          <div
            className="marquee-container inline-block"
            // Now safely using the typed style object
            style={marqueeStyle}
          >
            {/* The content must be physically repeated once inside the animated container 
              to enable the seamless loop (scrolling to -50% reveals the start again).
              We repeat the line 6 times for a long, impressive scroll.
            */}
            {[...Array(2)].map((_, index) => (
                <span 
                    key={index}
                    // Removed vertical padding from span if it was contributing, but keeping original classes 
                    // as they primarily control text sizing and gradient.
                    className="mx-8 bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent 
                               text-[12vw] leading-[0.9] font-extrabold tracking-[-0.02em] md:text-[7rem]"
                >
                    {line.repeat(6)}
                </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// REMOVED the redundant 'App' component, as 'Ticker' is now the default export.
// This simplifies the component structure since you only wanted the Ticker element.
