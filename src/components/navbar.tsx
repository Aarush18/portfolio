"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-bg/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/home" className="font-semibold tracking-tight">
          <span className="text-zinc-300">aarush</span>
          <span className="text-zinc-500">.dev</span>
        </Link>

        <button
          className="sm:hidden rounded-xl border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:bg-white/5"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-menu"
        >
          Menu
        </button>

        <ul
          id="nav-menu"
          className={`${
            open ? "block" : "hidden"
          } absolute left-0 right-0 top-full mx-4 rounded-2xl border border-white/10 bg-bg/95 p-2 sm:static sm:mx-0 sm:flex sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0`}
        >
          <li>
            <a href="/projects" className="block rounded-xl px-3 py-2 text-zinc-300 hover:bg-white/5">
              Projects
            </a>
          </li>
          <li>
            <a href="/contact" className="block rounded-xl px-3 py-2 text-zinc-300 hover:bg-white/5">
              Contact
            </a>
          </li>
          <li className="sm:ml-2">
            <a
              href="/Aarush_Gupta_Resume.pdf"
              className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 hover:-translate-y-px transition"
            >
              Resume
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
