"use client";

import { useMemo } from "react";
import { useState } from 'react';

/**
 * Ticker component implements a full-bleed, seamlessly looping marquee animation.
 * It uses Tailwind CSS for styling and inline CSS for the keyframe animation.
 */
function Ticker({
  items = ["AARUSH GUPTA", "BUILD", "DESIGN", "DEVELOP"],
  separator = " — ",
  speed = 100, // Higher value means slower animation (e.g., 100s)
}: {
  items?: string[];
  separator?: string;
  speed?: number;
}) {
  // 1. Generate the full line of text, duplicated once with the separator
  const line = useMemo(() => items.join(separator) + separator, [items, separator]);

  // 2. Determine the animation duration based on the input speed.
  // The value is passed as a CSS variable '--s' to the style prop.
  const animationDuration = `${speed}s`;

  return (
    <section className="relative mt-12 md:mt-16 bg-gray-900 border-y border-indigo-700 shadow-xl">

      {/* Inject custom CSS for the marquee animation */}
      {/* This ensures the keyframes and animation classes are available */}
      {/* REMOVED 'global' and 'jsx' attributes to fix React console warnings */}
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
      <div className="-mx-[calc(50vw-50%)] py-8 md:py-10">
        
        {/* Edge Fades (Visual effect to make text appear and disappear smoothly) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10" />

        {/* Animation Wrapper */}
        <div className="whitespace-nowrap will-change-transform">
          <div
            className="marquee-container inline-block"
            // Injecting the custom speed CSS variable (e.g., --s: 100s)
            style={{ "--s": animationDuration }}
          >
            {/* The content must be physically repeated once inside the animated container 
              to enable the seamless loop (scrolling to -50% reveals the start again).
              We repeat the line 6 times for a long, impressive scroll.
            */}
            {[...Array(2)].map((_, index) => (
                <span 
                    key={index}
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

// Main component that wraps the Ticker for the single-file React structure.
export default function App() {
    const [speed, setSpeed] = useState(100);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center">
            <header className="p-8 text-center w-full max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black text-indigo-400 mb-2">
                    Infinite Marquee Demo
                </h1>
                <p className="text-gray-400">
                    A responsive, full-bleed, and seamless text ticker. Hover to pause.
                </p>
                <div className="mt-6 flex flex-col items-center space-y-2">
                    <label htmlFor="speed-slider" className="text-lg text-fuchsia-300">
                        Animation Speed: <span className="font-mono">{speed}s</span> (Higher = Slower)
                    </label>
                    <input
                        id="speed-slider"
                        type="range"
                        min="20"
                        max="200"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full md:w-1/2 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
                    />
                </div>
            </header>

            {/* Render the Marquee Ticker */}
            <Ticker speed={speed} />
            
            <footer className="mt-auto p-4 text-center text-gray-500">
                <p>Built with React and Tailwind CSS</p>
            </footer>
        </div>
    );
}
