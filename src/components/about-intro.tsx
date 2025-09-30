"use client";

// import dynamic from "next/dynamic";
// const CoolObject3D = dynamic(() => import("./cool-object-3d"), { ssr: false });
import dynamic from "next/dynamic";
const MiniEarth = dynamic(() => import("@/components/mini-earth"), { ssr: false });

export default function AboutIntro() {
  return (
    <section
      className="
        mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 py-14 sm:px-6
        md:grid-cols-[minmax(0,52ch)_auto]  /* comfy read width + slim right col */
      "
    >
      {/* LEFT — copy shifted left with readable measure */}
      <div className="pr-2">
        <h2 className="text-[clamp(28px,4.6vw,42px)] font-extrabold leading-tight tracking-tight">
          Hi, my name is{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent underline decoration-white/20 underline-offset-[10px]">
            Aarush Gupta
          </span>
          .
        </h2>

        <p className="mt-4 text-[clamp(16px,2.2vw,18.5px)] text-zinc-300">
          I’m a <strong>3rd-year Mechanical Engineering</strong> student at{" "}
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-zinc-200">
            PEC, Chandigarh
          </span>
          . This is my personal portfolio where I showcase projects, experiments, and what I’m learning.
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Highlight k="What I love" v="Performance, clean APIs, DX" />
          <Highlight k="Toolbox" v="Next.js, TypeScript, Postgres" />
          <Highlight k="Interests" v="AI agents, design systems" />
          <Highlight k="Currently" v="Shipping projects & writing" />
        </ul>

      </div>

      {/* RIGHT — small spinning 3D on the right edge */}
      <div
        className="
          justify-self-end md:justify-self-stretch
          md:sticky md:top-28
          grid place-items-center
          min-h-[160px]
        "
      >
        <div className="flex justify-end">
            <MiniEarth />
        </div>

      </div>
    </section>
  );
}

function Highlight({ k, v }: { k: string; v: string }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{k}</div>
      <div className="mt-1 text-[15px] text-zinc-200">{v}</div>
    </li>
  );
}
