import type { NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

/* ---------------- Config ---------------- */
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || "noreply@example.com";
const TO   = process.env.TO_EMAIL   || "owner@example.com";
const SUBJECT_PREFIX = process.env.MAIL_SUBJECT_PREFIX || "[Portfolio Contact]";

/* ---------------- Types ---------------- */
const BodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
  budget: z.string().optional().default(""),
  company: z.string().optional().default(""), // honeypot
});
type Body = z.infer<typeof BodySchema>;

type RateLimitResult = { ok: boolean; remaining?: number };

/* ---------------- Utils ---------------- */
async function rateLimit(ip: string): Promise<RateLimitResult> {
  // Optional: only if Upstash envs exist
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { ok: true };
  }
  const base = process.env.UPSTASH_REDIS_REST_URL;
  const auth = { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` };
  const windowSec = 600; // 10 min
  const max = 5;
  const key = `ratelimit:contact:${ip}`;

  const incRes = await fetch(`${base}/incr/${encodeURIComponent(key)}`, { headers: auth });
  const count = Number(await incRes.text());
  if (count === 1) {
    await fetch(
      `${base}/pexpire/${encodeURIComponent(key)}/${windowSec * 1000}`,
      { headers: auth },
    );
  }
  return { ok: count <= max, remaining: Math.max(0, max - count) };
}

function isOriginAllowed(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin || ALLOWED_ORIGINS.length === 0) return true; // local dev fallback
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

function renderHtml(data: Body) {
  return `
  <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
    <h2 style="margin:0 0 8px">New contact via portfolio</h2>
    <p><b>Name:</b> ${escapeHtml(data.name)}</p>
    <p><b>Email:</b> ${escapeHtml(data.email)}</p>
    <p><b>Budget:</b> ${escapeHtml(data.budget || "-")}</p>
    <p><b>Subject:</b> ${escapeHtml(data.subject)}</p>
    <p style="white-space:pre-wrap"><b>Message:</b><br>${escapeHtml(data.message)}</p>
  </div>`;
}
function renderText(d: Body) {
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

/* ---------------- Handlers ---------------- */
export async function POST(req: NextRequest) {
  if (!isOriginAllowed(req)) {
    return Response.json({ ok: false, error: "Forbidden origin" }, { status: 403 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    // @ts-expect-error — NextRequest.ip is available at runtime in Next.js 15
    (req as unknown as { ip?: string }).ip ||
    "0.0.0.0";

  const rl = await rateLimit(ip);
  if (!rl.ok) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let jsonUnknown: unknown = null;
  try {
    jsonUnknown = await req.json();
  } catch {
    // ignore
  }

  const parsed = BodySchema.safeParse(jsonUnknown);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot: silently succeed
  if (data.company) {
    return Response.json({ ok: true, bot: true }, { status: 200 });
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ ok: false, error: "RESEND_API_KEY missing" }, { status: 500 });
  }

  const subject = `${SUBJECT_PREFIX} ${data.subject}`;
  const result = await resend.emails.send({
    from: FROM,
    to: [TO],
    subject,
    html: renderHtml(data),
    text: renderText(data),
    reply_to: data.email,
  });

  if (result.error) {
    const message = typeof result.error === "object" && result.error !== null
      ? (("message" in result.error && typeof (result.error as { message?: string }).message === "string")
          ? (result.error as { message: string }).message
          : "Email provider error")
      : "Email provider error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 200 });
}

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
