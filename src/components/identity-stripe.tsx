"use client";

import { useEffect, useState } from "react";

const FACTS = [
  "BE CSE",
  "Full-stack",
  "Next.js + Postgres",
  "AI/Agents",
  "DX & Performance",
];

export default function IdentityStripe() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(n => (n + 1) % FACTS.length), 1300);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      {/* Big intro line */}
      <h2 className="text-[clamp(28px,4.8vw,46px)] font-extrabold leading-tight tracking-tight">
        Hi, I’m{" "}
        <span className="bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
          Aarush Gupta
        </span>
        , I design & build software that feels instant and looks expensive.
      </h2>

      {/* Fact chips (one animated focus, others static) */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {FACTS.map((f, idx) => (
          <span
            key={f}
            className={[
              "rounded-xl border border-white/10 px-3 py-1 text-sm text-zinc-300",
              idx === i
                ? "bg-white/8 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
                : "bg-white/5",
            ].join(" ")}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Mini metrics */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric k="Projects" v="8+" />
        <Metric k="Perf gains" v="↑ 30–50%" />
        <Metric k="Hackathons" v="4" />
      </div>

      {/* subtle divider */}
      <div className="mt-10 h-px w-full bg-white/10" />
    </section>
  );
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-sm text-zinc-400">{k}</div>
      <div className="mt-1 text-2xl font-semibold text-zinc-100">{v}</div>
    </div>
  );
}
