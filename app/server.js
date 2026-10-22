// Local / non-Vercel server: serves public/ and routes /api/* to the same handlers Vercel uses.
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(root, "public");
const routes = {};
for (const name of ["login", "logout", "session", "feasibility", "presentation"]) {
  routes["/api/" + name] = (await import(`./api/${name}.js`)).default;
}
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (routes[url.pathname]) return routes[url.pathname](req, res);
  let p = path.normalize(path.join(pub, url.pathname === "/" ? "index.html" : url.pathname));
  if (!p.startsWith(pub)) { res.statusCode = 403; return res.end(); }
  try {
    const data = await readFile(p);
    res.setHeader("Content-Type", types[path.extname(p)] || "application/octet-stream");
    res.end(data);
  } catch { res.statusCode = 404; res.end("Not found"); }
}).listen(process.env.PORT || 3000, () => console.log(`Running on http://localhost:${process.env.PORT || 3000}`));
