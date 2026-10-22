import crypto from "node:crypto";
import { httpError } from "./http.js";

const COOKIE = "ss_session";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET is missing or too short (16+ characters).");
  return s;
}
const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("base64url");
function safeEq(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function checkCredentials(email, password) {
  const e = process.env.DEMO_EMAIL || "demo@church.test";
  const p = process.env.DEMO_PASSWORD;
  if (!p) throw new Error("DEMO_PASSWORD is not set.");
  return safeEq(String(email || "").trim().toLowerCase(), e.toLowerCase()) && safeEq(password || "", p);
}

export function sessionCookie(email) {
  const payload = Buffer.from(JSON.stringify({ e: email, sid: crypto.randomUUID(), exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  const secure = process.env.NODE_ENV === "development" ? "" : " Secure;";
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${MAX_AGE}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

export function getSession(req) {
  const raw = (req.headers.cookie || "").split(/;\s*/).find((c) => c.startsWith(COOKIE + "="));
  if (!raw) return null;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split(".");
  if (!payload || !sig || !safeEq(sig, sign(payload))) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return s.exp > Date.now() ? s : null;
  } catch { return null; }
}
export function requireSession(req) {
  const s = getSession(req);
  if (!s) throw httpError(401, "Sign in to continue.");
  return s;
}

// Best-effort limit per session. On serverless this is per instance, so treat it as a speed bump
// and also set a monthly spend limit on your Anthropic API key.
const hits = new Map();
export function rateLimit(sid) {
  const limit = Number(process.env.AI_LIMIT_PER_HOUR || 30);
  const now = Date.now(), hour = 3600_000;
  const list = (hits.get(sid) || []).filter((t) => now - t < hour);
  if (list.length >= limit) throw httpError(429, "Hourly limit reached for this demo session. Try again later.");
  list.push(now); hits.set(sid, list);
}
