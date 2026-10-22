import { handle, readJson, send, httpError } from "../lib/http.js";
import { requireSession, rateLimit } from "../lib/auth.js";
import { cleanInputs, calc } from "../lib/calc.js";
import { presentationPrompt } from "../lib/prompts.js";
import { askJson } from "../lib/claude.js";
import { mockPresentation } from "../lib/mock.js";

export default handle(async (req, res) => {
  const s = requireSession(req);
  const body = await readJson(req);
  if (!body.feasibility || typeof body.feasibility !== "object") throw httpError(400, "Run the feasibility read first.");
  const i = cleanInputs(body.inputs), c = calc(i);
  if (process.env.MOCK_AI === "true") return send(res, 200, mockPresentation(i, c));
  rateLimit(s.sid);
  send(res, 200, await askJson(presentationPrompt(i, c, body.feasibility), { maxTokens: 6000 }));
});
