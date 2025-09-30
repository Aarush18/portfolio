"use client";

import Navbar from "@/components/navbar";
import SocialStrip from "@/components/social-strip";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

/* ── Types ──────────────────────────────────────────────────────────────── */
type Project = {
  title: string;
  slug: string; // used for /public/projects/<slug>.png
  blurb: string;
  accent: [string, string]; // [from, to] gradient colors
  repo: string; // GitHub URL (card click opens this)
  live?: string; // (optional) live demo URL
  technologies: string[]; // <-- NEW REQUIRED FIELD
};

/* ── Data ───────────────────────────────────────────────────────────────── */
const PROJECTS: Project[] = [
  {
    title: "CodeSurfer",
    slug: "codesurfer",
    blurb: "Lightning-fast code browsing & AI snippets.",
    accent: ["#22d3ee", "#8b5cf6"],
    repo: "https://github.com/Aarush18/CodeSurfer",
    live: "",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "tRPC",
      "Prisma",
      "Postgres",
    ],
  },
  {
    title: "CareerSaarthiAI",
    slug: "careersaarthiai",
    blurb: "AI career copilot: paths, resumes, interview prep.",
    accent: ["#10b981", "#06b6d4"],
    repo: "https://github.com/Aarush18/CareerSaarthiAI",
    technologies: ["Next.js", "TypeScript", "OpenAI", "Prisma", "Postgres"],
  },
  {
    title: "CodingInterviewPlatform",
    slug: "coding-interview-platform",
    blurb: "Live IDE, tests, and feedback for interviews.",
    accent: ["#f59e0b", "#ef4444"],
    repo: "https://github.com/Aarush18/Coding-Interview-Platform",
    technologies: ["Nextjs", "Typescript", "Convex", "WebSockets", "Monaco"],
  },
  {
    title: "Spotify Clone",
    slug: "spotify-clone",
    blurb: "Auth, playlists, streaming UI, the whole vibe.",
    accent: ["#22c55e", "#14b8a6"],
    repo: "https://github.com/Aarush18/Spotify_Clone",
    technologies: ["Express", "Tailwind CSS", "React", "MongoDB"],
  },
  {
    title: "Chat App",
    slug: "chat-app",
    blurb: "Real-time chat, presence, reactions, attachments.",
    accent: ["#60a5fa", "#7c3aed"],
    repo: "https://github.com/Aarush18/Chat_App",
    technologies: [
      "React",
      "TypeScript",
      "Socket.IO",
      "MongoDB",
      "Tailwind CSS",
    ],
  },
  {
    title: "Blogify",
    slug: "blogify",
    blurb: "MDX blogs, drafts, tags, and blazing SEO.",
    accent: ["#f43f5e", "#fb923c"],
    repo: "https://github.com/Aarush18/Blogify",
    technologies: ["EJS", "Tailwind CSS", "Javascript"],
  },
];

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const items = useMemo(() => PROJECTS, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <ProjectsHeader count={items.length} />

        <ul
          role="list"
          className="mt-4 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((p, idx) => (
            <li key={p.slug}>
              <ProjectCard project={p} index={idx + 1} />
            </li>
          ))}
        </ul>
      </main>

      <footer className="border-t border-white/10 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl py-10">
          {/* centered strip */}
          <div className="flex w-full justify-center">
            <SocialStrip />
          </div>

          {/* copyright */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} Aarush Gupta. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const imgSrc = `/projects/${project.slug}.png`;
  const href = project.repo || project.live || "#";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg transition-transform duration-300 hover:-translate-y-0.5 focus:-translate-y-0.5 focus:outline-none"
    >
      {/* top-right GitHub chip (appears on hover) */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-zinc-200 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100"
      >
        <GitHubIcon className="size-3.5" />
        Repo
      </span>

      {/* Image / header */}
      <div className="relative aspect-[16/10] w-full">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />

        <Image
          src={imgSrc}
          alt={`${project.title} preview`}
          fill
          className="object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-90"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = "none")
          }
        />

        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(0,0,0,0.25),transparent)]" />

        {/* Stronger vibrant hover gradient (higher alpha) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus:opacity-100"
          style={{
            background: `radial-gradient(60% 60% at 50% 20%, ${project.accent[0]}66, transparent 70%), radial-gradient(60% 60% at 80% 80%, ${project.accent[1]}66, transparent 70%)`,
          }}
        />

        {/* Extra blurred glow ring on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[-10%] -z-10 opacity-0 blur-2xl transition-opacity duration-400 group-hover:opacity-70"
          style={{
            background: `radial-gradient(60% 60% at 50% 50%, ${project.accent[0]}40, transparent 70%), radial-gradient(60% 60% at 70% 30%, ${project.accent[1]}40, transparent 70%)`,
          }}
        />

        {/* Shimmer sweep */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100 motion-reduce:hidden"
        >
          <div className="absolute -inset-y-6 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-xl sweep" />
        </div>

        {/* Beefier hover shadow */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl ring-0 ring-transparent transition-[box-shadow] duration-300 group-hover:shadow-[0_0_60px_0_rgba(255,255,255,0.08)]"
        />
      </div>

      {/* Content */}
      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-zinc-500/70 group-hover:bg-white/90" />
            Project {String(index).padStart(2, "0")}
          </span>
          <span
            className="pointer-events-none inline-block h-[2px] w-12 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, ${project.accent[0]}, ${project.accent[1]})`,
            }}
          />
        </div>

        <h3 className="mt-2 text-xl font-semibold tracking-tight">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
          {project.blurb}
        </p>

        {/* ── NEW: Technology tags ───────────────────────────────────────── */}
        <ul
          aria-label="Technologies used"
          className="mt-3 flex flex-wrap gap-2"
        >
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* longer, brighter underline on hover */}
        <div
          aria-hidden
          className="mt-4 h-1.5 w-0 rounded-full opacity-0 transition-all duration-300 group-hover:w-28 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, ${project.accent[0]}, ${project.accent[1]})`,
          }}
        />
      </div>

      {/* Accessible focus ring */}
      <span className="absolute inset-0 rounded-2xl ring-0 ring-offset-0 ring-offset-transparent focus-within:ring-2" />

      {/* Local CSS for the sweep animation */}
      <style jsx>{`
        @keyframes sweep {
          0% {
            transform: translateX(-50%) rotate(12deg);
          }
          100% {
            transform: translateX(250%) rotate(12deg);
          }
        }
        .sweep {
          animation: sweep 1400ms linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sweep {
            animation: none !important;
          }
        }
      `}</style>
    </Link>
  );
}

/** Minimal GitHub mark so we don't pull any external assets */
function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.85 9.68.5.09.68-.22.68-.48
           0-.24-.01-.86-.01-1.68-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63
           1.01.07 1.54 1.06 1.54 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07
           0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .85-.27 2.8 1.05a9.37 9.37 0 0 1 2.55-.36c.87 0 1.75.12 2.56.36
           1.95-1.32 2.8-1.05 2.8-1.05.55 1.4.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.74 0 3.94-2.34 4.81-4.57 5.07
           .36.32.67.94.67 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
      />
    </svg>
  );
}

function ProjectsHeader({ count = 6 }: { count?: number }) {
  return (
    <header className="relative pt-16 pb-10 sm:pb-12">
      {/* background orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(139,92,246,0.35), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(34,211,238,0.35), transparent 70%)",
        }}
      />

      {/* title */}
      <h1 className="glow-title text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
        My Projects
      </h1>

      {/* subtitle + chips */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-zinc-400">
        <p className="text-base">A few things I’ve shipped.</p>

        <span
          className="hidden sm:inline-block h-4 w-px bg-white/10"
          aria-hidden
        />

        <ul className="flex items-center gap-2">
          <li className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-300 backdrop-blur">
            {count} projects
          </li>
          <li className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-300 backdrop-blur">
            Updated weekly
          </li>
        </ul>
      </div>

      {/* animated accent bar */}
      <div className="relative mt-6 h-[6px] w-40 overflow-hidden rounded-full bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 opacity-70" />
        <div
          className="absolute inset-0 animate-slide"
          aria-hidden
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* GLOBAL styles to avoid styled-jsx class string concat issues */}
      <style jsx global>{`
        .glow-title {
          text-shadow: 0 0 18px rgba(168, 85, 247, 0.18),
            0 0 36px rgba(34, 211, 238, 0.12);
        }
        @keyframes slide {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-slide {
          animation: slide 1.8s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-slide {
            animation: none !important;
          }
        }
      `}</style>
    </header>
  );
}
