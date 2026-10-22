import { handle, readJson, send, httpError } from "../lib/http.js";
import { checkCredentials, sessionCookie } from "../lib/auth.js";

const attempts = new Map(); // best-effort brute-force slowdown per IP
export default handle(async (req, res) => {
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0];
  const now = Date.now(), recent = (attempts.get(ip) || []).filter((t) => now - t < 600_000);
  if (recent.length >= 10) throw httpError(429, "Too many sign-in attempts. Wait 10 minutes.");
  const { email, password } = await readJson(req);
  if (!checkCredentials(email, password)) { recent.push(now); attempts.set(ip, recent); throw httpError(401, "That email and password don't match the demo account."); }
  send(res, 200, { ok: true, email: String(email).trim().toLowerCase() }, { "Set-Cookie": sessionCookie(String(email).trim().toLowerCase()) });
});
