import { handle, readJson, send } from "../lib/http.js";
import { requireSession, rateLimit } from "../lib/auth.js";
import { cleanInputs, calc } from "../lib/calc.js";
import { feasibilityPrompt } from "../lib/prompts.js";
import { askJson } from "../lib/claude.js";
import { mockFeasibility } from "../lib/mock.js";

export default handle(async (req, res) => {
  const s = requireSession(req);
  const body = await readJson(req);
  const i = cleanInputs(body.inputs), c = calc(i);
  if (process.env.MOCK_AI === "true") return send(res, 200, mockFeasibility(i, c));
  rateLimit(s.sid);
  send(res, 200, await askJson(feasibilityPrompt(i, c)));
});
