// src/app/api/contact/route.ts
import type { NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs"; // or "edge" if you prefer

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || "noreply@yourdomain.com";
const TO   = process.env.TO_EMAIL   || "aarushgupta2018@gmail.com";
const SUBJECT_PREFIX = process.env.MAIL_SUBJECT_PREFIX || "[Portfolio Contact]";

const BodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
  budget: z.string().optional().default(""),
  company: z.string().optional().default(""), // honeypot
});

async function rateLimit(ip: string) {
  if (!process.env.UPSTASH_REDIS_REST_URL) return { ok: true };
  const windowSec = 600; // 10 min
  const max = 5;
  const key = `ratelimit:contact:${ip}`;

  const auth = { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` };

  const inc = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/incr/${encodeURIComponent(key)}`, { headers: auth });
  const count = Number(await inc.text());

  if (count === 1) {
    await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/pexpire/${encodeURIComponent(key)}/${windowSec * 1000}`,
      { headers: auth }
    );
  }
  return { ok: count <= max, remaining: Math.max(0, max - count) };
}

function isOriginAllowed(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin || ALLOWED_ORIGINS.length === 0) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

function renderHtml(d: z.infer<typeof BodySchema>) {
  return `
  <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
    <h2 style="margin:0 0 8px">New contact via portfolio</h2>
    <p><b>Name:</b> ${escapeHtml(d.name)}</p>
    <p><b>Email:</b> ${escapeHtml(d.email)}</p>
    <p><b>Budget:</b> ${escapeHtml(d.budget || "-")}</p>
    <p><b>Subject:</b> ${escapeHtml(d.subject)}</p>
    <p style="white-space:pre-wrap"><b>Message:</b><br>${escapeHtml(d.message)}</p>
  </div>`;
}

function renderText(d: z.infer<typeof BodySchema>) {
  return [
    `New contact via portfolio`,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Budget: ${d.budget || "-"}`,
    `Subject: ${d.subject}`,
    ``,
    d.message,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  if (!isOriginAllowed(req)) {
    return new Response(JSON.stringify({ ok: false, error: "Forbidden origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req as any).ip ||
    "0.0.0.0";

  const rl = await rateLimit(ip);
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json: unknown = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ ok: false, error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const data = parsed.data;

  // Honeypot
  if (data.company) {
    return new Response(JSON.stringify({ ok: true, bot: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: "RESEND_API_KEY missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const subject = `${SUBJECT_PREFIX} ${data.subject}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    subject,
    html: renderHtml(data),
    text: renderText(data),
    reply_to: data.email, // reply directly to sender
  });

  resend.emails.send({
    from: FROM,
    to: [data.email],
    subject: `Thanks for reaching out, ${data.name}!`,
    html: `
      <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
        <h2>Got your message ✅</h2>
        <p>Hey ${escapeHtml(data.name)}, thanks for contacting me. I’ll reply shortly.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p><b>Your subject:</b> ${escapeHtml(data.subject)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
        <p style="color:#777">If you didn’t send this, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // helpful if the form is on a different allowed origin
      ...(ALLOWED_ORIGINS.length
        ? { "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0] }
        : {}),
    },
  });
}

// optional preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0] || "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
