"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type SkillLogo = {
  name: string;
  file: string;      // filename inside /public/skills (png/svg)
  hue?: string;      // brand glow color
  href?: string;     // optional external link
};

type SkillsGridProps = {
  title?: string;
  subtitle?: string;
  logos?: SkillLogo[];      // custom list overrides default
  className?: string;
  showLabels?: boolean;     // small text label under each icon
  iconClassName?: string;   // size of the icon image
  tilePadding?: string;     // padding of each tile
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/** Uses your actual PNG filenames under /public/skills */
const DEFAULT_LOGOS: SkillLogo[] = [
    { name: "Next.js",     file: "next.png",       hue: "#ffffff", href: "https://nextjs.org" },
    { name: "React",       file: "react.png",      hue: "#61DAFB", href: "https://react.dev" },
    { name: "TypeScript",  file: "typescript.png", hue: "#3178C6", href: "https://www.typescriptlang.org" },
    { name: "tRPC",        file: "trpc.png",       hue: "#14b8a6", href: "https://trpc.io" },
    { name: "JavaScript",  file: "javascript.png", hue: "#F7DF1E" },
    // NEW ↓
    { name: "Node.js",     file: "nodejs.png",     hue: "#3C873A", href: "https://nodejs.org" },
    { name: "Express",     file: "express.png",    hue: "#AAAAAA", href: "https://expressjs.com" },
    // EXISTING ↓
    { name: "C++",         file: "cpp.png",        hue: "#00599C" },
    { name: "Python",      file: "python.png",     hue: "#3776AB" },
    { name: "Postgres",    file: "postgres.png",   hue: "#336791" },
    { name: "MongoDB",     file: "mongodb.png",    hue: "#10b981" },
    { name: "OpenAI",      file: "openai.png",     hue: "#10A37F" },
  ];
  
function useInViewOnce<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2, ...(opts || {}) }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [inView, opts]);

  return { ref, inView };
}

export default function SkillsGrid({
  title = "Top Skills",
  subtitle,
  logos,
  className,
  showLabels = false,
  // BIGGER defaults per your ask
  iconClassName = "h-20 w-20 md:h-24 md:w-24",
  tilePadding = "p-6 md:p-8",
}: SkillsGridProps) {
  const items = useMemo(() => (logos && logos.length ? logos : DEFAULT_LOGOS), [logos]);
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <section
      ref={ref}
      aria-labelledby="skills-heading"
      className={cn(
        "rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-md shadow-lg p-6 md:p-8",
        !reduceMotion && "transition-all duration-700",
        !inView && !reduceMotion ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
        className
      )}
    >
      <div>
        <h2 id="skills-heading" className="text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm md:text-base text-zinc-400">{subtitle}</p>
        ) : null}
      </div>

      <ul
        role="list"
        className="mt-6 grid gap-6 sm:gap-7 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      >
        {items.map((it) => (
          <li key={it.name}>
            <LogoTile
              name={it.name}
              file={it.file}
              hue={it.hue ?? "#a1a1aa"}
              href={it.href}
              showLabel={showLabels}
              iconClassName={iconClassName}
              tilePadding={tilePadding}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function LogoTile({
  name,
  file,
  hue,
  href,
  showLabel,
  iconClassName,
  tilePadding,
}: {
  name: string;
  file: string;
  hue: string;
  href?: string;
  showLabel: boolean;
  iconClassName: string;
  tilePadding: string;
}) {
  const Wrapper = (href ? "a" : "button") as "a" | "button";

  return (
    <div className="flex flex-col items-center gap-2">
      <Wrapper
        {...(href
          ? { href, target: "_blank", rel: "noreferrer noopener" }
          : { type: "button", onClick: () => {} })}
        aria-label={name}
        title={name}
        className={cn(
          "group relative flex aspect-square items-center justify-center rounded-xl",
          // glassy + soft inner look
          "bg-white/5 hover:bg-white/10 shadow-inner",
          // focus ring & transform
          "transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--brand]",
          // glow on hover/focus
          "hover:[filter:drop-shadow(0_0_18px_var(--brand))] focus-visible:[filter:drop-shadow(0_0_18px_var(--brand))]",
          tilePadding
        )}
        style={{ ["--brand" as any]: hue } as React.CSSProperties}
      >
        {/* shimmer overlay (disabled by prefers-reduced-motion via CSS) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <span className="absolute top-0 left-0 h-full w-1/2 -translate-x-full rotate-6 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-skills-shimmer" />
        </span>

        {/* brand icon (local file) */}
        <img
          src={`/skills/${file}`}
          alt=""                // decorative; labelled by button title + aria-label
          aria-hidden
          draggable={false}
          className={cn(
            iconClassName,
            "transition-transform duration-200 group-hover:scale-[1.1] group-focus-visible:scale-[1.1]"
          )}
        />

        <span className="sr-only">{name}</span>
      </Wrapper>

      {showLabel ? <span className="text-xs md:text-sm text-zinc-400">{name}</span> : null}
    </div>
  );
}
