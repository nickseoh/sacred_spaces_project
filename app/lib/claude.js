import { httpError } from "./http.js";

export async function askJson(prompt, { maxTokens = 4000 } = {}) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set.");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (r.status === 429 || r.status === 529) throw httpError(503, "Claude is busy right now. Wait a moment and try again.");
  if (!r.ok) { console.error("Anthropic API error", r.status, await r.text()); throw httpError(502, "The Claude API request failed. Check the server logs."); }
  const data = await r.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  return parseJson(text);
}

export function parseJson(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); } catch {}
  const a = clean.indexOf("{"), b = clean.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(clean.slice(a, b + 1)); } catch {} }
  throw httpError(502, "Claude's answer couldn't be read. Try again.");
}
