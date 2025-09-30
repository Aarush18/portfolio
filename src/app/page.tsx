"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const WORDS = ["Hello", "Hola", "नमस्ते", "Bonjour", "こんにちは", "안녕하세요"];

// timings (tweak to taste)
const WORD_SWAP_MS = 900;   // per word
const TOTAL_STAY_MS = 7800; // total time on splash
const FADE_OUT_MS    = 650; // fade to black duration

export default function Landing() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const done = useRef(false);

  // Prefetch /home so it appears immediately after fade
  // (Link does automatic prefetch in viewport, a hidden Link works too)
  const PrefetchHome = <Link href="/home" prefetch className="hidden" />;

  const goHome = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
  
    // 👇 tell the next page to mount with a fade-in
    try { sessionStorage.setItem("fromSplash", "1"); } catch {}
  
    setTimeout(() => router.replace("/home"), FADE_OUT_MS);
  }, [router]);
  

  // rotate greetings
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), WORD_SWAP_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  // auto-redirect
  useEffect(() => {
    if (reduceMotion) return;
    const id = setTimeout(goHome, TOTAL_STAY_MS);
    return () => clearTimeout(id);
  }, [goHome, reduceMotion]);

  // allow skip via click or key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", " ", "Escape"].includes(e.key)) goHome();
    };
    const onClick = () => goHome();
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [goHome]);

  const word = useMemo(() => (reduceMotion ? "Hello" : WORDS[i]), [i, reduceMotion]);

  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-bg">
      {PrefetchHome}

      {/* slow zoomed star glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(120,119,198,0.15),transparent_70%)] animate-slow-zoom" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_80%_10%,rgba(236,72,153,0.12),transparent_70%)] animate-slow-zoom" />
      </div>

      {/* content */}
      <div
        className={[
          "select-none text-center transition-all duration-400 ease-out",
          leaving ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
        ].join(" ")}
      >
        {/* greeting cross-fade */}
        <h1
          className="text-[clamp(40px,8vw,96px)] font-extrabold leading-[1.05] tracking-tight"
          aria-live="polite"
        >
          <span
            key={word}
            className="inline-block animate-word-fade bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent"
          >
            {word}
          </span>{" "}
          <span className="text-zinc-100">I’m Aarush.</span>
        </h1>

        <p className="mt-4 text-zinc-400">
          Full-stack engineer. Clean abstractions, ruthless performance.
        </p>

        <button
          onClick={goHome}
          className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-zinc-100 transition hover:-translate-y-px"
        >
          Enter <span aria-hidden>↵</span>
        </button>

        <p className="mt-2 text-xs text-zinc-500">
          Press <kbd className="rounded border border-white/10 px-1">Enter</kbd> to skip
        </p>
      </div>

      {/* top vignette line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

      {/* final fade to black (sits above; animates when leaving) */}
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 bg-black transition-opacity",
          leaving ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ transitionDuration: `${FADE_OUT_MS}ms` }}
      />
    </main>
  );
}

/** Hook: detect prefers-reduced-motion */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(!!mql?.matches);
    onChange();
    mql?.addEventListener?.("change", onChange);
    return () => mql?.removeEventListener?.("change", onChange);
  }, []);
  return reduce;
}
