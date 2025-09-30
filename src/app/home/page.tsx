"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Hero from "../../components/hero";
import Ticker from "../../components/ticker";
import AboutIntro from "../../components/about-intro";
import SocialStrip from "../../components/social-strip";
import SkillsGrid from "@/components/skills-grid";

export default function HomePage() {
  // When arriving from the splash, apply a one-time fade-in on mount.
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    let fromSplash = false;
    try {
      fromSplash = sessionStorage.getItem("fromSplash") === "1";
      sessionStorage.removeItem("fromSplash");
    } catch {}
    if (fromSplash) setFadeIn(true);
  }, []);

  return (
    <>
      <Navbar />

      {/* apply the page fade only when we came from the splash */}
      <main
        className={[
          "mx-auto max-w-6xl px-4 sm:px-6 pb-16",
          fadeIn ? "animate-page-fade" : "",
        ].join(" ")}
      >
        <Hero />

        <Ticker
          items={["AARUSH GUPTA", "BUILD", "DESIGN", "DEVELOP"]}
          separator=" — "
          speed={20}
        />

        <AboutIntro />

        <section className="mt-12">
          <SkillsGrid
            title="Top Skills"
            subtitle="Stacks I work with daily"
            // even bigger icons? uncomment:
            // iconClassName="h-24 w-24 md:h-28 md:w-28"
            // tilePadding="p-7 md:p-9"
          />
        </section>
      </main>

      {/* Footer with social strip */}
      <footer className="border-t border-white/10 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl py-10">
          <div className="flex w-full justify-center">
            <SocialStrip />
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} Aarush Gupta. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
