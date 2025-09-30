"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import SocialStrip from "@/components/social-strip";
import Navbar from "@/components/navbar";

/** ---- Small helpers --------------------------------------------------- */
function nowInIST() {
  // Chandigarh uses Asia/Kolkata (IST)
  try {
    return new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return new Date().toLocaleTimeString();
  }
}

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type Fields = {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  // honeypot:
  company: string;
};

const initialFields: Fields = {
  name: "",
  email: "",
  subject: "",
  message: "",
  budget: "",
  company: "", // honeypot (keep blank)
};

export default function ContactPage() {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [form, setForm] = useState<FormState>({ status: "idle" });
  const [errors, setErrors] = useState<Record<keyof Fields, string>>({
    name: "",
    email: "",
    subject: "",
    message: "",
    budget: "",
    company: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const ist = useMemo(nowInIST, []);

  function validate(next: Fields) {
    const e: typeof errors = { ...errors };
    e.name = next.name.trim().length < 2 ? "Name is too short." : "";
    e.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)
      ? ""
      : "Enter a valid email.";
    e.subject = next.subject.trim().length < 3 ? "Add a subject." : "";
    e.message = next.message.trim().length < 10 ? "Message is too short." : "";
    // budget optional, company is honeypot
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    // honeypot: if filled, silently succeed
    if (fields.company) {
      setForm({ status: "success" });
      formRef.current?.reset();
      setFields(initialFields);
      return;
    }

    const nextErrors = validate(fields);
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;

    setForm({ status: "submitting" });

    // Try posting to an API route you can add later.
    // If it fails, we fall back to a mailto: link with prefilled body.
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (!res.ok) throw new Error(await res.text());

      setForm({ status: "success" });
      formRef.current?.reset();
      setFields(initialFields);
    } catch (_err) {
      // mailto fallback
      const mail = new URL(`mailto:aarushgupta2018@gmail.com`);
      const body = [
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        `Budget: ${fields.budget || "-"}`,
        `Subject: ${fields.subject}`,
        "",
        fields.message,
      ].join("%0D%0A");
      mail.searchParams.set(
        "subject",
        fields.subject || "Contact via portfolio"
      );
      mail.searchParams.set("body", body);
      window.location.href = mail.toString();
      // keep UI informative
      setForm({
        status: "error",
        message:
          "Sent via your email client (fallback). You can also DM me on LinkedIn.",
      });
    }
  }

  function update<K extends keyof Fields>(key: K, v: Fields[K]) {
    const next = { ...fields, [key]: v };
    setFields(next);
    setErrors((prev) => ({ ...prev, ...validate(next) }));
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        {/* Header */}
        <header className="relative pt-16 pb-10 sm:pb-12">
          {/* soft orbs */}
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
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
            Contact
          </h1>
          <p className="mt-3 text-zinc-400">
            Want to collaborate or hire me? Drop a message—I&apos;ll get back
            within 24h.
          </p>

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

          <style jsx>{`
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

        {/* Grid */}
        <section className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {/* Form card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-md shadow-lg">
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              className="p-5 sm:p-6"
            >
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                autoComplete="off"
                tabIndex={-1}
                className="hidden"
                value={fields.company}
                onChange={(e) => update("company", e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Name"
                  name="name"
                  value={fields.name}
                  onChange={(v) => update("name", v)}
                  error={errors.name}
                  autoComplete="name"
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  value={fields.email}
                  onChange={(v) => update("email", v)}
                  error={errors.email}
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Subject"
                  name="subject"
                  value={fields.subject}
                  onChange={(v) => update("subject", v)}
                  error={errors.subject}
                  required
                />
                <Select
                  label="Budget (optional)"
                  name="budget"
                  value={fields.budget || ""}
                  onChange={(v) => update("budget", v)}
                  options={[
                    { label: "Select budget", value: "" },
                    { label: "$0 – $500", value: "0-500" },
                    { label: "$500 – $2k", value: "500-2k" },
                    { label: "$2k – $5k", value: "2k-5k" },
                    { label: "$5k+", value: "5k+" },
                  ]}
                />
              </div>

              <Textarea
                className="mt-4"
                label="Message"
                name="message"
                value={fields.message}
                onChange={(v) => update("message", v)}
                error={errors.message}
                rows={6}
                required
              />

              {/* submit row */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={form.status === "submitting"}
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/[0.14] disabled:opacity-60"
                >
                  <span
                    aria-hidden
                    className="inline-block size-2.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 shadow-[0_0_18px_rgba(167,139,250,0.5)] group-hover:scale-110 transition"
                  />
                  {form.status === "submitting" ? "Sending…" : "Send message"}
                </button>

                <span className="text-xs text-zinc-400">
                  I’m in Chandigarh • Local time {ist}
                </span>
              </div>

              {/* status */}
              {form.status === "success" && (
                <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                  Thanks! Your message is on its way.
                </p>
              )}
              {form.status === "error" && (
                <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                  {form.message}
                </p>
              )}
            </form>
          </div>

          {/* Info / Socials card */}
          <aside className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-md shadow-lg p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Let’s build something</h2>
            <p className="mt-2 text-zinc-400">
              Prefer email? Reach me directly at{" "}
              <Link
                href="mailto:aarushgupta2018@gmail.com"
                className="underline decoration-transparent hover:decoration-inherit transition"
              >
                aarushgupta2018@gmail.com
              </Link>
              .
            </p>

            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <Dot /> Chandigarh, IN
              </li>
              <li className="flex items-center gap-2">
                <Dot className="bg-emerald-400/90" /> Available for work
              </li>
            </ul>

            <div className="mt-6">
              <a
                href="/Aarush_Gupta_Resume.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/[0.12]"
              >
                View Résumé
              </a>
            </div>

            <div className="mt-8">
              <SocialStrip />
            </div>
          </aside>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Aarush Gupta. All rights reserved.
      </footer>
    </>
  );
}

/** ---- Primitives (Inputs) --------------------------------------------- */
function Field(props: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: "text" | "email";
  autoComplete?: string;
  required?: boolean;
}) {
  const {
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    autoComplete,
    required,
  } = props;

  return (
    <label className="block">
      <span className="text-sm text-zinc-300">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-xl border bg-white/[0.04] px-3 py-2 text-sm text-white outline-none backdrop-blur placeholder:text-zinc-500
        ${
          error
            ? "border-rose-500/40 focus:ring-rose-500/40"
            : "border-white/10 focus:ring-white/20"
        } ring-0 focus:border-white/20`}
        placeholder={label}
      />
      {error ? (
        <span className="mt-1 block text-xs text-rose-300">{error}</span>
      ) : null}
    </label>
  );
}

function Textarea(props: {
  className?: string;
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  rows?: number;
  required?: boolean;
}) {
  const {
    className = "",
    label,
    name,
    value,
    onChange,
    error,
    rows = 5,
    required,
  } = props;
  return (
    <label className={`block ${className}`}>
      <span className="text-sm text-zinc-300">{label}</span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full resize-y rounded-xl border bg-white/[0.04] px-3 py-2 text-sm text-white outline-none backdrop-blur placeholder:text-zinc-500
        ${
          error
            ? "border-rose-500/40 focus:ring-rose-500/40"
            : "border-white/10 focus:ring-white/20"
        } ring-0 focus:border-white/20`}
        placeholder={label}
      />
      {error ? (
        <span className="mt-1 block text-xs text-rose-300">{error}</span>
      ) : null}
    </label>
  );
}

function Select(props: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  const { label, name, value, onChange, options } = props;
  return (
    <label className="block">
      <span className="text-sm text-zinc-300">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none backdrop-blur focus:border-white/20 focus:ring-white/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Dot({ className = "bg-zinc-400/90" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-2 rounded-full ${className}`}
    />
  );
}
