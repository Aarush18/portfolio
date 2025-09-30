"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FOCUS = ["Dashboards", "AI agents", "APIs", "Design systems", "Tooling"];
const ROTATE_MS = 1400;

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % FOCUS.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="
        relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-12 sm:px-6
        sm:grid-cols-2  /* 👈 force two columns from small screens */
      "
    >
      {/* LEFT: portrait */}
      <div className="order-1 justify-self-start w-full max-w-sm">
        <div className="group relative -rotate-3 rounded-3xl border border-white/10 bg-white/[0.03] p-2 shadow-soft backdrop-blur
                        transition-transform duration-300 will-change-transform hover:rotate-0">
          <div className="absolute -inset-1 -z-10 rounded-[2rem] bg-gradient-to-tr from-indigo-400/10 via-fuchsia-400/10 to-transparent blur-2xl" />
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/aarush_photo.png"
              alt="Aarush Gupta"
              width={640}
              height={800}
              priority
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <div className="mt-3 flex items-center justify-between px-2 pb-1">
            <span className="text-xs text-zinc-400">Aarush Gupta</span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300">
              Full-stack
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: value prop */}
      <div className="order-2 text-left">
        <h1 className="text-[clamp(36px,6.8vw,64px)] font-extrabold leading-[1.05] tracking-tight">
          I build fast{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
            {FOCUS[i]}
          </span>
          .
        </h1>

        <p className="mt-4 max-w-2xl text-[clamp(16px,2.2vw,19px)] text-zinc-400">
        I turn ideas into fast, resilient products. Next.js + TypeScript + Postgres, edge-powered.
        </p>

        <div className="mt-6 inline-flex gap-3">
          <a href="/projects" className="btn btn--filled">View Projects</a>
          <a href="/Aarush_Gupta_Resume.pdf" className="btn">Resume</a>
        </div>

        <div className="mt-6 flex items-center gap-3 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/80" />
            Available for work
          </span>
          <span>•</span>
          <span>Chandigarh, IN</span>
          <span>•</span>
          <LocalTime />
        </div>
      </div>
    </section>
  );
}

function LocalTime() {
  const [t, setT] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setT(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span>Local {t}</span>;
}
