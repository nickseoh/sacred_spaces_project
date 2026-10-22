// Small helpers so handlers run the same on Vercel and on the local server.js.
export async function readJson(req, maxBytes = 200_000) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  let size = 0; const chunks = [];
  for await (const c of req) { size += c.length; if (size > maxBytes) throw httpError(413, "Request too large."); chunks.push(c); }
  const raw = Buffer.concat(chunks).toString("utf8");
  try { return raw ? JSON.parse(raw) : {}; } catch { throw httpError(400, "Body must be JSON."); }
}
export function send(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(data));
}
export function httpError(status, message) { const e = new Error(message); e.status = status; return e; }
export function handle(fn, { method = "POST" } = {}) {
  return async (req, res) => {
    try {
      if (req.method !== method) throw httpError(405, "Method not allowed.");
      await fn(req, res);
    } catch (e) {
      const status = e.status || 500;
      if (status >= 500) console.error(e);
      send(res, status, { error: status >= 500 && !e.status ? "Something went wrong on the server. Check the server logs and environment variables." : e.message });
    }
  };
}
